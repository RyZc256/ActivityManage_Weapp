const server = require("../../../javascript/server");

// pages/activity/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    datashow: false,
    options: [],
    activityList: [],
    fieldValue: '',
    cascaderValue: '',
  },
  onClick() {
    this.setData({
      show: true,
    });
  },

  onClose() {
    this.setData({
      show: false,
    });
  },

  onFinish(e) {
    var that = this;
    const { selectedOptions, value } = e.detail;
    const fieldValue = selectedOptions
        .map((option) => option.text || option.name)
        .join('/');
    that.setData({
      fieldValue,
      cascaderValue: value,
      show: false,
    })
    console.log(selectedOptions)
    var url = server.url + '/activity/manage/getActivityByDate?year=' + that.data.fieldValue.split('/')[0] + "&month=" + that.data.fieldValue.split('/')[1];
    wx.request({
      url: url,
      method: 'GET',
      header: {'Authentication': server.token},
      success(res){
        if (res.statusCode == 200 && res.data.status == 'success'){
          if (res.data.detail.length != 0){
            that.setData({
              activityList: res.data.detail,
              datashow: true
            })
          }else{
            that.setData({
              activityList: [],
              datashow: false
            })
          }
        }
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.request({
      url: server.url + '/activity/manage/getYearMonth',
      method: 'GET',
      header: {'Authentication': server.token},
      success (res) {
        console.log(res)
        var date = new Date()
        that.setData({
          options: res.data.detail,
        })
      }
    })
  },
  edit(event){
      var id = event.target.id;
      wx.navigateTo({
        url: '/pages/activity/pubish/index?id=' + id,
      })
  },
})