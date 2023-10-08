const server = require("../../../javascript/server");
function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
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
        that.setData({
          options: res.data.detail,
        })
      }
    })
  },
  download(event){
    var id = event.target.id
    wx.downloadFile({
      url: server.url + '/activity/manage/getActivityRecord?id=' + id,
      header: {'Authentication': server.token},
      filePath: wx.env.USER_DATA_PATH + '/' + uuid() + '.xlsx',
      success: function (res) {
        console.log(res)
        const filePath = res.filePath;
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          fileType: 'xlsx',
          success: function (res) {
            console.log('打开文档成功', res)
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
})