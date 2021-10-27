import axios from "axios";

var hostName = "http://127.0.0.1:5002";

export async function register(
  username,
  password
) {
  try {
    let response = await axios.post(
      hostName + "/register",
      {
        username: username,
        password: password
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function login(
  username,
  password
) {
  try {
    let response = await axios.post(
      hostName + "/login",
      {
        username: username,
        password: password
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function addFolder(
  folderName,
  dateUpdated
) {
  let userId = await getUserId();
  try {
    let response = await axios.post(
      hostName + "/addfolder",
      {
        FolderName: folderName,
        DateUpdated: dateUpdated,
        UserID: userId
      }
    );
    return response.data; //returns new folder id
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function addItem(
  folderId,
  itemName,
  itemUrl,
  itemIcon
) {
  try {
    let response = await axios.post(
      hostName + "/additem",
      {
        FolderID: folderId,
        ItemName: itemName,
        ItemUrl: itemUrl,
        ItemIcon: itemIcon
      }
    );
    return response.data; //returns user id who owns folder being added to
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function getFolders() {
  try {
    let userId = await getUserId();
    let response = await axios.post(
      hostName + "/userfolders",
      {
        UserID: userId
      }
    );
    console.log(response.data)
    return response.data; //returns list of folders
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function getItems(folderId) {
  try {
    let response = await axios.post(
      hostName + "/useritems",
      {
        FolderID: folderId
      }
    );
    return response.data; //returns list of items in a folder
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function deleteFolder(folderId) {
  try {
    let response = await axios.post(
      hostName + "/deletefolder",
      {
        FolderID: folderId
      }
    );
    return response.data; //returns 1 if successful
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}

export async function deleteItem(itemId) {
  try {
    let response = await axios.post(
      hostName + "/deleteitem",
      {
        ItemID: itemId
      }
    );
    return response.data; //returns 1 if successful
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}


async function getUserId() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get("userId", function(value) {
        resolve(value.userId);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}