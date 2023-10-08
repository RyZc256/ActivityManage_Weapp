// pages/user/info/index.js
import Dialog from '@vant/weapp/dialog/dialog';
var server = require('../../../javascript/server.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      editStatus: true,
      userInfo: null,
      show: false,
      columns: ['男', '女'],
      tel: '',
      sex: '',
      address: '',
  },
  selectSex(){
    if (this.data.editStatus == false){
      this.setData({
        show: true
      })
    }
  },
  edit(){
    var that = this;
    if(this.data.editStatus == true){
      that.setData({
        editStatus: false
      })
    } else {
      that.setData({
        editStatus: true
      })
      var data = {
        'id': that.data.userInfo.id,
        'name': that.data.userInfo.name,
        'sex': that.data.sex,
        'idcard': that.data.userInfo.idcard,
        'end_time': that.data.userInfo.entrance_time,
        'address': that.data.address,
        'tel': that.data.tel,
      }
      if (server.role == 'tea'){
        data['clas'] = -1;
      } else {
        data['clas'] = that.data.userInfo.class.id;
      }
      wx.request({
        url: server.url + '/user/info/edit',
        method: 'POST',
        data: data,
        header: {'Authentication': server.token},
        success (res){ 
          if (res.statusCode == 200){
            wx.showToast({
              icon: 'success',
              title: '修改成功',
              duration: 1000,
            })
          } else if (res.statusCode == 403){
            Dialog.alert({
              title: '提示',
              message: '您无权限修改该信息',
            }).then(() => {
              wx.navigateBack();
            });
          } else if(res.statusCode == 401){
            Dialog.alert({
              title: '提示',
              message: '鉴权出错',
            })
          }
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      if(JSON.stringify(options) == "{}"){
        this.selectInfo(-1)
      }else{
        this.selectInfo(options.id)
      }
  },

  selectInfo(uid){
    var that = this;
    var url = '';
    if (uid == -1){
      url = server.url + '/user/info/get'
    }else{
      url = server.url + '/user/info/get?id=' + uid
    }
    wx.request({
      url: url,
      method: 'POST',
      header: {'Authentication': server.token},
      success (res) {
        if(res.statusCode == 401){
          Dialog.alert({
            title: '提示',
            message: '鉴权出错',
          });
        } else if(res.statusCode == 200) {
          if(res.data.status == 'success'){
            var detail = res.data.detail;
            that.setData({
              isLogin: false,
              userInfo: detail,
              address: detail.address,
              tel: detail.tel,
              sex: detail.sex
            })
          }
        } else if(res.statusCode == 403) {
          Dialog.alert({
            title: '提示',
            message: '您无权限查询该信息',
          }).then(() => {
            wx.navigateBack();
          });
        }
      },
    })
  },
  onConfirm(event){
    const { value } = event.detail;
    this.setData({
      show: false,
      sex: value,
    })
  },
  onCancel(event){
    this.setData({
      show: false
    })
  }
})