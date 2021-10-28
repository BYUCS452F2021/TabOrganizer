<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async created() {
    //check if logged in, if so push /account
    let userId = await this.getUserId();
    if (userId) {
      console.log(userId, " is logged in")
      this.$router.push("/account");
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    async getUserId() {
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
  }
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
