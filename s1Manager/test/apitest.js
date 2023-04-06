const connecting = require("../js/connect");

url = "https://apne1-samsungsds.sentinelone.net";
// 비동기로 불러온 토큰값을 JSON으로 저장.
connecting.conn(url).then((res) => {
  const tkinfo = { tkinfo: res };
  console.log(tkinfo)
});
// JSON으로 저장된 토큰만 불러옴.
