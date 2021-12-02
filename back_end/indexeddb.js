
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