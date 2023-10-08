// pages/clas/add/index.js
import Dialog from '@vant/weapp/dialog/dialog';
const server = require("../../../javascript/server.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    collegeList: [],
    class_name: '',
    fieldValue: '',
    columns: [],
    fisrtSelect: false,
  },

  onConfirm(event) {
    const { value } = event.detail;
    this.setData({
      show: false
    })
    Dialog.alert({
      title: '提示',
      message: '仅限于添加本年度班级',
    }).then(() => {
      this.setData({
        fieldValue: value,
        show: false,
        fisrtSelect: true,
      })
    });
  },

  onCancel() {
    this.setData({
      show: false,
    })
  },

  onClick() {
    this.setData({
      show: true,
    });
  },


  onLoad() {
    var response = null;
      wx.request({
        url: server.url + '/college/get',
        method: 'GET',
        header: {'Authentication': server.token},
        success (res) {
            response = res.data.detail
        }
      })
      setTimeout(() => {
        var columns = [];
        for (let i=0;i<response.length;i++){
          columns.push(response[i].name)
        }
        this.setData({
          collegeList: response,
          columns: columns,
        })
      }, 500);
  },

  clickAdd(){
    var college_id = 0;
    for(let i=0;i<this.data.collegeList.length;i++){
      if(this.data.fieldValue === this.data.collegeList[i].name){
        college_id = this.data.collegeList[i].id
        break;
      }
    }
    wx.request({
      url: server.url + '/college/add',
      method: 'POST',
      data: {'college_id': college_id, 'class_name': this.data.class_name},
      header: {'Authentication': server.token},
        success (res) {
            if (res.statusCode == 403){
              Dialog.alert({
                title: '提示',
                message: '您无权限，请联系超管进行添加班级'
              });
            } else if(res.statusCode == 200){
              if(res.data.status == 'success'){
                Dialog.confirm({
                  title: '提示',
                  confirmButtonText: '完成',
                  cancelButtonText: '继续',
                  message: '添加成功，是否继续添加'
                })
                .then(() => {
                  wx.navigateBack();
                })
                .catch(() => {
                  // on cancel
                });
              } else {
                wx.showToast({
                  icon: 'error',
                  title: '添加失败',
                  duration: 1000
                })
              }
            }
        }
    })
  }
})