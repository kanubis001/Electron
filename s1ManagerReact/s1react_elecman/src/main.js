const {app, BrowserWindow} = require('electron');

function createWindow() {
  const win = new BrowserWindow({
      width:1600,
      height:900
  }); // 1600*900 창 생성
  win.loadURL(
      'http://localhost:3000'
  ) //생성한 창에 url 실행, url 없으면 index.html
}

app.on('ready', createWindow);