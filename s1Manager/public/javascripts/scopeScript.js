const storage = require("electron-json-storage");
const fs = require("fs");
const os = require("os");
storage.setDataPath(os.tmpdir());
let glaccid;
// $(window).on("load", () => {
 
// });

$(() => {
  $("#edit").attr("disabled",true);
  $("#edit").on("click",()=>{
    
    unfixscopes();
  })
  $("#sel_scope").on("click", () => {
    grpid = $("#sel_scopegrp").val();
    console.log($("select[id=sel_scopeaccount]").val())
    console.log($("#sel_scopegrp").val())
    console.log($(".selsiteid").val())
    if($("select[id=sel_scopeaccount]").val()==null||$("select[id=sel_scopeaccount]").val()=="undefined"){
      alert("account 값이 없습니다.")
    } else if($(".selsiteid").val()==null||$(".selsiteid").val()=="undefined"||$(".selsiteid").val()=="none"){
      console.log($("#selsiteid").val())
      alert("site 값이 없습니다.")
    } else if ($("#sel_scopegrp").val() == "none"||$("#sel_scopegrp").val() == "undefined") {
      if (confirm("site 단위로 scope를 지정할까요?")) {
        fixscopes();
        return;
      } else {
        unfixscopes();
        return false;
      }
    } else {
      fixscopes();
      ipcRenderer.send("grpid", grpid);
    }
  });
  checkFile = () => {
    if (fs.existsSync("./jsonData/tmpjson/sinfo.json")) {
      // 파일이 존재하면 해당 파일에 대한 작업을 수행
      clearInterval(intervalId); // clearInterval() 함수를 사용하여 주기적인 체크를 중지
      console.log("File exists!");
      mkscopeview();
      $.LoadingOverlay("hide");
    }
  };
  // 1초마다 checkFile() 함수 호출
  const intervalId = setInterval(checkFile, 1000);

  $("select[id=sel_scopeaccount]").on("change",  () => {
    $(`.selsiteid`).remove();
    $(`.selectgid`).remove();
    const accid = $("select[id=sel_scopeaccount] option:selected").val();
    // document.cookie = `accountid=${accid}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    console.log("accountid", accid);
    $(`#sel_scopesite_${accid}`).show();
    glaccid = accid;
    
    ipcRenderer.send("accid", accid);
    // ipcRenderer.removeAllListeners();

    // $.cookie('accid',accid);
  });
  
  ipcRenderer.on("gosites", (evt, accid) => {
    // console.log(accid);
    // 1초마다 checkFile() 함수 호출
    $.LoadingOverlay("show", {
      background: "rgba(0, 0, 0, 0.5)",
      image: "../views/pic/img.gif",
      maxSize: 60,
      // fontawesome      : "fa fa-spinner fa-pulse fa-fw",
      fontawesomeColor: "#FFFFFF",
    });
    chkaccid = () => {
      
      storage.get("sites", (error, datas) => {
        if (error) throw error;
        console.log(datas[0].accountId, accid);
        if (datas[0].accountId && datas[0].accountId == accid) {
          clearInterval(intervalId);
          $("#sitesselect")
            .append(`<select class="selsiteid" id="sel_scopesite_${accid}">
      <option value="none" >site를 선택하세요</option>
  </select>`);
          for (const item of datas) {
            // if (chk == 0) {
            //   // $(`#${accountId}`).append(`<p>${item.accountName}</p>`)
            //   $(`#${accid}`).append(`${item.accountName}`);
            // }
            // $('.scopes').append(`<div class="siteScope" id="${item.id}">${item.name}</div>`);
            $(`#sel_scopesite_${accid}`).append(
              `<option id="${item.id}" value="${item.id}">${item.name}</option>`
            );
          }
          $.LoadingOverlay("hide");
          $(".selsiteid").on("change", () => {
            $(`.selectgid`).remove();
            const accid = $("select[id=sel_scopeaccount] option:selected").val();
            const siteid = $(
              `select[id="sel_scopesite_${accid}"] option:selected`
            ).val();
            // console.log("siteid", siteid);
            ipcRenderer.send("groupinfo", siteid);
            ipcRenderer.send("siteid", siteid);
            $.LoadingOverlay("show", {
              background: "rgba(0, 0, 0, 0.5)",
              image: "../views/pic/img.gif",
              maxSize: 60,
              // fontawesome      : "fa fa-spinner fa-pulse fa-fw",
              fontawesomeColor: "#FFFFFF",
            });
          });



        }
      });
    };
    const intervalId = setInterval(chkaccid, 1000);

  });

  ipcRenderer.on("grinfo", (evt, datas) => {
    $.LoadingOverlay("hide");
    const grps = datas.data;
    if ($("#sel_scopegrp")) {
      $("#sel_scopegrp").remove();
    }

    $("#groupselect").append(`<select class="selectgid" id="sel_scopegrp">
  <option value="none" >group을 선택하세요</option>
</select>`);
    for (const grp of grps) {
      $(`#sel_scopegrp`).append(
        `<option id="${grp.id}" value="${grp.id}">${grp.name}</option>`
      );
      // console.log(grp);
    }
  });
});

saveAccount = async (datas) => {
  const groupedById = datas.reduce((acc, curr) => {
    const id = curr.accountId;
    if (acc[id]) {
      acc[id].push(curr);
    } else {
      acc[id] = [curr];
    }
    return acc;
  }, {});

  return groupedById;
};
mkscopeview = async () => {
  try {
    const datas = fs.readFileSync("./jsonData/tmpjson/sinfo.json"); // 파일을 동기적으로 읽어옴
    // const siteArr = JSON.parse(datas).siteinfo; // JSON 파싱
    let siteJson = JSON.parse(datas).siteinfo; // JSON 파싱
    siteJson = JSON.parse(siteJson).data;
    // 화면에 출력
    const sitesArr = siteJson.sites;
    sortedsites = await saveAccount(sitesArr);

    for (const accountId in sortedsites) {
      // console.log(`accountId: ${accountId}`);
      const items = sortedsites[accountId];
      // $('.scopes').append(`<div class="accScope" id="${accountId}"></div>`);
      $("#sel_scopeaccount").append(
        `<option id="${accountId}" value="${accountId}"></option>`
      );
      chk = 0;
      //     $("#sitesselect")
      //       .append(`<select class="selsiteid" id="sel_scopesite_${accountId}">
      //     <option value="" >site를 선택하세요</option>
      // </select>`);
      for (const item of items) {
        if (chk == 0) {
          //         // $(`#${accountId}`).append(`<p>${item.accountName}</p>`)
          $(`#${accountId}`).append(`${item.accountName}`);
        }
        //       // $('.scopes').append(`<div class="siteScope" id="${item.id}">${item.name}</div>`);
        //       $(`#sel_scopesite_${accountId}`).append(
        //         `<option id="${item.id}" value="${item.id}">${item.name}</option>`
        //       );
        chk += 1;
        //       // console.log(`  name: ${item.name}`);
        //       $(`#sel_scopesite_${accountId}`).hide();
      }
    }
  } catch (err) {
    console.error(err); // 에러 발생 시 예외 처리
  }
};
fixscopes = () => {
  $("select[id=sel_scopeaccount]").attr("disabled", true);
  $("select[class=selsiteid]").attr("disabled", true);
  $("select[id=sel_scopegrp").attr("disabled", true);
  $("#edit").attr("disabled",false);
  $("#sel_scope").attr("disabled",true);
};
unfixscopes = () => {
  $("select[id=sel_scopeaccount]").attr("disabled", false);
  $("select[class=selsiteid]").attr("disabled", false);
  $("select[id=sel_scopegrp").attr("disabled", false);
  $("#sel_scope").attr("disabled",false);
  $("#edit").attr("disabled",true);
};
