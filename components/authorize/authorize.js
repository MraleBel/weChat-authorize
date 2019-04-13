// components/authorize.js

let app = getApp();

Component({
  /**
   * 组件的属性列表
   */

  properties: {
    authorize: {
      type: String,
      value: "",
      observer: function(newVal, oldVal) {
        let that = this;
        that.data.authorizeText = "scope." + this.data.authorize
        let authorizeDesc = that.data.authorizeDesc;
        switch (newVal) {
          case "userInfo":
            authorizeDesc = "用户信息授权";
            break;
          case "userLocation":
            authorizeDesc = "位置授权";

            break;
          case "address":
            authorizeDesc = "通讯地址授权";

            break;
          case "invoiceTitle":
            authorizeDesc = "发票抬头授权";

            break;
          case "invoice":
            authorizeDesc = "发票授权";

            break;
          case "werun":
            authorizeDesc = "微信运动授权";

            break;
          case "record":
            authorizeDesc = "录音授权";

            break;
          case "writePhotosAlbum":
            authorizeDesc = "相册授权";

            break;
          case "camera":
            authorizeDesc = "摄像头授权";

            break;
          case "phoneNumber":
            authorizeDesc = "手机号授权";

            break;
        }
        that.setData({
          authorizeDesc: authorizeDesc
        })
      }
    },
    authorizeDesc: {
      type: String,
      value: "一键授权"
    },
    denyShowDesc: {
      type: String,
      value: "授权失败,请重新授权"
    },
    noOpenAuthorizeDesc: {
      type: String,
      value: '权限未开启,请重新打开'
    },
    dataId: { //用于接受使用页面传过来的id，在回调中会将传入的此值返回去
      type: String,
      value: ""
    },
    dataIndex: { //功能和id一致 只是接受的是number，用于在列表中判断点击的那一项，在回调中会将传入的此值返回去
      type: Number,
      value: -1 //-1为默认值即未使用该属性
    },
    dataObj: { //功能和id一致 只是接受的是Object，在回调中会将传入的此值返回去
      type: Object,
      value: null
    },

    isOnShowPopUp: {
      type: Boolean,
      value: false
    },
    isClickMaskClose: {
      type: Boolean,
      value: true
    },
 
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowAuthorize: false,
    logo: './imgs/wechat-logo.png',
    title: "开发者",
    authorizeTextBgColor: '#4ab218',
    authorizeText: '',
  },
  // 以下是官方的相应权限以及对应的api
  // scope.userInfo           wx.getUserInfo 用户信息
  // scope.userLocation       wx.getLocation,
  // wx.chooseLocation 地理位置
  // scope.address            wx.chooseAddress 通讯地址
  // scope.invoiceTitle       wx.chooseInvoiceTitle 发票抬头
  // scope.invoice            wx.chooseInvoice 获取发票
  // scope.werun              wx.getWeRunData 微信运动步数
  // scope.record             wx.startRecord 录音功能
  // scope.writePhotosAlbum   wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum 保存到相册
  // scope.camera 	          <camera /> 组件 	摄像头

  //***其他权限*/
  //  phoneNumber  ----获取手机号
  //  share  ----分享   
  attach: function() {


  },

  ready: function() {


    if (app.globalData && app.globalData.authorizeLogo) {

      this.setData({
        logo: app.globalData.authorizeLogo,
      })
    }
    if (app.globalData && app.globalData.authorizeTitle) {

      this.setData({
        title: app.globalData.authorizeTitle,
      })
    }
    if (app.globalData && app.globalData.authorizeTextBgColor) {

      this.setData({
        authorizeTextBgColor: app.globalData.authorizeTextBgColor,
      })
    }


  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      let that = this;
      if (that.data.isOnShowPopUp) {
        let authorizeText = "scope." + that.data.authorize;
        wx.getSetting({ //只返回请求过的权限
          success(res) {
            if (res.authSetting[authorizeText]) { //如果存在之前请求过此权限,并且权限授予状态是true
              that.customOperate();
            } else { //反之，弹框去请求此权限
              if (that.data.authorize == "userInfo" || that.data.authorize == "phoneNumber") {

                that.setData({
                  isShowAuthorize: true
                })
              } else {

                that.goAuthorize(authorizeText);
              }
            }
          }
        })

        that.setData({

        })
      }
    },

  },
  /**
   * 组件的方法列表
   */
  methods: {
    doOperate() {
      var that = this;
      if (!this.data.authorize) {
        wx.showModal({
          title: '未设置需要的权限',
          content: '请给组件的authorize属性设置需要的权限文本后重试',
        })
        return false
      }

      var authorizeText = this.data.authorizeText;
      wx.getSetting({ //只返回请求过的权限
        success(res) {
          if (res.authSetting[authorizeText]) { //如果存在之前请求过此权限,并且权限授予状态书true
            that.customOperate();
          } else { //反之，弹框去请求此权限
            that.goAuthorize(authorizeText);
          }
        }
      })
    },

    goAuthorize(authorizeText) {
      var that = this;

      wx.authorize({
        scope: authorizeText,
        success(res) {
          that.customOperate();
        },
        fail: function(res) {

          if (res.errMsg.search("auth deny") != -1) {
            that.setData({
              isShowAuthorize: true
            })
            that.onDeny(res)
          }
        }
      })
    },
    onClickMask(res) {
      var myEventDetail = res.detail || {} // detail对象，提供给事件监听函数
      myEventDetail.data = this.data.dataObj;
      myEventDetail.id = this.data.dataId;
      myEventDetail.index = this.data.dataIndex;

      this.triggerEvent('onClickMask', myEventDetail)
    },
    customOperate(res) {

      var myEventDetail = res || {} // detail对象，提供给事件监听函数
      myEventDetail.data = this.data.dataObj;
      myEventDetail.id = this.data.dataId;
      myEventDetail.index = this.data.dataIndex;

      this.triggerEvent('onAuthorize', myEventDetail)
    },
    onDeny(res) {

      var myEventDetail = res || {} // detail对象，提供给事件监听函数
      myEventDetail.data = this.data.dataObj;
      myEventDetail.id = this.data.dataId;
      myEventDetail.index = this.data.dataIndex;

      this.triggerEvent('onDeny', myEventDetail)
    },

    hiddenMask() {
      this.setData({
        isShowAuthorize: false
      })
    },
    openSetting: function(res) {
      var that = this;
      var authorizeText = this.data.authorizeText;
      if (res.detail.authSetting[authorizeText]) {
        that.setData({
          isShowAuthorize: false
        }, function() {
          that.customOperate();
        })
      } else {
        showMyToast(that.data.noOpenAuthorizeDesc);
        that.onDeny(res.detail);
      }
    },
    getUserInfo: function(res) {
      var that = this;
      if (res.detail.errMsg.search("deny") != -1) {
        showMyToast(that.data.denyShowDesc)
      } else {
        that.setData({
          isShowAuthorize: false
        }, function() {
          that.customOperate();
        })
      }
    },
    getPhoneNumber: function(res) {
      let that = this;
      if (res.detail.errMsg.search("deny") != -1) {
        showMyToast(that.data.denyShowDesc);
        that.onDeny(res.detail);
      } else {
        if (that.data.isOnShowPopUp) {
          that.setData({
            isShowAuthorize: false
          })
        }
        that.customOperate(res.detail);
      }
    },
    goGetUserInfo: function(res) {
      var that = this;
      if (res.detail.errMsg.search("auth deny") != -1) {
        showMyToast(that.data.denyShowDesc);
        that.onDeny(res.detail);
      } else {
        if (that.data.isOnShowPopUp) {
          that.setData({
            isShowAuthorize: false
          })
        }
        that.customOperate(res.detail);
      }

    },
  },
})

function showMyToast(content) {
  wx.showToast({
    title: content,
    icon: "none"
  })
}

