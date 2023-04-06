// const { ipcRenderer } = require("electron");
$(() => {

  $('.login-btn').on("click",()=>{
    ipcRenderer.removeAllListeners('openPopup');
    // location.replace("mainpage.html");
    ipcRenderer.send("openPopup");
    // window.open("/views/loginpop.html","로그인","width=600, height=450")
    // location.href="mainpage.html";
  });


});

// const openPopupBtn = document.getElementById("open-popup");
// openPopupBtn.addEventListener("click", () => {
  // ipcRenderer.send("open-popup");
// });