// index.js
const server = require("../../javascript/server");

Page({
  data: {
    notice: '技术是开发它的人的共同灵魂。',
    active: 0,
    isTea: false,
    images: [
      'https://cdn.pixabay.com/photo/2023/04/01/16/23/doves-7892723_960_720.jpg',
      'https://cdn.pixabay.com/photo/2023/03/16/13/29/purple-crocuses-7856702_960_720.jpg',
      'https://cdn.pixabay.com/photo/2023/03/10/20/36/kitesurfing-7843135_960_720.jpg'
    ],
  },
  onLoad(){
    setTimeout(() => {
      if (server.role == 'admin' || server.role == 'tea'){
        this.setData({
          isTea: true
        })
      }else{
        this.setData({
          isTea: false
        })
      }
    }, 500);
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    if(event.detail==1){
      wx.redirectTo({
        url: '/pages/activity/home/index',
      })
    }else if(event.detail==2){
      wx.redirectTo({
        url: '/pages/user/my/index',
      })
    }
  },
  scanQRCode(){
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        if(res.scanType == 'QR_CODE'){
            wx.request({
              url: server.url + '/activity/sign_in_code/verify?code=' + res.result,
              method: 'GET',
              header: {'Authentication': server.token},
              success (res1){
                if (res1.statusCode == 200 && res1.data.status == 'success'){
                  wx.showToast({
                    icon: 'success',
                    title: '签到成功',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    icon: 'error',
                    title: res.data.msg,
                    duration: 2000
                  })
                }
              }
            })
        } else {
          wx.showToast({
            title: '编码类型有误',
            icon: 'error',
            duration: 1000
          })
        }
      }
    })
  }
})
