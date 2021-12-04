<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async created() {
    this.$router.push("/account");
  },
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
