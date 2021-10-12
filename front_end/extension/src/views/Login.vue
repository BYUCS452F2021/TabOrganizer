<template>
  <div class="login">
    <div class="app_name">Tab Organizer</div>

    <form id="loginForm">
      <!-- <h3>Login</h3> -->
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

.app_name {
  font-family: 'Architects Daughter', cursive;
  padding-top: 25px;
  font-size: 30px;
  font-weight: bold;
}

form {
  color: #000000;
  font-weight: bold;
  font-size: 18px;
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
  font-family: 'Architects Daughter', cursive;
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

@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

</style>
