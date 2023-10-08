module.exports = {
  getUserKey : getUserKey,//保存登录的用户信息
  getOpenPwKey : getOpenPwKey,//保存开门的钥匙
  getToken: getToken,
  getUrl: getUrl,//host接口
  url: 'http//localhost', // 服务器地址
  token: null,
  uid: null,
  role: null
}

//接口URL==============
function getUrl(){
  return "https://am.api.epoches.cn:9500";
}

//本地保存数据的key==============
//保存登录的用户信息
function getUserKey(){
  return "userInfo";
}
//保存开门的钥匙
function getOpenPwKey() {
  return "openpw";
}

function getToken() {
  return '123';
}

function setToken(token) {
  this.token = token;
}
