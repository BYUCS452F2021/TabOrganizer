
const DB_NAME = 'TabOrganizedDB';
const DB_VERSION = 1; // Use a long long for this value (don't use a float) //Use Versions to change structure of database or run onupgradeneeded()
const DB_STORE_NAME = 'TabOrganizerStore';

var db;

// Used to keep track of which view is displayed to avoid uselessly reloading it
var current_view_pub_key;


function openDb() {
    console.log("openDb() ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    
    //If Database opens corectly, triggers this hook
    req.onsuccess = function (evt) {
      // Equal to: db = req.result;
      db = this.result;
      console.log("openDb() DONE", db);
    };
    req.onerror = function (evt) {
      console.error("openDb():", evt.target.errorCode);
    };

    //Anytime Version Number changes, triggers upgrade needed. 
    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      
      let oldVersion = evt.oldVersion;
      let newVersion = evt.newVersion || db.version;
      console.log('DB updated from version', oldVersion, 'to', newVersion);

      if(!db.objectStoreNames.contains(TabOrganizerStore))
      {
        var store = evt.currentTarget.result.createObjectStore(
            DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    
          store.createIndex('biblioid', 'biblioid', { unique: true });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('year', 'year', { unique: false });
      }
      
    };
  }

// cursor.execute("""INSERT INTO ITEM(FolderID, ItemName, ItemUrl, ItemIcon) VALUES (%s, %s, %s, %s)""",(folder_id, item_name, item_url, item_icon))               
function addItem(folderIDRef, itemNameRef, itemUrlRef, itemIconRef)
{
    let item = {
        id,
        folderID: folderIDRef,
        itemName : itemNameRef,
        itemUrl : itemUrlRef,
        itemIcon : itemIconRef
    };

    let tx = makeTX(DB_STORE_NAME, 'readwrite');
    tx.oncomplete = (ev) => {
    console.log(ev);
    };

    let store = tx.objectStore(DB_STORE_NAME);
    let request = store.add(item);
    
    request.onsuccess = (ev) => {
        console.log('successfully added an item object');
    };
    request.onerror = (err) => {
        console.log('error in request to add');
    };

}


//   cursor.execute("""INSERT INTO folder(FolderName, DateUpdated, UserID) VALUES (%s, %s, %s)""",(folder_name, folder_updated, user_id))
function addFolder(nameRef, dateUpdatedRef)
{
    let folder = {
        id,
        name: nameRef,
        dateUpdated : dateUpdatedRef
    };

    let tx = makeTX(DB_STORE_NAME, 'readwrite');
    tx.oncomplete = (ev) => {
      console.log(ev);
    };

    let store = tx.objectStore(DB_STORE_NAME);
    let request = store.add(folder);
    
    request.onsuccess = (ev) => {
        console.log('successfully added a folder object');
      };
      request.onerror = (err) => {
        console.log('error in request to add');
      };

}


function makeTransaction(storeName, mode) {
    let tx = db.transaction(storeName, mode);
    tx.onerror = (err) => {
      console.warn(err);
    };
    return tx;
  }