<template>
  <div class="account">
    <h1>My Tabs</h1>

    <div id="box" class="scrollBox">
      <div v-for="folder in folders" :key="folder.folderId">
        <div class="folderRow">
          <img src="icons/arrow.png" class="arrow" width="26" height="26" @click="openFolder(folder)">
          {{folder.folderName}}
          <img src="icons/arrow.png" class="arrow" width="26" height="26" @click="revealFolderContents(folder)">
          <img src="icons/arrow.png" class="arrow" width="26" height="26">
        </div>
        <div class="itemView" :id="folder.folderId">
          <div v-for="item in folder.folderContents" :key="item">
            <div class="itemRow">
              <img :src="item.itemIcon" class="arrow" width="26" height="26">
              <p>{{ item.itemName }}</p>
              <p>{{ item.itemUrl }}></p>
              <img src="icons/tab_icon.png" class="arrow" width="26" height="26">
              <img src="icons/tab_icon.png" class="arrow" width="26" height="26">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="addFolder">
      <img src="icons/tab_icon.png" class="addButton" width="26" height="26" @click="addFolder">
      Add Folder
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

.scrollBox {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 250px;
}

.folderRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  justify-content: space-between;
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
  margin-right: 15px;
  width: 30px;
  height: 30px;
  padding: 5px;
  border-radius: 70px;
}

.addButton:Hover {
  margin-right: 15px;
  width: 30px;
  height: 30px;
  padding: 5px;
  border-radius: 70px;
  box-shadow: 0.015em 0.015em 0.015em rgba(0, 0, 0, 0.3);
  background-color: lightblue;
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