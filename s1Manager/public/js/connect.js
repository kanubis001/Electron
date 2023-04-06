const request = require("request");
const { session } = require("electron");

module.exports = {
  conn: (url, apitoken) => {
    furl = url + "/web/api/v2.1/users/login/by-api-token";
    // let apiToken =
    //   "Nf5fCpaJoA257TGNRdSc3hjVlQSShVeH42mV1BDPTKFKctf2mENoNN82gqLIw6agla2oh9cEDSBXsebR";
    const options = {
      uri: furl,
      method: "POST",
      body: {
        data: {
          apiToken: apitoken,
        },
      },
      json: true,
    };
    
    return new Promise((resolve) => {
      
      request.post(options, (err, response, body) => {
        if(!response.body.data){
          resolve("err");
        }else{
          console.log(response.body)
          const textchange = response.body.data.token;
          resolve(textchange);
        }
      });
    });
  },
};
