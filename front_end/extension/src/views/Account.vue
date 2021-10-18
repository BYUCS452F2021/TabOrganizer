<template>
  <div class="account">
    <div class="account_header">My Tabs</div>

    <div id="box" class="scrollBox">
      <div v-for="folder in folders" :key="folder.folderId">
        <div class="folderRow">
          <img src="icons/folder.png" style="float: left; padding-right: 20px" class="arrow" width="26" height="26" @click="openFolder(folder)">
          {{folder.folderName}}
          <img src="icons/down-arrow.png" class="down-arrow" width="26" height="26" @click="revealFolderContents(folder)">
          <img src="icons/trash.png" class="trash" width="26" height="26">
        </div>
        <div class="itemView" :id="folder.folderId">
          <div v-for="item in folder.folderContents" :key="item">
            <div class="itemRow">
              <img :src="item.itemIcon" class="item_img" width="26" height="26">
              <div class="itemName">{{ item.itemName }}</div>
              <div class="itemUrl">{{ item.itemUrl }}></div>
              <img src="icons/pen.png" class="item_pen" width="20" height="20">
              <img src="icons/trash.png" class="item_trash" width="20" height="20">
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

  </div>
</template>

<script>
export default {
  name: "Account",
  data() {
    return {
      folders: null,
      createNewFolderOverlay: false,
    };
  },
  async created() {
    this.folders = [{folderId: 1, folderName: "folder1", folderContents: [{
        itemName: "thing1",
        itemIcon: "icons/arrow.png",
        itemUrl: "https://en.wikipedia.org/wiki/Potato",
      },
      ]},]; 
    
    //TODO: call endpoint get all folders
  },
  methods: {
    revealFolderContents(folder) {
      if (document.getElementById(folder.folderId).style.display === "block") {
        document.getElementById(folder.folderId).style.display = "none";
      } else {
        document.getElementById(folder.folderId).style.display = "block";
      }
    },
    addFolder() {
      //opens up option to create folder name
      this.createNewFolderOverlay = true;
    },
    createFolder() {
      //collect entered folder name and create folder
      this.createNewFolderOverlay = false;
      const newFolderName = document.getElementById("name").value;

      document.getElementById("addFolderForm").reset();

      let newFolderContents = [];

      chrome.windows.getAll({populate:true},function(windows){
        windows.forEach(function(window){
          window.tabs.forEach(function(tab){

            newFolderContents.push({
              itemName: tab.title,
              itemIcon: tab.favIconUrl,
              itemUrl: tab.url,
            });

          });
        });
      });

      //TODO: call endpoint to create new folder

      //update UI with new folder
      let newFolder = {
        folderId: 23820, //Will be the id returned from the endpoint
        folderName: newFolderName,
        folderContents: newFolderContents
      }

      this.folders.push(newFolder)
    },
    openFolder(folder) {
      for (let i = 0; i < folder.folderContents.length; i++) {
        chrome.tabs.create({
          url: folder.folderContents[i].itemUrl
        });
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
}

.trash {
  float: right;
  display: block; 
  margin-left: 20px;
}

.item_pen {
  float: right; 
  display: block;
  margin-left: auto;
}

.item_trash {
  float: right;
  display: block; 
  margin-left: 10px;
  margin-right: 5px;
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
}

.scrollBox {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 250px;
}

.folderRow {
  display: flex;
  flex-direction: row;
  //justify-content: space-between;
  //margin: 25px 10px;
  padding: 10px;
  width: 300px;
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
  //justify-content: space-between;
}

.itemRow p {
  overflow: hidden;
  width: 50px;
}

.addFolder {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 25px;
  width: 200px;
  font-family: 'Architects Daughter', cursive;
  margin-top: 20px;
}

.addButton {
  margin-right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 70px;
}

.itemName {
  width: 50px;
  padding: 5px;
  overflow: hidden;
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
  box-shadow: 0.1em 0.1em 0.1em rgba(0, 0, 0, 0.3);
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

@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

</style>