import axios from "axios";
const fetch = require('node-fetch');

var hostName = "http://127.0.0.1:5002";

export async function register(
  username,
  password
) {
  try {
    let response = await axios.post(
      hostName + "/user",
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
    console.log("what")

    const url = hostName + "/user";
    const headers = {
      "Content-Type": "application/json"
    }
    const data = {
      "username": username,
      "password": password
    }

    fetch(url, { method: 'GET', headers: headers, body: data})
      .then((res) => {
        return res.json()
    })
    .then((json) => {
      // Do something with the returned data.
      console.log(json);
    });

    // let response = await axios.get(
    //   hostName + "/user",
    //   {
    //     data: JSON.stringify({
    //       "username": username,
    //       "password": password
    //     })
    //   }
    // );
    return response.data;
  } catch (error) {
    console.log(error.response);
    return -1;
  }
}