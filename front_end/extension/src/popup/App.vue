<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async created() {
    //TODO: check if logged in, if so push /account

    //else...
    this.$router.push("/");
  }
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
