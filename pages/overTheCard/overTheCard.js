const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        ifShowPoster: false,
		plaseDraw:false,
		promptIsShow:false,
    },

    onLoad: function(opts) {
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
        console.log(opts);
        // 活动发起人去分享才能点击
        if (opts && opts.islaunch) {
            this.isCanClickDraw = false;
        } else {
            this.isCanClickDraw = true;
        };
        if (opts && opts.title) {
            this.setData({
                title: unescape(opts.title),
                actId: opts.actId
            })
        };

        if (opts && opts.userId) {
            this.setData({
                actId: opts.actId
            });
            this.getDrawTitle();
        };

        // 二维码带参处理
        if (opts && opts.scene) {
            console.log('SCENE');
			let scene = decodeURIComponent(opts.scene);
            let actId = scene.split('@')[0];
            let u_id = scene.split('@')[1];
            this.setData({
                actId: actId
            });
            this.getDrawTitle();
        }

        this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/overTheCard/overTheCard&scene=${this.data.actId}@${wx.getStorageSync('u_id')}`;

    },
    onShow: function() {
        this.setData({
            ani: '',
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
            this.drawClickFun();
        } else {
            util.showToastFun('抽签必须授权哦~');
        }
    },

    //  分享
    onShareAppMessage: function(e) {
        console.log(e);
        this.isCanClickDraw = true;
        let title = `${this.data.title} 咱们抽签决定吧！`;
        let img = 'https://tp.datikeji.com/a/15459772445961/wOLQ67yZOHCf6fMbKy39wFgLJkl1SnlaXMGznhcL.png';
        let path = `/pages/overTheCard/overTheCard?actId=${this.data.actId}&title=${this.data.title}&userId=${wx.getStorageSync('u_id')}`;
        console.log(path);
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    // 抽签点击效果
    drawClickFun: function() {
        let _this = this;
        if (!this.isCanClickDraw) {
            wx.showToast({
                title: `先邀请好友再抽签`,
                icon: "none",
                duration: 1600,
                mask: true,
            });
            return;
        }
        _this.getDrawtData();
    },

    // 返回首页
    goToHomePage: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    // 显示分享选项
    showposter: function() {
        this.isCanClickDraw = true;
        this.setData({
            ifShowPoster: true,
        })
    },

    posterClick: function() {
        this.setData({
            ifShowPoster: false,
        })
    },

    //goToResults
    goToResults: function() {
        if (this.data.is_end) {
            util.showToastFun("发起人已将活动删除");
			return;
        };
        wx.navigateTo({
            url: `/pages/drawRecord/drawRecord?release_id=${this.data.actId}`,
        })
    },

	// ifShowPrompt
	ifShowPrompt:function(){
		this.setData({
			promptIsShow: !this.data.promptIsShow,
		})
	},

	goToResults2: function () {
		if (this.data.is_end) {
			util.showToastFun("发起人已将活动删除");
			return;
		};
		if (this.data.plaseDraw) {
			this.setData({
				promptIsShow:true,
			})
			return;
		};
		wx.navigateTo({
			url: `/pages/drawRecord/drawRecord?release_id=${this.data.actId}`,
		})
	},

    // 获取抽签的数据
    getDrawtData: function() {
        util.showLoadfun('正在抽签');
        let _this = this;
        let getDefaultDataUrl = wxAPIF.domin + 'flipCard';
        wxAPIF.wxRequest(_this, getDefaultDataUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            release_id: this.data.actId,
        }, function(res) {
            wx.hideLoading();
            console.log('===========', res);
            if (res.code == 0) {
                _this.setData({
                    ani: 'Ani',
                });
                setTimeout(function() {
                    _this.setData({
                        ani: '',
                    });
                    wx.navigateTo({
                        url: `/pages/drawRecord/drawRecord?release_id=${_this.data.actId}`,
                    })
                }, 2000)

            } else {
                if (res.code != -1 && res.code != -4) {
                    wx.showToast({
                        title: `${res.msg}`,
                        icon: "none",
                        duration: 1200,
                        mask: true,
                    });
                    setTimeout(function() {
                        _this.goToResults();
                    }, 1200);

                } else {
                    if (res.code == -1) {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    }
                    wx.showToast({
                        title: `${res.msg}`,
                        icon: "none",
                        duration: 1200,
                        mask: true,
                    });
                }

            }
        })
    },

    // 被分享者点击进入请求title
    getDrawTitle: function() {
        util.showLoadfun('加载中');
        let _this = this;
        let getDrawTitleUrl = wxAPIF.domin + 'getShareTitle';
        wxAPIF.wxRequest(_this, getDrawTitleUrl, "POST", {
            release_id: this.data.actId,
        }, function(res) {
            wx.hideLoading();
            console.log('===========', res);
            if (res.code == 0) {
                _this.setData({
                    title: res.data,
                    is_end: res.is_end,
                })
            } else {
                _this.setData({
                    title: '数据错误',
                })
            }
        })
    },

    // 跳转海报页面
    goToNowActive: function() {
        wx.navigateTo({
            url: `/pages/nowActive/nowActive?actId=${this.data.actId}&title=${this.data.title}`,
        })
    },

	    // 限制查看函数
    judgeUser: function () {
		if (this.data.is_end == 1) {
			util.showToastFun("发起人已将活动删除");
			return;
		}
		util.showLoadfun('Loading');
		let _this = this;
		let judgeUserUrl = wxAPIF.domin + 'judgeUser';
		wxAPIF.wxRequest(_this, judgeUserUrl, "POST", {
			open_id: wx.getStorageSync('user_openID'),
			release_id: this.data.actId,
		}, function (res) {
			wx.hideLoading();
			console.log("===========", res);
			if (res.data == 0) {
				wx.navigateTo({
					url: `/pages/drawRecord/drawRecord?release_id=${_this.data.actId}`,
				})
			} else {
				// wx.showModal({
				// 	title: '抽签提示',
				// 	content: '发起人规定必须先参与抽签才可以查看抽签结果，请您先参与！',
				// 	showCancel: false,
				// });
				_this.ifShowPrompt()
			}

		});
	},

})