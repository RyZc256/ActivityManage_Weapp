var server = require('../../../javascript/server.js')

Page({
  data: {
    activityList: [],
    qrcodeShow: false,
    isActivity: false,
    qrCode: '',
    timer: null,
  },

  getQrCode(id){
    var that = this;
    wx.downloadFile({
      url: server.url + '/activity/sign_in_code/get?id=' + id,
      method: 'GET',
      header: {'Authentication': server.token},
      success (res) {
        console.log(res)
        that.setData({
          qrCode: res.tempFilePath
        })
      }
    })
  },

  onClick(event) {
    console.log(event)
    var id = event.currentTarget.id
    var that = this;
    that.getQrCode(id)
    that.data.timer = setInterval(function () {
        that.getQrCode(id)
     }, 11000);
    that.setData({
      qrcodeShow: true,
    })
  },

  onClose(){
    var that = this;
    clearInterval(that.data.timer);
    that.setData({
      qrcodeShow: false
    })
  },

  onLoad(){
    var that = this;
    wx.request({
      url: server.url + '/activity/today',
      method: 'GET',
      header: {'Authentication': server.token},
      success (res) {
        console.log(res)
        var data = res.data.detail
        var isActivity = true
        for (let i = 0; i < data.length; i++) {
          data[i]['poster'] = server.url + "/file/image?filename=" + data[i]['poster']
        }
        if(data.length != 0){
          isActivity = false
        } else {
          isActivity = true
        }
        that.setData({
          activityList: data,
          isActivity: isActivity
        })
      }
    })
  }
});

