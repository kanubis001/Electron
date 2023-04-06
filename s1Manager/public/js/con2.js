const request=require("request");

module.exports={
    conn:()=>{
        const url="https://apne1-samsungsds.sentinelone.net/web/api/v2.1/users/login/by-api-token"
        var apiToken="Nf5fCpaJoA257TGNRdSc3hjVlQSShVeH42mV1BDPTKFKctf2mENoNN82gqLIw6agla2oh9cEDSBXsebR"
        
        const options={
            uri:url,
            method:"POST",
            body:{
                "data":{
                    'apiToken':apiToken
                }
            },
            json:true
        }
        request.post(options,(err,httpResponse,body)=>{
            console.log(body)
        })


    }
}
        