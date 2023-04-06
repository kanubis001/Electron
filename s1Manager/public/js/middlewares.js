const request = require("request");
const fs = require("fs");
const https = require("https");
const storage = require("electron-json-storage");
module.exports = {
  chkstorage:()=>{
    storage.getAll((error,data)=>{
      if (error) throw error;
      console.log(data);
    })
  },
  whereru: async (url, token) => {
    const options = {
      uri: url + "/web/api/v2.1/groups?token=" + token,
    };
    console.log(url + "/web/api/v2.1/groups?token=" + token);
    request.get(options, (err, httpResponse, body) => {
      console.log(body);
    });
  },
  whoru: (url, token) => {

    uri = url + "/web/api/v2.1/user?token=" + token;
    https
      .get(uri, (res) => {
        // data 파트만 뽑아내서 하나로 만드는 부분
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // 받아온 데이터 처리
          //data 부분만 사용하므로 datas.data로 불러다 쓰면 됨
          // console.log("!",data);
          datas = JSON.parse(data);
          fs.writeFile("./jsonData/tmpjson/userinfo.json", data, (err) => {
            console.log(datas.data.id, "user information saved");
          });
        });
      })
      .on("error", (err) => {
        console.log("에러 발생:", err.message);
      });
  },

  saveSiteinfo: async (url, token, datas) => {
    console.log("chk");
    const data_acc = datas.data;
    const add_url = "/web/api/v2.1/sites?limit=1000&";
    const furl = url + add_url + "token=" + token;
    console.log("?", furl);

    try {
      const data = await new Promise((resolve, reject) => {
        https
          .get(furl, (res) => {
            let data = "";
            res.on("data", (chunk) => {
              data += chunk;
            });
            res.on("end", () => {
              resolve(data);
            });
          })
          .on("error", (err) => {
            console.error("Error: ", err.message);
            reject(err);
          });
      });

      const jsonObj = { siteinfo: data };
      fs.writeFile(
        "./jsonData/tmpjson/sinfo.json",
        JSON.stringify(jsonObj),
        async (err) => {
          if (err) {
            console.error("Error: ", err.message);
            throw err;
          } else {
            console.log("Info saved.");
            await module.exports.reforgeSiteinfo();
          }
        }
      );
    } catch (err) {
      console.error("Error: ", err.message);
    }
  },
  saveSiteinfo_old: async (url, token, datas) => {
    data_acc = datas.data;
    add_url = "/web/api/v2.1/sites?limit=1000&";
    furl = url + add_url + "token=" + token;
    console.log(furl);
    https
      .get(furl, (res) => {
        // data 파트만 뽑아내서 하나로 만드는 부분
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // 받아온 데이터 처리
          let jsonObj = new Object();
          jsonObj.siteinfo = data;
          // 저장될때는 역슬래시 붙지만. parse로 디코딩 하면 역슬래시 사라지니깐 참고
          // fs.writeFileSync("./jsonData/tmpjson/sinfo.json",JSON.stringify(jsonObj));
          fs.writeFile(
            "./jsonData/tmpjson/sinfo.json",
            JSON.stringify(jsonObj),
            (err) => {
              console.log("info saved");
              if (err) {
                console.log(err);
                throw err;
              }
            }
          );
        });
      })
      .on("error", (err) => {
        console.log("에러 발생:", err.message);
      });
  },
  reforgeSiteinfo: () => {
    let accarr = new Array();
    let sitearr = new Array();
    fs.readFile("./jsonData/tmpjson/sinfo.json", (err, data) => {
      datas = JSON.parse(data);
      sitesInfo = JSON.parse(datas.siteinfo);
      sortedSites = sitesInfo.data.sites.sort();
      // console.log(sortedSites);
      const sortedObj = { sorted_sites: sortedSites };
      // sortedObj.sortedsites = sortedSites;
      fs.writeFile(
        "./jsonData/tmpjson/sortedsiteinfo.json",
        JSON.stringify(sortedObj),
        (err) => {
          if (err) throw err;
          // console.log(sortedObj)
          console.log("append sorted sites");
        }
      );
      // console.log(sitesInfo.data.sites[0],"loaded");
      // console.log(sitesInfo.data.sites[0],"loaded");
    });
  },
  fileControl: (cord) => {
    dir = "./jsonData/tmpjson";
    if (cord == "c") {
      fs.rmdirSync(dir, { recursive: true });
    } else if (cord == "d") {
      fs.mkdirSync(dir, { recursive: true });
    }
  },
  findSites:(accid)=>{
    storage.get('tkinfo', async(error, tkdata)=> {
      if (error) throw error;
      // console.log("storage",tkdata.token, tkdata.url)
      add_url="/web/api/v2.1/sites?accountId="+accid
      furl = tkdata.url + add_url + "&token=" + tkdata.token;
      https.get(furl, async(res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        await res.on("end", () => {
          datas = JSON.parse(data);
          // console.log(datas.data.sites)
          storage.set("sites",datas.data.sites,(err)=>{
            if(err) throw err;
            return;
          })
        });
      })
      .on("error", (err) => {
        console.log("에러 발생:", err.message);
      });

    });

  },
  findGroups: (url, token, siteid) => {

    console.log("id=", siteid);
    add_url = "/web/api/v2.1/groups?limit=200&siteIds=" + siteid;
    furl = url + add_url + "&token=" + token;
    https
      .get(furl, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          // 받아온 데이터 처리
          //data 부분만 사용하므로 datas.data로 불러다 쓰면 됨
          datas = JSON.parse(data);
          // console.log(data);
          fs.writeFileSync("./jsonData/tmpjson/grinfo.json", data);
          // fs.writeFile("./jsonData/tmpjson/userinfo.json", data,(err)=>{
          //   console.log(datas.data.id,"그룹 정보 저장");
          // });
        });
      })
      .on("error", (err) => {
        console.log("에러 발생:", err.message);
      });
  },
};
