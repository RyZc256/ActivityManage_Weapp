const server = require("../../../javascript/server");

// pages/user/wx/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  bind(){
    var that = this;
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          wx.request({
            url: server.url + '/user/bind/wx',
            method: 'POST',
            data: {
              'id':that.data.account,
              'password':that.data.password,
              'code':res.code
            },
            success(res1){
              if(res1.statusCode == 200 && res1.data.status == 'success'){
                Dialog.alert({
                  message: '绑定成功',
                }).then(() => {
                  wx.navigateBack()
                });
              } else {
                Dialog.alert({
                  message: '绑定失败',
                });
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
   
  }
})