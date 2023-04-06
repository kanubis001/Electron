// const { shell } = require('electron');
// const fs = require('fs');

$(window).on("load", () => {
  ipcRenderer.removeAllListeners("userinfo");
  $.LoadingOverlay("show", {
    background: "rgba(0, 0, 0, 0.5)",
    image: "../views/pic/img.gif",
    maxSize: 60,
    // fontawesome      : "fa fa-spinner fa-pulse fa-fw",
    fontawesomeColor: "#FFFFFF",
  });
  setTimeout(async () => {
    // $.LoadingOverlay("hide");
    setTimeout(async () => {
      ipcRenderer.send("userinfo");
    }, 1000);

    await $("#scopetop").load("scopeview.html");
  }, 1000);

  // setTimeout(async() => {
  //   $.LoadingOverlay("hide");

  //   await $('#scopetop').load("scopeview.html");}, 1000);

  // setTimeout(async() => {
  //   $.LoadingOverlay("hide");
  //   await $('#contents').load("scopeview.html");}, 1000);
  ///////////////////////스코프 지정 버튼 없애기
  // $("#scope").on('click', async()=>{
  //   $.LoadingOverlay("show", {
  //     background       : "rgba(0, 0, 0, 0.5)",
  //     image            : "../views/pic/img.gif",
  //     maxSize          : 60,
  //     // fontawesome      : "fa fa-spinner fa-pulse fa-fw",
  //     fontawesomeColor : "#FFFFFF",
  //   });
  //   setTimeout(async() => {
  //     $.LoadingOverlay("hide");
  //     await $('#contents').load("scopeview.html");}, 1000);
  // })
  ///////////////////////스코프 지정 버튼 없애기

  $("#report").on("click", () => {
    $("#contents").load("reportview.html");
  });
});
$(()=>{
$("#menu_endpoints").on("click",()=>{
  $("#contents").load("endpoints.html");

})



});
// $(() => {
//   ipcRenderer.removeAllListeners('userinfo');
//   ipcRenderer.send('userinfo');

//   $("#scope").on('click', ()=>{
//     $('#contents').load("scopeview.html");
//     // $('#contents').attr(`include-html="scopeview.html"`);
//     // ipcRenderer.removeAllListeners('userinfo');
//     // ipcRenderer.send('userinfo');
//     // ipcRenderer.on("useravail",(evt,cont)=>{
//     //   alert(cont)
//     // })
//     // console.log(ds);
//   })
//   $("#report").on('click',()=>{
//     $('#contents').load("reportview.html");
//   })

//   // const links = document.querySelectorAll('a');
//   // for(const link of links){
//   //   link.addEventListener ("click",(event)=>{
//   //     event.preventDefault();
//   //     const targetId = link.getAttribute('href').substr(1);
//   //     const targetDiv = document.getElementById("contents");

//   //     // content1.html 또는 content2.html 파일 로드
//   //     targetDiv.innerHTML = '';
//   //     const filePath = `file://${__dirname}\\${targetId}.html`;
//   //     console.log(filePath)
//   //     ipcRenderer.send('load-content',filePath)
//   //     shell.openExternal(filePath, { activate: true });
//   //   })
//   // }
//     // $('#jstree').jstree({
//   //     "core" : {
//   //         "themes" : {
//   //           "variant" : "small"
//   //         }
//   //       },
//   //       "types" : {
//   //         "default" : {
//   //           "icon" : false
//   //         },
//   //     },
//   //       "checkbox" : {
//   //         "keep_selected_style" : false
//   //       },
//   //       "plugins" : [ "types" ]
//   //     });

//   // $('#jstree').on("changed.jstree", function (e, data) {
//   //     console.log(data.selected);
//   //   });
//   //   $('button').on('click', function () {
//   //     $('#jstree').jstree(true).select_node('child_node_1');
//   //     $('#jstree').jstree('select_node', 'child_node_1');
//   //     $.jstree.reference('#jstree').select_node('child_node_1');
//   //   });

//   // $('#back').on("click",()=>{
//   //   history.back()
//   // });

// });
