const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({
    data: {
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        ifShowRule: false,
        ifShowView: false,
        itemArr: [{
                icon: '/assets/index/draw.png',
                title: '抽签抓阄',
                content: '个人或团体活动',
                path: '/pages/randomDraw/randomDraw'
            },
            {
                icon: '/assets/index/choice.png',
                title: '做选择',
                content: '真心话大冒险',
                path: "/pages/SelectTemplate/SelectTemplate"
            },
            {
                icon: '/assets/index/RollDice.png',
                title: '摇骰子',
                content: '666要不要',
                path: '/pages/RollTheDice/RollTheDice'
            },
            {
                icon: '/assets/index/prize.png',
                title: '发起抽奖',
                content: '抽奖发起工具',
                path: 'nav',
            },
            {
                icon: '/assets/index/poinTstask.png',
                title: '分任务',
                content: '男女搭配干活不累',
				path: '/pages/pointsTask/pointsTask'
            },
            {
                icon: '/assets/index/sequence.png',
                title: '排顺序',
                content: '1234567...',
                path: null
            },
            {
                icon: '/assets/index/vote.png',
                title: '去投票',
                content: '有意见来做决定',
                path: null
            },
            {
                icon: '/assets/index/more.png',
                title: '更多玩法',
                content: '尽请期待...',
                path: null,
            }
        ]
    },

    onLoad: function(options) {
        console.log(options)
        var _this = this;
        // 获取系统参数
        wx.getSystemInfo({
            success(res) {
                app.pix = res.pixelRatio;
                app.windowHeight = res.windowHeight;
                app.windowwidth = res.windowWidth;
                app.sysWidth = res.windowWidth;
                app.Bheight = res.screenHeight - res.windowHeight - res.statusBarHeight - 44;
            }
        });
        // 设置scroll的高度
        this.setData({
            // departmentBoxHeight: app.windowHeight * 750 / app.sysWidth - 388,
            // departmentBoxHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 388,
            scrollHeight: app.windowHeight * 750 / app.sysWidth - 124,
            topHeight: (app.windowHeight * 750 / app.sysWidth - 1064) / 2
        });
        // 处理用户信息
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
        // 得到首页模板 (需要用到OpenId)
        app.getDataFun = this.getDataFun;
        // 跳转到摇骰子
        if (options && options.roll) {
            wx.navigateTo({
                url: '/pages/RollTheDice/RollTheDice',
            })
        };
        // 跳转到做选择的模板页面
        if (options && options.navType == "selectTemp") {
            if (wx.getStorageSync('user_openID')) {
                app.ifPerformNavToSelectTemp = false;
                this.navToSelectTemp();
            } else {
                app.ifPerformNavToSelectTemp = true;
                app.navToSelectTemp = this.navToSelectTemp;
            }
        };
        // 跳转大转盘页面或者结果页面
        if (options && options.selectId) {
			this.selectId = options.selectId;
			this.shareUserId = options.userId;
			if (wx.getStorageSync('user_openID')) {
				app.ifPerformNavToDaZhuanPan = false;
				this.navToDaZhuanPan();
			} else {
				app.ifPerformNavToDaZhuanPan = true;
				app.navToDaZhuanPan = this.navToDaZhuanPan;
			}	
        };

		// 二维码带参处理 做选择
		if (options && options.scene) {
			console.log('SCENE');
			let scene = decodeURIComponent(options.scene);
			let actId = scene.split('@')[0];
			let u_id = scene.split('@')[1];
			this.selectId = actId;
			this.shareUserId = u_id;
			if (wx.getStorageSync('user_openID')) {
				app.ifPerformNavToDaZhuanPan = false;
				this.navToDaZhuanPan();
			} else {
				app.ifPerformNavToDaZhuanPan = true;
				app.navToDaZhuanPan = this.navToDaZhuanPan;
			}
		};

		// 跳转创建分任务
		if (options && options.navType == "points") {
			if (wx.getStorageSync('user_openID')) {
				app.ifPerformNavToPointsPage = false;
				this.navToPointsPage();
			} else {
				app.ifPerformNavToPointsPage = true;
				app.navToPointsPage = this.navToPointsPage;
			}
		};

		// 跳转等待分任务
		if (options && options.taskId) {
			this.taskId = options.taskId;
			if (wx.getStorageSync('user_openID')) {
				app.ifPerformNavToWaitTask = false;
				this.navToWaitTask();
			} else {
				app.ifPerformNavToWaitTask = true;
				app.navToWaitTask = this.navToWaitTask;
			}
		};
    },

    onShow: function() {
        if (wx.getStorageSync('user_openID')) {
            this.setData({
                ifShowView: false,
            })
            app.ifPerformGetDataFun = false;
            this.getDataFun();
        } else {
            app.ifPerformGetDataFun = true;
        }
        this.setData({
            ifShowRule: false,
        })
    },

    // 分享
    onShareAppMessage: function() {
        let title = "生活和聚会怎能少了这样的神器，超过一半的好友都在使用...";
        let img = app.globalData.indexShareIcon;
        let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    // 选项点击事件
    navgateEvent: function(e) {
        let path = e.currentTarget.dataset.path;
        if (path) {
            wx.navigateTo({
                url: path,
            })
        } else {
            wx.showToast({
                title: '敬请期待',
                icon: 'none',
                duration: 1200,
                mask: true,
            })
        }
    },

    // 免责申明点击事件
    statementEvent: function() {
        this.setData({
            ifShowRule: !this.data.ifShowRule
        })
    },

    // 获取数据
    getDataFun: function() {
        util.showLoadfun('加载中');
        let _this = this;
        let getDataFunUrl = wxAPIF.domin + 'getTemplate';
        wxAPIF.wxRequest(_this, getDataFunUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            type: 0,
        }, function(res) {
            wx.hideLoading();
            console.log(res);
            if (res.code == 0) {
                _this.setData({
                    ifShowView: true,
                    itemArr: res.data,
                })
            }
        })
    },

    catchtap: function() {},

    /* 处理分享跳转逻辑 */

    // 跳转至做选择热门模板页面
    navToSelectTemp: function() {
        wx.navigateTo({
            url: '/pages/SelectTemplate/SelectTemplate',
        })
    },

    // 跳转至转盘或者结果页
    navToDaZhuanPan: function() {
		if (wx.getStorageSync('u_id') == this.shareUserId){
			this.shareGameAgain="ifShow";
		}else{
			this.shareGameAgain = "noShow";
		}
		this.selectClickList();
    },

    // 判断有没有参与此次选择
	selectClickList: function () {
		util.showLoadfun('loading');
		let _this = this;
		let selectClickListURL = wxAPIF.domin + 'clickList';
		wxAPIF.wxRequest(_this, selectClickListURL, "POST", {
			open_id: wx.getStorageSync('user_openID'),
			popular_id: this.selectId,
		}, function (res) {
			wx.hideLoading();
			if (res.code == 0) {
				console.log(res);
				if (res.is_end == 2) {
					util.showToastFun("该活动已经被删除");
					return;
				};
				if (res.data == 1) {
					wx.navigateTo({
						url: `/pages/daZhuanPan/daZhuanPan?title=${res.title}&sun=${JSON.stringify(res.select_content.split("`||"))}&SType=${2}&selectId=${_this.selectId}&shareGameAgain=${_this.shareGameAgain}`,
					})
				} else {
					wx.navigateTo({
						url: `/pages/selectionResult /selectionResult?s_awards=${res.data.content}&title=${res.data.title}&userId=${wx.getStorageSync('u_id')}&selectId=${_this.selectId}`,
					});
				}
			} else {
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

	// 跳转至等待分任务页面
	navToWaitTask: function (){
		wx.navigateTo({
			url: `/pages/waitPointsTask/waitPointsTask?release_id=${this.taskId}`,
		})
	},

	navToPointsPage:function(){
		wx.navigateTo({
			url: `/pages/pointsTask/pointsTask`,
		})
	},
})