var server = require('../../../javascript/server.js')

Page({
  data: {
    value: '',
    show: false,
    searchTips: true,
    classStus: [],
    options: [
      {
        text: 'null',
        value: '14',
        children: [],
      },
      {
        text: 'null1',
        value: '13',
        children: [],
      }],
    fieldValue: '',
    cascaderValue: ''
  },

  // 点击输入框
  onClick() {
    this.setData({
      show: true,
    });
  },

  // 级联关闭
  onClose() {
    this.setData({
      show: false,
    });
  },

  // 级联选择完成
  onFinish(e) {
    const { selectedOptions, value } = e.detail;
    var that = this;
    const fieldValue = selectedOptions
        .map((option) => option.text || option.name)
        .join('/');
    that.setData({
      fieldValue,
      cascaderValue: value,
      show: false,
      searchTips: false,
    })

    wx.request({
      url: server.url + '/college/getStudent?id=' + this.data.cascaderValue,
      method: 'GET',
      header: {'Authentication': server.token},
      success (res) {
        that.setData({
          classStus: res.data.detail
        })
      }
    })
  },

  // 级联选择发生改变
  onChange(e){
      const { value } = e.detail;
      var that = this;
      // 三级标签
      if (typeof value != 'number'){
        var values = value.split('-');
        console.log(values)
        var firstPosition, secondPosition = 0;
        for(let i=0;i<that.data.options.length;i++){
          if(values[0] == that.data.options[i].value){
            firstPosition = i;
            break;
          }
        }
        for(let i=0;i<that.data.options[firstPosition].children.length;i++){
          if(values[1] == that.data.options[firstPosition].children[i].value.split('-')[1]){
            secondPosition = i;
            break;
          }
        }
        var position = 'options[' + firstPosition + '].children[' + secondPosition + '].children';
        wx.request({
          url: server.url + '/college/get?id=' + values[0] + '&year=' + values[1],
          method: 'GET',
          header: {'Authentication': server.token},
          success(res){
            let response = res.data.detail
            var children = [];
            for(let i=0;i<response.length;i++){
              children.push({text: response[i].name, value: response[i].id})
            }
            setTimeout(() => {
              that.setData({
                [position]: children
              })
            }, 500);
          }
        })
      // 二级标签
      }else{
        var index = 0;
        for(let i=0;i<that.data.options.length;i++){
          if(value === that.data.options[i].value){
            index = i;
            break;
          }
        }
        var position = 'options[' + index + '].children';
        wx.request({
          url: server.url + '/college/getYear?id=' + value,
          method: 'GET',
          header: {'Authentication': server.token},
          success(res){
            let response = res.data.detail
            var children = [];
            for(let i=0;i<response.length;i++){
              children.push({text: response[i] + '级',
               value: value + '-' + response[i],
               children: []})
            }
            setTimeout(() => {
              that.setData({
                [position]: children
              })
            }, 500);
          }
        })
      }
  },

  // 页面加载
  onLoad(){
    var that = this;
    let options = that.data.options;
    wx.request({
      url: server.url + '/college/get',
      method: 'GET',
      header: {'Authentication': server.token},
      success (res) {
        let result = res.data.detail;
        options = [];
        for (let i=0;i<result.length;i++){
          options.push({text: result[i]['name'], value: result[i]['id'], children: []});
        }
        that.setData({
          options
        })
      }
    })
  }
})