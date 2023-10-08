// pages/activity/manage/index.js
const server = require("../../../javascript/server.js");
import Dialog from '@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
      if (server.role == 'stu'){
        Dialog.alert({
          title: '提示',
          message: '您似乎没有权限操作欸',
        }).then(() => {
          wx.navigateBack()
        });
      }
  },

})