const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({
    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        playerNum: 2,
        selectPlayerNum: 1,
        inputValue: "",
        category: 0,
    },

    onLoad: function(options) {
        var _this = this;
        if (app.globalData.userInfo) {
            console.log('goodif');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            console.log('goodelseif');
            app.userInfoReadyCallback = res => {
                console.log('goodindex');
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                let session_key = app.globalData.session_key;
                wxAPIF.checkUserInfo(app, res, iv, encryptedData, session_key);
            }
        } else {
            console.log('goodelse');
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                    let iv = res.iv;
                    let encryptedData = res.encryptedData;
                    let session_key = app.globalData.session_key;
                    wxAPIF.checkUserInfo(app, res, iv, encryptedData, session_key);
                }
            })
        };
    },

    onShow: function() {

    },

    onHide: function() {

    },

    // 分享
    onShareAppMessage: function() {
        let title = "超好用的免费抽签工具，用到就是赚到。";
        let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
        }
    },

    //catchtap
    catchtap: function() {},

    showModel: function() {
        wx.showModal({
            title: '提示',
            content: '打开此项，好友必须先参与抽签后才可以查看抽签结果，请您悉知！',
            showCancel: false,
        })
    },

    // 获取用户信息
    getUserInfo: function(e) {
        console.log(e);
        let btnID = e.currentTarget.id;
        if (e && e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            });
            let iv = e.detail.iv;
            let encryptedData = e.detail.encryptedData;
            let session_key = app.globalData.session_key;
            wxAPIF.checkUserInfo(app, e.detail, iv, encryptedData, session_key);
            this.DrawClickEvent();
        } else {
            util.showToastFun('发起抽签必须授权哦~');
        }
    },

    // 键盘输入时触发
    bindinput: function(e) {
        console.log(e.detail.value);
        this.setData({
            pageInputTxt: e.detail.value
        })
    },

    playBindinput: function(e) {
        console.log(e.detail.value);
        let num = parseInt(e.detail.value);
        if (!num) {
            util.showToastFun('参与人数不小于1');
        };
        if (num > 1000) {
            util.showToastFun('参与人数不超过1000人');
        };
        if (num < this.data.selectPlayerNum) {
            util.showToastFun('选中人数不超过参与人数');
        };
        this.setData({
            playerNum: e.detail.value,
        })
    },

    SelectBindinput: function(e) {
        console.log(e.detail.value);
        let num = parseInt(e.detail.value);
        if (!num) {
            util.showToastFun('选中人数不小于1');
        };
        if (num > 1000) {
            util.showToastFun('选中人数不超过1000人');
        };
        if (num > this.data.playerNum) {
            util.showToastFun('选中人数不超过参与人数');
        };
        this.setData({
            selectPlayerNum: e.detail.value,
        })
    },

    // 输入框聚焦时触发
    bindfocus: function() {
        this.setData({
            inputValue: "",
        })
    },

    // 参与人数ADD事件
    playerNumAdd: function() {
        this.data.playerNum++;
        if (this.data.playerNum > 1000) {
            util.showToastFun('参与人数不超过1000人')
            this.data.playerNum--
        } else {
            this.setData({
                playerNum: this.data.playerNum
            })
        }

    },

    // 参与人数MINUS事件
    playerNumMinus: function() {
        this.data.playerNum--;
        if (this.data.playerNum < this.data.selectPlayerNum) {
            util.showToastFun('选中人数不超过参与人数');
            this.data.playerNum++;
        } else {
            this.setData({
                playerNum: this.data.playerNum
            })
        }
    },

    // 选中人数ADD事件
    selectPlayerNumAdd: function() {
        this.data.selectPlayerNum++;
        if (this.data.playerNum < this.data.selectPlayerNum) {
            util.showToastFun('选中人数不超过参与人数');
            this.data.selectPlayerNum--;
        } else {
            this.setData({
                selectPlayerNum: this.data.selectPlayerNum
            })
        }
    },

    // 选中人数MINUS事件
    selectPlayerNumMinus: function() {
        this.data.selectPlayerNum--;
        if (this.data.selectPlayerNum < 1) {
            util.showToastFun('选中人数须大于1');
            this.data.selectPlayerNum++;
        } else {
            this.setData({
                selectPlayerNum: this.data.selectPlayerNum
            })
        }
    },

    // 发起抽签事件
    DrawClickEvent: function() {
        if (!this.data.pageInputTxt) {
            util.showToastFun('请填写抽签主题');
            return;
        };
        if (this.data.playerNum < this.data.selectPlayerNum) {
            util.showToastFun('选中人数须小于参与人数');
            return;
        };
        if (!this.data.playerNum || !this.data.selectPlayerNum) {
            util.showToastFun('人数不能为0');
            this.setData({
                playerNum: 2,
                selectPlayerNum: 1,
            })
            return;
        }
        this.drawDataFun();
    },

    // 抽签请求
    drawDataFun: function() {
        util.showLoadfun('发起抽签');
        let _this = this;
        let drawDataFunUrl = wxAPIF.domin + 'launchDraw';
        wxAPIF.wxRequest(_this, drawDataFunUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            pic: 'https://tp.datikeji.com/a/15459826773637/oGLjACxLNxthJdZzoOngQwHqNY3xO50B64Z9Ou1T.png',
            title: `${this.data.pageInputTxt}`,
            participate_num: `${this.data.playerNum}`,
            selection_num: `${this.data.selectPlayerNum}`,
            category: this.data.category,
        }, function(res) {
            wx.hideLoading();
            console.log("===========", res);
            if (res.code == 0) {
                wx.navigateTo({
                    url: `/pages/overTheCard/overTheCard?actId=${res.id}&islaunch=${1}&title=${escape(_this.data.pageInputTxt)}`,
                })
            } else {
                util.showToastFun(res.msg);
            }

        });
    },

    // switch1Change
    switch1Change: function(e) {
        let ifcheck = e.detail.value;
        this.setData({
            category: ifcheck ? 1 : 0,
        })
    },

})