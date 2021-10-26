<template>
  <div>
    <div class="back_arrow">
      <router-link
        id="backToLogin"
        to="/"
        class="loginLink"
      >
        <img src="icons/arrow.png" class="arrow" width="26" height="26">
      </router-link>
    </div>
    <div class="register">
      <!--<h1>Tab Organizer</h1>-->
      <div class="register_header">Register</div>
      <form id="registerForm">
        <div class="field">
          <label for="username">Username:</label><br />
          <input type="text" id="username" name="username" /><br />
        </div>
        <div class="field">
          <label for="pwd">Password:</label><br />
          <input type="password" id="pwd" name="pwd" />
        </div>
      </form>

      <div class="fail" id="failMessage" v-show="registerFail">
        Invalid Username 
      </div>

      <div class="registerButton" id="registerButton" @click="register">
        Register
      </div>
    </div>
  </div>
</template>

<script>
import {register} from "../ServerFacade"
export default {
  name: 'Register',
  data() {
    return {
      registerFail: false,
    };
  },
  methods: {
    async register() {
      //get user input of username and password
      this.registerFail = false;
      const userPassword = document.getElementById("pwd").value;
      const userName = document.getElementById("username").value;

      console.log(userName + " " + userPassword)
      
      //call register api here
      let userId = await register(userName, userPassword);

      //if register is unsuccessful
      if (userId === -1) {
        document.getElementById("registerForm").reset();
        this.registerFail = true;
        return;
      }

      //if register successful then set userId locally and push route
      chrome.storage.local.set({ userId: userId });
      this.$router.push("/account");

    },
  }
}
</script>

<style lang="scss" scoped>

.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.arrow {
  float: left;
}

.loginLink {
  display: flex;
  align-items: left;
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

.register_header {
  font-family: 'Architects Daughter', cursive;
  font-weight: bold;
  font-size: 30px;
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

.registerButton {
  background: lightblue;
  text-align: center;
  padding: 10px;
  margin: 20px 0px 30px 0px;
  box-shadow: 0.1em 0.1em 0.1em rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  color: black;
  width: 120px;
  font-size: 15px;
}
.registerButton:hover {
  background: #899fa3;
  color: white;
}

@import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

</style>