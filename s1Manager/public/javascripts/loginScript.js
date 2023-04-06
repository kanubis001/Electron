
$(()=>{
    $(".btn-2_disable").hide();
    // $("#url").on('change',()=>{
    //     const urlSelected=$("#url").val();
    //     alert(urlSelected);
    // })

    $("#loginconfirm").on('click',()=>{
        // 버튼을 클릭할때마다 이벤트 리스너가 등록되어 여러개의 alert창이 뜰 수 있음.
        // 아래 로직으로 리스너 초기화 하고 다시 생성되게 할 수 있음
        ipcRenderer.removeAllListeners();
        $(".btn-2_disable").show();
        $(".btn-2").hide();
        
        const url=$('#url').val();
        const apitoken=$("#apitoken").val();
        datalogin={"url":url,"apitoken":apitoken};
        ipcRenderer.send("login",datalogin);
        
        ipcRenderer.on("chk",(evt,cont)=>{
            if (cont=="success"){
                // alert(cont);
                ipcRenderer.send("closePopup");
                ipcRenderer.send("loginavail","true");
                
            }else if(cont=="err"){
                alert("로그인 실패")
                $(".btn-2_disable").hide();
                $(".btn-2").show();
                
            }
        })
    })
});
