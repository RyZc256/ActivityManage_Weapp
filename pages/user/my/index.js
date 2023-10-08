// pages/user/my/index.js
const app = getApp();
var server = require('../../../javascript/server');

function getUserInfo(){
  
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 2,
    show: false,
    userInfo: null,
    isLogin: true,
    isSuperAdmin: false,
    role: null,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(){
    var that = this
    if(server.role == 'admin'){
      this.setData({
        isSuperAdmin: true,
        isLogin: false
      })
    }
    wx.request({
      url: server.url + '/user/info/get',
      method: 'POST',
      header: {'Authentication': server.token},
      success (res) {
        if(res.statusCode == 401){
          wx.showToast({
            title: '未登录',
            icon: 'error',
            duration: 1000
          })
        } else {
          if(res.data.status == 'success'){
            var detail = res.data.detail;
            that.setData({
              isLogin: false,
              userInfo: detail
            })
          }
        }
      },
    })
  },

  // 导航栏
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    if(event.detail==0){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }else if(event.detail==1){
      wx.redirectTo({
        url: '/pages/activity/home/index',
      })
    }
  },

  // 底部弹窗
  imageTap(){
    this.setData({
      show: true
    })
  },
  
  // 底部弹窗关闭
  onClose(){
    this.setData({
      show: false
    })
  },

  // 上传头像
  uploadImage(){
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles.tempFilePath)
        console.log(res.tempFiles.size)
      }
    })
  },
  hdImage(){
    
  },
  // 绑定微信
  bandwx(){
    if(server.token != null){
      wx.showToast({
        title: '该账号已经绑定微信',
        icon: 'success',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/wx/index',
      })
    }
  },
  login(){
    var that = this;
    wx.login({
      success (res) {
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
                that.setData({
                  isLogin: false
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
  },
  onLoad(){
    var that = this;
    var role = '学生'
    if (server.role == 'tea')
        role = '教师'
    that.setData({
      role: role
    })
  },
})