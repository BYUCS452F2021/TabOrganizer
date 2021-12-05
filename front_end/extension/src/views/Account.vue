<template>
  <div class="account">
    <div class="account_header">My Tabs</div>

    <div id="box" class="scrollBox">
      <div v-for="folder in folders" :key="folder.folderId">
        <div class="folderRow">
          <img src="icons/folder.png" class="folderIcon" width="26" height="26" @click="openFolder(folder)">
          <h2>{{folder.folderName}}</h2>
          <img src="icons/down-arrow.png" class="down-arrow" :id="'reveal_contents:'+folder.folderId" width="26" height="26" @click="revealFolderContents(folder)">
          <img src="icons/trash.png" class="trash" width="26" height="26" @click="deleteFolder(folder)">
        </div>
        <div class="itemView" :id="folder.folderId">
          <div v-for="item in folder.folderContents" :key="item.itemId">
            <div class="itemRow">
              <img :src="item.itemIcon" class="item_img" width="20" height="20">
              <div class="itemNameColumn">
                <strong>{{ item.itemName }}</strong>
                <a :href="item.itemUrl">{{ item.itemUrl }}></a>
              </div>
              <div class="edit_item">
                <img src="icons/pen.png" class="item_pen" width="20" height="20" @click="editItem(folder.folderId, item)">
              </div>
              <img src="icons/trash.png" class="item_trash" width="20" height="20" @click="deleteItem(folder, item)">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="addFolder">
      <img src="icons/add.png" class="addButton" width="18" height="18" @click="addFolder">
      <div class="addFolderText"> Add Folder</div>
    </div>

    <div class="addFolderOverlay" v-show="createNewFolderOverlay">
        <p>Enter Folder Name:</p>
        <form id="addFolderForm">
          <div class="field">
            <input type="text" id="name" name="name" />
          </div>
        </form>
        <div class="enterNameButton" id="enterNameButton" @click="createFolder">
          Enter
        </div>
    </div>

    <div class="edit_item_overlay">
      <div class="editItemOverlay" v-show="createEditItemOverlay">
        <!-- <p>Edit item's name and url</p> -->
        <form id="editItemform">
          <div class="edit_field">
            <p>Type new name</p>
            <input type="text" id="newName" name="newName" />
            <p>Type new url</p>
            <input type="text" id="newURL" name="newURL">
          </div>
        </form>
        <div class="editButton" id="editButton" @click="editItemFolder">
          Edit
        </div>
      </div> 
    </div>   

  </div>
</template>

<script>
import { getFolders, getItems, addFolder, addItem, deleteFolder, deleteItem, updateItem } from "../indexeddb"
export default {
  name: "Account",
  data() {
    return {
      folders: [],
      createNewFolderOverlay: false,
      createEditItemOverlay: false,
      itemToEdit: null,
      folderIdToEdit: null,
    };
  },
  async created() {
    let resp = await getFolders();

    for (let i = 0; i < resp.length; i++) {
      //get folder items
      let itemsResp = await getItems(resp[i].id)

      let items = []
      for (let j = 0; j < itemsResp.length; j++) {
        items.push({itemName: itemsResp[j].itemName, itemUrl: itemsResp[j].itemUrl, itemIcon: itemsResp[j].itemIcon, itemId: itemsResp[j].id})
      }

      //add to displayed list of folders
      this.folders.push({folderId: resp[i].id, folderName: resp[i].name, folderContents: items});
    }
  },
  methods: {
    revealFolderContents(folder) {
      if (document.getElementById(folder.folderId).style.display === "block") {
        document.getElementById(folder.folderId).style.display = "none";
        document.getElementById("reveal_contents:" + folder.folderId).className = "down-arrow";
        //close
      } else {
        document.getElementById(folder.folderId).style.display = "block";
        //open
        document.getElementById("reveal_contents:" + folder.folderId).className = "rotate-down-arrow";
      }
    },
    editItem(folderId, item) {
      this.createEditItemOverlay = true;
      this.itemToEdit = item;
      this.folderIdToEdit = folderId;
    },
    async editItemFolder() {
      const newItemName = document.getElementById("newName").value;
      const newItemURL = document.getElementById("newURL").value;
      let icon;
      if(newItemURL) {
        let domain = new URL(newItemURL)
        icon = domain.protocol + "//" + domain.hostname + "/favicon.ico";
      }

      if(await updateItem(this.itemToEdit, this.folderIdToEdit, newItemName, newItemURL, icon)) {

        let folderIndexToEdit = -1;
        for (let i = 0; i < this.folders.length; i++) {
          if (this.folderIdToEdit == this.folders[i].folderId) {
            folderIndexToEdit = i;
            break;
          }
        }

        let itemIndexToEdit = -1;
        for (let j = 0; j < this.folders[folderIndexToEdit].folderContents.length; j++) {
           if (this.itemToEdit.itemId == this.folders[folderIndexToEdit].folderContents[j].itemId) {
            itemIndexToEdit = j;
            break;
          }
        }

        if (newItemName) this.folders[folderIndexToEdit].folderContents[itemIndexToEdit].itemName = newItemName;
        if (newItemURL) this.folders[folderIndexToEdit].folderContents[itemIndexToEdit].itemUrl = newItemURL;
        if (icon) this.folders[folderIndexToEdit].folderContents[itemIndexToEdit].itemIcon = icon;
      }

      document.getElementById("editItemform").reset();
      this.createEditItemOverlay = false;
    },
    addFolder() {
      //opens up option to create folder name
      this.createNewFolderOverlay = true;
    },
    async createFolder() {
      //collect entered folder name and create folder
      this.createNewFolderOverlay = false;
      const newFolderName = document.getElementById("name").value;

      document.getElementById("addFolderForm").reset();

      //call endpoint to create new folder
      let newFolderId = await addFolder(newFolderName, Date.now());

      if (newFolderId === -1) return;

      let newFolderContents = await this.getTabs();

      //call endpoint to add each item to new folder
      let indicesToRemove = []
      for (let i = 0; i < newFolderContents.length; i++) {
        let item = newFolderContents[i];
        let newItemId = await addItem(newFolderId, item.itemName, item.itemUrl, item.itemIcon)
        if (newItemId != -1) {
          newFolderContents[i].itemId = newItemId;
        } else {
          indicesToRemove.push(i);
        }
      }

      for(let i in indicesToRemove) {
        newFolderContents.splice(i, 1);
      }

      //update UI with new folder
      let newFolder = {
        folderId: newFolderId,
        folderName: newFolderName,
        folderContents: newFolderContents
      }

      this.folders.push(newFolder)
    },
    async getTabs() {
      let newFolderContents = [];
      return new Promise(function(resolve) {
        chrome.windows.getAll({populate:true},function(windows){
          windows.forEach(function(window){
            window.tabs.forEach(function(tab){

              newFolderContents.push({
                itemName: tab.title,
                itemIcon: tab.favIconUrl,
                itemUrl: tab.url,
                itemId: Date.now() + Math.random()
              });

            });
          });

          return resolve(newFolderContents);
        });
      });
    },
    openFolder(folder) {
      for (let i = 0; i < folder.folderContents.length; i++) {
        chrome.tabs.create({
          url: folder.folderContents[i].itemUrl
        });
      }
    },
    async deleteFolder(folder) {
      if (await deleteFolder(folder.folderId)) {
        for (let i = 0; i < folder.folderContents.length; i++) {
          await deleteItem(folder.folderContents[i].itemId)
        }
        this.folders = this.folders.filter(f => f.folderId !== folder.folderId);
      }
    },
    async deleteItem(folder, item) {
      let resp = await deleteItem(item.itemId);

      if (resp) {
        //success, remove from UI
        folder.folderContents = folder.folderContents.filter(i => i.itemId !== item.itemId);
      }
    },
  }
};
</script>

<style lang="scss" scoped>

.account {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.down-arrow {
  float: right; 
  display: block;
  margin-left: auto;
  transform: rotate(-90deg);
}

.rotate-down-arrow {
  float: right; 
  display: block;
  margin-left: auto;
  transform: rotate(0deg);
}

.account_header {
  font-family: 'Architects Daughter', cursive;
  font-weight: bold;
  font-size: 30px;
  margin-top: 24px;
  margin-bottom: 12px;
}

.addFolderText{
  font-size: 18px;
  align-items: center;
}

.scrollBox {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 250px;
}

.folderRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  //justify-content: space-around;
  //margin: 25px 10px;
  //padding: 10px;
  width: 340px;
}

.folderRow h2 {
  overflow-wrap: break-word;
  width: 170px;
  text-align: start;
}

.itemView {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 10px 0px 10px 30px;
  display: none;
  overflow: hidden;
}

.itemRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  //justify-content: space-between;
  margin-bottom: 20px;
}

.itemNameColumn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
  width: 200px;
  white-space: nowrap;
}

.itemNameColumn strong{
  white-space: nowrap;
  width: 2000px;
}

.addFolder {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  width: 200px;
  font-family: 'Architects Daughter', cursive;
  margin-top: 20px;
}

.itemUrl {
  width: 130px;
  padding: 3px;
  overflow: hidden;
}

.addFolderOverlay {
  width: 200px;
  height: 170px;
  font-family: 'Architects Daughter', cursive;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  border: 2px;
  border-color: black;
  border-style: solid;
  background-color: white;
  font-size: 20px;
  box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7);
}

.editItemOverlay {
  width: 250px;
  height: 250px;
  font-family: 'Architects Daughter', cursive;
  text-align: center;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  position: absolute;
  border: 2px;
  border-color: black;
  border-style: solid;
  background-color: white;
  font-size: 20px;
  box-shadow: 0.3em 0.3em 0.3em rgba(0, 0, 0, 0.7);
}

form {
  color: #000000;
  font-weight: bold;
  font-size: 18px;
}
input {
  width: 175px;
  height: 20px;
}
.field {
  font-family: 'Architects Daughter', cursive;
}

.enterNameButton {
  background: lightblue;
  text-align: center;
  padding: 10px;
  border-radius: 25px;
  color: black;
  width: 70px;
  font-size: 15px;
  margin-top: 15px;
}

.enterNameButton:hover {
  background: #899fa3;
  color: white;
}


.editButton {
  background: lightblue;
  text-align: center;
  padding: 10px;
  border-radius: 25px;
  color: black;
  width: 70px;
  font-size: 15px;
  margin-top: 15px;
  margin-left: 31%;
}

.editButton:hover {
  background: #899fa3;
  color: white;
}


.folderIcon {
  float: left;
  margin-right: 20px;
  padding: 10px;
  border-radius: 40%;
}

.folderIcon:hover {
  background: lightblue;
}

.item_pen {
  float: right; 
  display: block;
  margin-left: auto;
  border-radius: 40%;
  padding: 5px;
}

.item_pen:hover {
  background: lightblue;
}

.item_trash {
  float: right;
  display: block; 
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 40%;
  padding: 5px;
}

.item_trash:hover {
  background: lightcoral;
}

.trash {
  float: right;
  display: block; 
  margin-left: 20px;
  border-radius: 40%;
  padding: 10px;
}

.trash:hover {
  background: lightcoral;
}

.addButton {
  margin-right: 20px;
  width: 30px;
  height: 30px;
  border-radius: 70px;
}

.addButton:hover {
  background: lightblue;
}

@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

</style>