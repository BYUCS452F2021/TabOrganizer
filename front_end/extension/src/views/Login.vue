<template>
  <div class="login">
    <h1>Tab Organizer</h1>
    <h2>Login</h2>

    <form id="loginForm">
      <div class="field">
        <label for="username">Username:</label><br />
        <input type="text" id="username" name="username" /><br />
      </div>
      <div class="field">
        <label for="pwd">Password:</label><br />
        <input type="password" id="pwd" name="pwd" />
      </div>
    </form>

    <div class="fail" id="failMessage" v-show="loginFail">
      Username or password is incorrect
    </div>

    <div class="loginButton" id="loginButton" @click="login">
      Login
    </div>

    <router-link
      id="Register"
      to="/register"
      class="registerLink"
    >
      No account? Register here
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginFail: false,
    };
  },
  methods: {
    async login() {
      //get user input of username and password
      this.loginFail = false;
      const userPassword = document.getElementById("pwd").value;
      const userName = document.getElementById("username").value;

      console.log(userName + " " + userPassword)
      
      //call login api here

      //if login successful then set userId locally and push route
      chrome.storage.local.set({ userId: "someUserId" });
      this.$router.push("/account");

      //else if unsuccessful
      /*
      document.getElementById("loginForm").reset();
      this.loginFail = true;
      */

    },
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

form {
  color: #000000;
  font-weight: bold;
  font-size: 15px;
  margin-top: 30px;
}
input {
  margin-top: 5px;
  width: 250px;
  height: 20px;
}
.field {
  padding: 5px;
  margin-bottom: 10px;
}
.fail {
  font-size: 10px;
  color: red;
  padding: 2px;
}
.loginButton {
  background: blue;
  text-align: center;
  padding: 10px;
  margin: 20px 0px 30px 0px;
  box-shadow: 0.1em 0.1em 0.1em rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  color: white;
  width: 120px;
  font-size: 15px;
}
.loginButton:hover {
  background: #899fa3;
}
.registerLink {
  text-decoration: none;
  color: black;
  font-size: 12px;
}
.registerLink:hover {
  text-decoration: none;
  color: blue;
  font-size: 12px;
}
</style>
