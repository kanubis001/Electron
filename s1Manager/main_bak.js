const {
  app,
  BrowserWindow,
  ipcMain,
  webContents,
  session,
} = require("electron");
const { syncBuiltinESMExports } = require("module");
const path = require("path");
const connecting = require("./public/js/connect");
const midfunc = require("./public/js/middlewares");
const fs = require("fs");
const ipc=ipcMain;
// const connecting = require('./js/connect')
//  창 정의
const createWindow = () => {
  const options = {
    width: 600,
    height: 400,
    minWidth:600,
    minHeight:400,
    maxWidth:1200,
    maxHeight:800,
    center: true,
    // titleBarStyle: "hiddenInset",
    frame:false,
    webPreferences: {
      // 전처리 경로
      preload: path.join(__dirname, "preload.js"),
      //require 같은걸 쓸 수 있게 해준다.
      nodeIntegration: true,
      contextIsolation: false,
    },
  };



  const mainWin = new BrowserWindow(options);
  ipc.on('minimizeApp', ()=>{
    mainWin.minimize();
  })

  ipc.on('maximizeApp', ()=>{
    if(mainWin.isMaximized()){
      mainWin.restore();
    } else {
      mainWin.maximize();
    }
  })

  ipc.on('closeApp', ()=>{
    mainWin.close();
  })
  mainWin.loadFile("./views/index.html");

  const sess = mainWin.webContents.session;
  console.log(sess.getUserAgent());
};
//어플리케이션 실행후 동작할 것 지정
app.whenReady().then(async () => {
  createWindow();
  // API TOKEN은 비동기로 불러와서 씀
  url = "https://apne1-samsungsds.sentinelone.net";
  // 비동기로 불러온 토큰값을 JSON으로 저장.
  await connecting.conn(url).then((res) => {
    const tkinfo = { tkinfo: res };
    const tkinfoJSON = JSON.stringify(tkinfo);
    fs.writeFileSync("./jsonData/tokeninfo.json", tkinfoJSON);
  });
  // JSON으로 저장된 토큰만 불러옴.
  const tkBuffer = fs.readFileSync("./jsonData/tokeninfo.json");
  tkData = JSON.parse(tkBuffer);
  console.log(tkData.tkinfo);

  // let apples = 10;

  // ipcMain.on("reqCount", (e) => {
  //   e.reply("count", apples);
  // });
  // ipcMain.on("reqSteal", (e) => {
  //   apples--;
  //   e.reply("count", apples);
  // });
  // ipcMain.on("reqBroadcast", (e) => {
  //   const contents = webContents.getAllWebContents();
  //   for (const c of contents) c.send("count", apples);
  // });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
