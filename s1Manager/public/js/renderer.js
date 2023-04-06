// renderer.js
// const { remote } = require('electron');

// 컨텐츠 로드 이벤트 처리


// ipcRenderer.on('load-content', (event, arg) => {
//     console.log("!")
//   const targetDiv = document.getElementById(arg);
//   targetDiv.innerHTML = '';
//   console.log("1",targetDiv)
//   // 해당 파일 로드
//   const filePath = `./public/views/${arg}.html`;
//   fetch(filePath)
//     .then((response) => response.text())
//     .then((html) => {
//       targetDiv.innerHTML = html;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });
// document.getElementById('report').addEventListener('click', () => {
//     const content = document.querySelector('#contents')
//     // content.innerHTML = '<h1>Menu 1</h1><p>Content for Menu 1 goes here.</p>'
//     content.innerHTML = '<object data="reportview.html"></object>'
//   })
  
//   // document.getElementById('scope').addEventListener('click', () => {
//   //   const content = document.querySelector('#contents')
//   //   content.innerHTML = '<object data="scopeview.html"></object>'
//   //   ipcRenderer.send('userinfo');
//   // })
  
//   document.getElementById('menu3').addEventListener('click', () => {
//     const content = document.querySelector('.content')
//     content.innerHTML = '<h1>Menu 3</h1><p>Content for Menu 3 goes here.</p>'
//   })
