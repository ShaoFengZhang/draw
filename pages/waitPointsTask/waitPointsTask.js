const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        self_join: 0,
        all_num: 0,
        task_num: 0,
        all_no_num: 0,
        task_data: [],
    },

    onLoad: function(options) {
		wx.hideShareMenu()
        if (app.globalData.userInfo) {
            console.log('if');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
            console.log('elseif');
            app.userInfoReadyCallback = res => {
                console.log('index');
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
            console.log('else');
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

        this.setData({
            scrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 604 - 40 - 45 - 88,
        });
        if (options && options.release_id) {
            this.release_id = options.release_id;
        };
        this.getTaskData();
    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function() {
		let title = `通知！${app.globalData.userInfo.nickName}创建了一个任务，快来看看会分到什么。`;
		let img = "https://tp.datikeji.com/a/15477207448084/96Re2DUBfpId0gGcbeEs5uRKckK57meLgXknMUMx.png";
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&taskId=${this.release_id}`;
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

	// onPullDownRefresh
	onPullDownRefresh:function(){
		this.getTaskData();
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
            if (btnID == "getInfo1") {
                this.joinTask();
            } else {

            }

        } else {
            util.showToastFun('需要授权哦亲~');
        }
    },

    //goToIndex
    goToIndex: function() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },

    // 查看完整数据
    ifCheckAll: function(e) {
        console.log(e);
        let index = e.currentTarget.dataset.index;
        let clickType = e.currentTarget.dataset.all;
        this.data.task_data[index].checkAll = !this.data.task_data[index].checkAll;
        this.setData({
            join_User: clickType == 'show' ? this.data.task_data : this.data.task_data.slice(0, 5),
        })
    },

    // 拿到任务的数据
    getTaskData: function() {
        util.showLoadfun('加载中');
        let _this = this;
        let getTaskDataUrl = wxAPIF.domin + 'waitAssign';
        wxAPIF.wxRequest(_this, getTaskDataUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            release_id: this.release_id
        }, function(res) {
            wx.hideLoading();
			wx.stopPullDownRefresh();
            console.log(res);
            if (res.code == 0) {
                _this.setData({
                    all_no_num: res.data.all_no_num, //未参与人数
                    all_num: res.data.all_num, //总人数
                    self_join: res.data.self_join, //自己在哪一组
                    task_num: res.data.task_num, //总组数
                    task_data: res.data.task_data,
                });
                for (let i = 0; i < _this.data.task_data.length; i++) {
                    _this.data.task_data[i].checkAll = true;
                    if (_this.data.task_data[i].id == res.data.self_join) {
                        _this.setData({
                            self_join_Num: i,
                        })
                    }
                };
                _this.setData({
                    join_User: _this.data.task_data.slice(0, 5),
					scrollId: 'scroll' + (_this.data.self_join_Num+1),
                })
            }else{
				wx.showModal({
					title: '提示',
					content: '网络错误',
					showCancel: false,
					success: function () {
						wx.switchTab({
							url: '/pages/index/index'
						})
					}
				})
			}
        })
    },

    // 参与分任务
    joinTask: function() {
        util.showLoadfun('加载中');
        let _this = this;
        let joinTaskUrl = wxAPIF.domin + 'joinTask';
        wxAPIF.wxRequest(_this, joinTaskUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            release_id: this.release_id
        }, function(res) {
            wx.hideLoading();
            console.log(res);
            if (res.code == 0) {
                _this.getTaskData();
            } else {
                if (res.code == -1) {
					wx.showModal({
						title: '提示',
						content: '网络错误',
						showCancel: false,
						success: function () {
							wx.switchTab({
								url: '/pages/index/index'
							})
						}
					})
                } else {
					util.showToastFun(res.msg);
                }
            }
        })
    },

    catchtap: function() {},
})