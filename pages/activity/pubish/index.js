// pages/activity/pubish/index.js
var server = require('../../../javascript/server.js')
var useDatetime = ['start_time', 'end_time', 'open_time']
import Dialog from '@vant/weapp/dialog/dialog';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2099, 12, 31).getTime(),
    currentDate: new Date().getTime(),
    datetimeChecked: false,
    uploadChecked: false,
    localtio_detail: '',
    usePopupField: '',
    introduce: '',
    start_time: '',
    end_time: '',
    localtion: '',
    detail: '',
    open_time: '',
    student: '',
    people: 0,
    poster: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(JSON.stringify(options) != "{}"){
      this.selectInfo(options.id)
    }
  },
  selectInfo(id){
      var data = null;
      var that = this;
      wx.request({
        url: server.url + '/activity/manage/getActivity?id=' + id,
        method: 'GET',
        header: {'Authentication': server.token},
        success: (res)=>{
          data = res.data.detail
        }
      })
      that.setData({
        introduce: data['introduce'],
        detail: data['detail'],
        start_time: data['start_time'],
        end_time: data['end_time'],
        localtion: data['localtion'],
        numbers: data['number'],
        visible: data['visible'],
        open_time: data['open_time'],
        teacher: data['teacher'],
        student: data['student'],
        poster: server.url + '/file/image?filename=' + data['poster']
      })
  },
  stepperOnChange(event){
    this.setData({
      people: event.detail
    })
  },

  fieldTap(event){
    var that = this;
    console.log(event)
    console.log(event.currentTarget.id)
    if (useDatetime.indexOf(event.currentTarget.id) > -1){
      that.setData({
        usePopupField: event.currentTarget.id,
        datetimeChecked: true,
      })
    } else if (event.currentTarget.id === "localtion"){
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
            })
          }else{
            wx.chooseLocation({
              success: function (res) {
                that.setData({
                  localtion: res.address + res.name
                })
              }
            })
          }
        }
      })
    }
  },
  datetimePickerOnConfirm(event){
    var that = this;
    const use = that.data.usePopupField;
    var date = new Date(event.detail)
    var formatDate = date.getFullYear()+
                    "-"+(date.getMonth()+1)+
                    "-"+date.getDate()+
                    " "+date.getHours()+
                    ":"+date.getMinutes()+
                    ":"+date.getSeconds()
    if (use.length != 0){
      that.setData({
        [use]: formatDate,
        currentDate: new Date().getTime(),
        usePopupField: '',
        datetimeChecked: false
      });
    }
  },
  datetimePickerOnCancel(){
    this.setData({
      currentDate: new Date().getTime(),
      usePopupField: '',
      datetimeChecked: false,
    })
  },
  uploadButton(){
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        that.setData({
          uploadChecked: true
        })
        var tempFilePath = res.tempFiles[0].tempFilePath;
        wx.uploadFile({
          filePath: tempFilePath,
          header: {'Authentication': server.token},
          name: 'file',
          url: server.url + '/file/upload/image',
          formData: {
            'data': 'bank_img'
          },
          success: (res) => {
            var result = JSON.parse(res.data)
            that.setData({
              poster: server.url + '/file/image?filename=' + result['detail']['path']
            })
          },
          complete(){
            that.setData({
              uploadChecked: false
            })
          }
        })
      },
    })
  },

  mate(){
    var that = this;
    if (that.data.introduce == ""){
      Dialog.alert({
        title: '提示',
        message: '请输入活动名称',
      })
      return false
    } else if (that.data.start_time == ""){
      Dialog.alert({
        title: '提示',
        message: '请选择开始时间',
      })
      return false
    } else if (that.data.end_time == ""){
      Dialog.alert({
        title: '提示',
        message: '请选择结束时间',
      })
      return false
    } else if (that.data.localtion == ""){
      Dialog.alert({
        title: '提示',
        message: '请选择位置',
      })
      return false
    }
    if (new Date(that.data.end_time) < new Date(that.data.start_time)){
      Dialog.alert({
          title: '提示',
          message: '结束时间不得早于开始时间',
        })
      return false
    } else if (new Date(that.data.start_time) < new Date(that.data.open_time)){
      Dialog.alert({
          title: '提示',
          message: '报名开始时间不到晚于开始时间',
      })
      return false
    }
    return true;
  },

  publish(){
    var that = this;
    var open_time = '';
    if (that.data.open_time == ''){
      open_time = that.data.start_time;
    } else {
      open_time = that.data.open_time;
    }
    if (that.mate()){
      var data = {
        'introduce': that.data.introduce,
        'detail': that.data.detail,
        'start_time': that.data.start_time,
        'end_time': that.data.end_time,
        'localtion': that.data.localtion,
        'numbers': that.data.people,
        'visible': 1,
        'open_time': open_time,
        'teacher': null,
        'student': that.data.student == null ? null : that.data.student,
        'poster': that.data.poster.replace(server.url + '/file/image?filename=',"")
      };
      wx.request({
        url: server.url + '/activity/manage/publish',
        method: 'POST',
        header: {'Authentication': server.token},
        data: data,
        success(res){
          if (res.statusCode == 200 && res.data.status == "success"){
            Dialog.alert({
              message: '发布成功',
            }).then(() => {
              wx.navigateBack()
            });
          } else {
            wx.showToast({
              icon: 'error',
              title: '发布失败',
              duration: 2000
            })
          }
        }
      })
    }
    
  }
})