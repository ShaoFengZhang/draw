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
                path: null
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
        wx.getSystemInfo({
            success(res) {
                app.pix = res.pixelRatio;
                app.windowHeight = res.windowHeight;
                app.windowwidth = res.windowWidth;
                app.sysWidth = res.windowWidth;
                app.Bheight = res.screenHeight - res.windowHeight - res.statusBarHeight - 44;
            }
        });
        this.setData({
            // departmentBoxHeight: app.windowHeight * 750 / app.sysWidth - 388,
            // departmentBoxHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 388,
            scrollHeight: app.windowHeight * 750 / app.sysWidth - 124,
            topHeight: (app.windowHeight * 750 / app.sysWidth - 1064) / 2
        });
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
        app.getDataFun = this.getDataFun;
        if (options && options.roll) {
            wx.navigateTo({
                url: '/pages/RollTheDice/RollTheDice',
            })
        };
    },

	navSelect:function(){
		wx.navigateTo({
			url: '/pages/SelectTemplate/SelectTemplate',
		})
	},

    onShow: function() {
        if (wx.getStorageSync('user_openID')) {
            console.log(123);
            this.setData({
                ifShowView: false,
            })
            this.getDataFun();
        };
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
})