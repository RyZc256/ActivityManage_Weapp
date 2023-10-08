// pages/activity/home/index.js
var server = require('../../../javascript/server.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    activityList: [],
    isActivity: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var isActivity = true;
    wx.request({
      url: server.url + '/activity/exist',
      method: 'GET',
      header: {'Authentication': server.token},
      success (res) {
        var data = res.data.detail
        console.log(data)
        for (let i = 0; i < data['data'].length; i++) {
          data['data'][i]['poster'] = server.url + "/file/image?filename=" + data['data'][i]['poster']
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
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
    if(event.detail==0){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }else if(event.detail==2){
      wx.redirectTo({
        url: '/pages/user/my/index',
      })
    }
  },
  onClick(event){
    var id = event.currentTarget.id;
    wx.request({
      url: server.url + '/activity/join?id=' + id,
      method: 'GET',
      header: {'Authentication': server.token},
      success(res){
        if (res.statusCode == 200 && res.data.status == 'success'){
          wx.showToast({
            icon: 'success',
            title: '参加成功',
            duration: 1000
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: res.data.msg,
            duration: 1000
          })
        }
      }
    })
  }
})