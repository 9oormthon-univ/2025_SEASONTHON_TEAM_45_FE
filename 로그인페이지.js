    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");

    function checkInput() {
      if (username.value.trim() && password.value.trim()) {
        loginBtn.classList.add("active");
        loginBtn.removeAttribute("disabled");
      } else {
        loginBtn.classList.remove("active");
        loginBtn.setAttribute("disabled", true);
      }
    }

    username.addEventListener("input", checkInput);
    password.addEventListener("input", checkInput);

    loginBtn.addEventListener("click", () => {
      if (loginBtn.classList.contains("active")) {
        alert("로그인 시도: " + username.value);
      }
    });
    password.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && loginBtn.classList.contains("active")) {
    loginBtn.click();
  }
});
