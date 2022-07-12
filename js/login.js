"use strict";

const elForm = document.querySelector(".login__form");
const elUserInput = document.querySelector(".input__username");
const elPaswordInput = document.querySelector(".input__password");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const usernameValue = elUserInput.value;
  const passwordValue = elPaswordInput.value;

  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: usernameValue,
      password: passwordValue,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.token) {
        window.localStorage.setItem("token", data.token);

        window.location.replace("index.html");
      } else {
        elPaswordInput.value = null;


        let wrong = alert("wrong email or password")
      }
    });
});
elUserInput.value = null;
