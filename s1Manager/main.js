const {
  app,
  BrowserWindow,
  ipcMain,
  webContents,
  session,
} = require("electron");
const os = require("os");
const storage = require("electron-json-storage");
// const { syncBuiltinESMExports } = require("module");
const express = require("express");
const path = require("path");
const connecting = require("./public/js/connect");
const midfunc = require("./public/js/middlewares");
const fs = require("fs");
const ipc = ipcMain;
const port = 3000;
// Express 애플리케이션 정의
const expressApp = express();
expressApp.use(express.json());
//해당 폴더를 정적으로 지정
expressApp.use(express.static(path.join(__dirname, "public")));
// expressApp.use(express.static(path.join(__dirname, 'views')));
// 라우팅 설정
expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/views/index.html"));
});
let mainWin;
// let sess;
storage.setDataPath(os.tmpdir());
// 창 정의
const createWindow = () => {
  const options = {
    width: 700,
    height: 350,
    minWidth: 600,
    minHeight: 400,
    maxWidth: 1200,
    maxHeight: 800,
    center: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  };

  mainWin = new BrowserWindow(options);

  // sess.cookies.set({
  //   url:"https://s1manager.comsys",
  //   name:"manager",
  //   value:"testval"
  // },(err)=>{
  //   if (err) console.error(err);
  // })

  ipc.on("minimizeApp", () => {
    mainWin.minimize();
  });

  ipc.on("maximizeApp", () => {
    if (mainWin.isMaximized()) {
      mainWin.restore();
    } else {
      mainWin.maximize();
    }
  });

  ipc.on("closeApp", () => {
    // midfunc.fileControl("d");
    mainWin.close();
  });

  // midfunc.fileControl("c");
  mainWin.loadURL(`http://localhost:${port}`);
  fs.rmdirSync("./jsonData/tmpjson", { recursive: true, force: true });
  fs.mkdirSync("./jsonData/tmpjson", { recursive: true, force: true });

  // 팝업 창 생성 및 로드
  ipc.on("openPopup", (event, url) => {
    const popupWin = new BrowserWindow({
      parent: mainWin, // 부모 창 지정
      width: 500,
      height: 400,
      resizable: false,
      // center: true,
      modal: true, // 모달 창으로 지정
      frame: false,
      show: false, // 창을 숨긴 상태로 생성
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });
    console.log("pop");
    popupWin.loadURL(`http://localhost:${port}/views/loginpop.html`);
    // ipc.on("openPopup", () => {
    //   popupWin.show();
    // });
    popupWin.show();
    event.preventDefault();
    ipc.on("closePopup", () => {
      popupWin.hide();
      event.preventDefault();
    });
    ipc.removeAllListeners("login");
    ipc.on("login", async (evt, data) => {
      if (data.url == "") {
        evt.sender.send("chk", "no URL");
      } else if (data.apitoken == "") {
        evt.sender.send("chk", "no apiToken");
      } else {
        try {
          const result = await connecting.conn(data.url, data.apitoken);
          // console.log("Res=", result);
          if (result == "err") {
            evt.sender.send("chk", "err");
          } else {
            //     sess.cookies.get({ url: "https://s1manager.comsys" }, (error, cookies) => {
            //   if (error) console.error(error);
            //   console.log(cookies);
            // });
            const tkinfo = { token: result, url: data.url };
            const tkinfoJSON = JSON.stringify(tkinfo);
            storage.set("tkinfo", { token: result, url: data.url }, function(
              error
            ) {
              if (error) throw error;
            });
            fs.writeFile(
              "./jsonData/tmpjson/tokeninfo.json",
              tkinfoJSON,
              async (err) => {
                evt.sender.send("chk", "success");
                test1 = await midfunc.whoru(data.url, result);
                console.log("whoru test", test1);
                mainWin.loadFile("./public/views/mainpage.html");
              }
            );
          }
        } catch (error) {
          console.log(error);
          evt.sender.send("chk", error.message);
        }
      }
    });
  });
};

// 어플리케이션 실행 후 동작할 것 지정
app.whenReady().then(() => {
  storage.clear(function(error) {
    if (error) throw error;
  });
  // Express 애플리케이션 실행
  expressApp.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
    // sess=mainWin.webContents.session;
    createWindow();
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  storage.clear(function(error) {
    if (error) throw error;
  });
  if (process.platform !== "darwin") app.quit();
});
ipc.on("groupinfo", async (evt, data) => {
  fs.readFile("./jsonData/tmpjson/tokeninfo.json", async (err, userdata) => {
    try {
      if (err) throw err;
      userdatas = JSON.parse(userdata);
      midfunc.findGroups(userdatas.url, userdatas.token, data);
      setTimeout(async () => {
        let grinfo = fs.readFileSync("./jsonData/tmpjson/grinfo.json");
        grinfo = JSON.parse(grinfo);
        // console.log("group", grinfo);
        await evt.sender.send("grinfo", grinfo);
      }, 1000); // 1초(1000ms)의 지연 실행

      // let grinfo=fs.readFileSync('./jsonData/tmpjson/grinfo.json');
      // grinfo = await JSON.parse(grinfo);
      // console.log("group",grinfo);
      // await evt.sender.send("grinfo",grinfo)

      // fs.readFile('./jsonData/tmpjson/grinfo.json', (error, data) => {
      //   if (error) {
      //     console.error(error);
      //     return;
      //   }
      //   const grinfo = JSON.parse(data);
      //   console.log("group",grinfo);
      //   evt.sender.send("hey",grinfo)
      // });
    } catch (err) {
      console.error(err);
    }
  });
  // evt.sender.send(" ",);
});

ipc.on("userinfo", (evt, data) => {
  // chkfile2=fs.existsSync("./jsonData/tmpjson/sinfo.json")
  // while(chkfile2==false){
  //   setTimeout(async () => {
  //     chkfile2=fs.existsSync("./jsonData/tmpjson/sinfo.json")
  //     console.log("sinfo",chkfile2);
  //   }, 1000);
  // }
  // chkfile2=fs.existsSync("./jsonData/tmpjson/sinfo.json")
  // console.log("sinfo",chkfile2);

  // if(!chkfile2){
  //   setTimeout(async () => {
  //     chkfile2=fs.existsSync("./jsonData/tmpjson/sinfo.json")
  //     console.log("sinfo",chkfile2);
  //   }, 3000);

  // }

  //로그인한 유저 정보 저장
  fs.readFile("./jsonData/tmpjson/tokeninfo.json", (err, tkdata) => {
    fs.readFile("./jsonData/tmpjson/userinfo.json", async (err, data) => {
      try {
        if (err) throw err;

        tokendatas = JSON.parse(tkdata);
        userdatas = JSON.parse(data);

        if (userdatas.data.scope == "account") {
          console.log("account scope user");
          await midfunc.saveSiteinfo(
            tokendatas.url,
            tokendatas.token,
            userdatas
          );
          // return userdatas.data.sites;
          // console.log("sss")
        }
        else if (userdatas.data.scope == "site") {
          console.log("site scope user");

          storage.get('tkinfo', async(error, data)=> {
            if (error) throw error;
            console.log("storage",data.token, data.url)
            await midfunc.saveSiteinfo(
              data.url,
              data.token,
              userdatas
            );
          });
        }

        // 다른 작업 수행
      } catch (err) {
        console.error("err", err);
      }
    });
  });
  // fs.readFile('./jsonData/tmpjson/userinfo.json',(err,data)=>{
  //   if (err){
  //     throw err;
  //   }
  //   datas=JSON.parse(data);
  //   fs.readFile('./jsonData/tmpjson/tokeninfo.json',(err,userdata)=>{
  //     userdatas=JSON.parse(userdata);
  //     if(datas.data.scope=="account"){
  //       async function saveAndReforge() {
  //         try {
  //           await midfunc.saveSiteinfo(userdatas.url, userdatas.token, datas);
  //           await midfunc.reforgeSiteinfo();

  //           console.log("saveSiteinfo and reforgeSiteinfo are done.");
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       }
  //       saveAndReforge();

  //   midfunc.saveSiteinfo(userdatas.url, userdatas.token, datas, (err,res) => {
  //     if (err){
  //       console.log(err)
  //     }
  //     console.log(res);
  //     midfunc.reforgeSiteinfo();
  // });
  // midfunc.saveSiteinfo(userdatas.url,userdatas.token,datas);
  // midfunc.reforgeSiteinfo();
  // }
  // midfunc.whereru(userdatas.url,userdatas.token)
  // midfunc.findsite(userdatas.url,userdatas.token);
  // console.log(userdatas.token);
  // console.log(userdatas.url);
  // });
  // whereru();

  // console.log(datas.data);
  evt.sender.send("useravail", "done");
  // })
});
ipc.on("accid", async(evt, accid) => {
  storage.set("acc", { accid: accid }, function(error) {
    if (error) throw error;
  });
  // const dataPath = storage.getDataPath();
  // console.log(dataPath);
  midfunc.findSites(accid);
  midfunc.chkstorage();
  evt.sender.send("gosites",accid);
});

ipc.on("siteid", (evt, siteid) => {
  storage.set("site", { siteid: siteid }, function(error) {
    if (error) throw error;
  });
  midfunc.chkstorage();
});

ipc.on("grpid", (evt, grpid) => {
  storage.set("grp", { grpid: grpid }, function(error) {
    if (error) throw error;
  });
  midfunc.chkstorage();
});






