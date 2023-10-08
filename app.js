// app.js
var server = require('./javascript/server.js')

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success (res) {
        console.log(res)
        // console.log(res.code)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: server.url + '/user/login/wx',
            method: 'GET',
            data: {code: res.code},
            success (res1) {
              if(res1.data.status=='success'){
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 1000
                })
                server.token = res1.data.detail.token
                server.uid = res1.data.detail.id
                server.role = res1.data.detail.role
                console.log(server.token)
              }else{
                wx.showToast({
                  title: res1.data.msg,
                  icon: 'error',
                  duration: 1000
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 定时任务
    setInterval(function()
    {
      wx.request({
        url: server.url + '/user/token/update',
        method: 'POST',
        header: {'Authentication': server.token},
        success (res) {
          server.token = res.data.detail.token
        }
      })
      console.log(server.token)
    }, 1740000)//间隔时间
  },
  globalData: {
    userInfo: null
  }
})
