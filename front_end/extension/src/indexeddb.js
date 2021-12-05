//import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'TabOrganizedDB';
const DB_VERSION = 1; // Use a long long for this value (don't use a float) //Use Versions to change structure of database or run onupgradeneeded()
const DB_ITEM_STORE_NAME = 'TabOrganizerItemStore';
const DB_FOLDER_STORE_NAME = 'TabOrganizerFolderStore';

var db;

async function openDb() {

    return new Promise(function(resolve) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);

      //If Database opens corectly, triggers this hook
      req.onsuccess = function () {
        // Equal to: db = req.result;
        db = this.result;
        return resolve(true);
      };
      req.onerror = function (evt) {
        console.error("openDb():", evt.target.errorCode);
        return resolve(false);
      };

      //Anytime Version Number changes, triggers upgrade needed.
      req.onupgradeneeded = function (evt) {

        let oldVersion = evt.oldVersion;
        let newVersion = evt.newVersion || db.version;
        console.log('DB updated from version', oldVersion, 'to', newVersion);

        db = this.result;
        if(!db.objectStoreNames.contains(DB_ITEM_STORE_NAME) || !db.objectStoreNames.contains(DB_FOLDER_STORE_NAME))
        {
          var store_item = evt.currentTarget.result.createObjectStore(
              DB_ITEM_STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store_item.createIndex("folderID", "folderID", { unique: false });
          //var store_folder = 
          evt.currentTarget.result.createObjectStore(
            DB_FOLDER_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
        return resolve(false); //brand new db will have empty responses so this is fine
      };
    })
}

// cursor.execute("""INSERT INTO ITEM(FolderID, ItemName, ItemUrl, ItemIcon) VALUES (%s, %s, %s, %s)""",(folder_id, item_name, item_url, item_icon))
export async function addItem(folderIDRef, itemNameRef, itemUrlRef, itemIconRef)
{
  if (await openDb()) {
    let item = {
        folderID: folderIDRef,
        itemName : itemNameRef,
        itemUrl : itemUrlRef,
        itemIcon : itemIconRef
    };

    let tx = makeTX(DB_ITEM_STORE_NAME, 'readwrite', db);
    tx.oncomplete = (ev) => {
      console.log(ev);
    };

    let store = tx.objectStore(DB_ITEM_STORE_NAME);
    return new Promise(function(resolve) {
      let request = store.add(item);

      request.onsuccess = (ev) => {
          console.log(ev);
          console.log('successfully added an item object');
          db.close();
          return resolve(request.result); //returns the id of the new item
      };
      request.onerror = (err) => {
        console.log(err);
          console.log('error in request to add');
          db.close();
          return resolve(-1);
      };
    });
  } else {
    return -1;
  }
}


//   cursor.execute("""INSERT INTO folder(FolderName, DateUpdated, UserID) VALUES (%s, %s, %s)""",(folder_name, folder_updated, user_id))
export async function addFolder(nameRef, dateUpdatedRef)
{
  if (await openDb()) {
    let folder = {
      name: nameRef,
      dateUpdated : dateUpdatedRef
    };

    let tx = makeTX(DB_FOLDER_STORE_NAME, 'readwrite', db);
    tx.oncomplete = (ev) => {
      console.log(ev);
    };

    let store = tx.objectStore(DB_FOLDER_STORE_NAME);
    return new Promise(function(resolve) {
      let request = store.add(folder);
      request.onsuccess = (ev) => {
        console.log(ev);
        console.log('successfully added a folder object');
        db.close();
        return resolve(request.result); //returns the id of the new folder
      };
      request.onerror = (err) => {
        console.log(err);
        console.log('error in request to add');
        db.close();
        return resolve(-1);
      };
    });
  } else {
    return -1;
  }
}

export async function deleteFolder(folderId)
{
  if (await openDb()) {

    let tx = makeTX(DB_FOLDER_STORE_NAME, 'readwrite', db);
    tx.oncomplete = (ev) => {
      console.log(ev);
    };

    let store = tx.objectStore(DB_FOLDER_STORE_NAME);
    return new Promise(function(resolve) {
      let request = store.delete(folderId);
      request.onsuccess = (ev) => {
        console.log('successfully deleted a folder object', ev);
        db.close();
        return resolve(true);
      };
      request.onerror = (err) => {
        console.log('error in request to delete', err);
        db.close();
        return resolve(false);
      };
    });
  } else {
    return false;
  }
}

export async function deleteItem(itemId)
{
  if (await openDb()) {

    let tx = makeTX(DB_ITEM_STORE_NAME, 'readwrite', db);
    tx.oncomplete = (ev) => {
      console.log(ev);
    };

    let store = tx.objectStore(DB_ITEM_STORE_NAME);
    return new Promise(function(resolve) {
      let request = store.delete(itemId);

      request.onsuccess = (ev) => {
          console.log('successfully deleted an item object', ev);
          db.close();
          return resolve(true);
      };
      request.onerror = (err) => {
        console.log('error in request to delete', err);
          db.close();
          return resolve(false);
      };
    });
  } else {
    return false;
  }
}

export async function getFolders() {

  if (await openDb()) {
    let tx = db.transaction(DB_FOLDER_STORE_NAME, "readonly");
    let store = tx.objectStore(DB_FOLDER_STORE_NAME, "readonly");
    let request = store.getAll();

    return new Promise(function(resolve) {
      request.onsuccess = (ev) => {
        //getAll was successful
        let request = ev.target; //request === getReq === ev.target
        db.close();
        return resolve(request.result);
      };
      request.onerror = (err) => {
        console.warn(err);
        db.close();
        return resolve([]); //error in transaction returns empty folders
      };
    });
  } else {
    return []; //error opening db returns empty folders
  }
}

export async function getItems(folderIdRef) {

  if (await openDb()) {
    let tx = db.transaction(DB_ITEM_STORE_NAME, "readonly");
    let store = tx.objectStore(DB_ITEM_STORE_NAME, "readonly");
    let folderIdIndex = store.index("folderID");

    return new Promise(function(resolve) {
      let request = folderIdIndex.getAll(folderIdRef);
      request.onsuccess = (ev) => {
        //get was successful
        let request = ev.target; //request === getReq === ev.target
        db.close();
        return resolve(request.result ? request.result : []);
      };
      request.onerror = (err) => {
        console.warn(err);
        db.close();
        return resolve([]);
      };
    });
  } else {
    return []; //error opening db returns empty folders
  }
}

export async function updateItem(itemObj, itemFolderIdRef, itemNameRef, itemUrlRef, itemIconRef) {
  if (await openDb()) {
    let tx = db.transaction(DB_ITEM_STORE_NAME, "readwrite");
    let store = tx.objectStore(DB_ITEM_STORE_NAME, "readwrite");

    let item = {
      id: itemObj.itemId,
      folderID: itemFolderIdRef,
      itemName : itemNameRef ? itemNameRef : itemObj.itemName,
      itemUrl : itemUrlRef ? itemUrlRef : itemObj.itemUrl,
      itemIcon : itemIconRef ? itemIconRef : itemObj.itemIcon,
    };
    
    return new Promise(function(resolve) {
      let request = store.put(item);
      request.onsuccess = (ev) => {
        console.log('successfully updated an object', ev);
        db.close();
        return resolve(true);
      };
      request.onerror = (err) => {
        console.log('error in request to update', err);
        db.close();
        return resolve(false);
      };
    });
  } else {
    return false;
  }
}



function makeTX(storeName, mode, db) {
    let tx = db.transaction(storeName, mode);
    tx.onerror = (err) => {
      console.warn(err);
    };
    return tx;
  }
