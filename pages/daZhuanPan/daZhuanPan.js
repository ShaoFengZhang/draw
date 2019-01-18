const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
        size: { //转盘大小可配置
            w: 622,
            h: 622
        },
        s_awards: '？', //结果
        goGame: "goGame",
        currentIndex: 0,
        ifhaloOne: false,
        autoplay: false,
        interval: 100,
        duration: 100,
    },

    onLoad: function(options) {

		/* 授权数据 */
		if (app.globalData.userInfo) {
			console.log('zhuanif');
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			});
		} else if (this.data.canIUse) {
			console.log('zhuanelseif');
			app.userInfoReadyCallback = res => {
				console.log('zhuanindex');
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
			console.log('zhuanelse');
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
		
		/* 转盘组件所需数据 */
        app.start = wx.createInnerAudioContext();
        app.mid = wx.createInnerAudioContext();
        app.stop = wx.createInnerAudioContext();
        console.log('=========onload============');
        this.zhuanpan = this.selectComponent("#zhuanpan");
		this.shareGameAgain ="ifShow";
		if (options && options.shareGameAgain){
			this.shareGameAgain = options.shareGameAgain;
		};
        if (options && options.title && options.SType == 1) {
            app.userSelcetId = options.selectId
            this.setData({
                themeTitle: options.title,
                themeItem: JSON.parse(options.sun),
				selectId: options.selectId,
            })
        };

        if (options && options.title && options.SType == 2) {
            app.userSelcetId = options.selectId
            let Sarr = JSON.parse(options.sun);
            console.log(Sarr)
            let sun = [];
            for (let i = 0; i < Sarr.length; i++) {
                let obj = {
                    title: Sarr[i],
                };
                sun.push(obj);
            }
            this.setData({
                themeTitle: options.title,
                themeItem: sun,
				selectId: options.selectId,
            })
        };

        for (let i = 0; i < this.data.themeItem.length; i++) {

            if (i % 2 == 0) {
                this.data.themeItem[i].color = "#fff"
            };

            if (i % 2 == 1) {
                this.data.themeItem[i].color = "#EDF1FF"
            };
        };

        let obj = {
            id: 0,
            option: options.title,
            awards: this.data.themeItem,
        };
        wx.setNavigationBarTitle({
            title: options.title,
        });
        app.xiaojuedingArr = obj;	
		this.selectGameOver=false;
		this.setData({
			musicflg: app.globalData.daZhuanPanMusicflg,
		})
    },

    onShow: function() {
        console.log('============onShow============');
		if (this.selectGameOver){
			this.selectGameOver=false;
			this.zhuanpan.reset();
			this.setData({
				s_awards: '？', //结果
				goGame: "goGame",
				currentIndex: 0,
				ifhaloOne: false,
				autoplay: false,
			})
		}
    },

    onHide: function() {
        console.log('============onHide============');
        console.log(app.start)
    },

    onUnload: function() {
        console.log('============onUnload============');
        app.start.stop();
        app.mid.stop();
        app.stop.stop();
        clearTimeout(app.timer);
    },

	// 分享
    onShareAppMessage: function() {
		let title = "当你不知如何抉择的话，那就让大转盘来决定吧！";
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&selectId=${this.data.selectId}`;
		// let img = app.globalData.selectListIcon;
        return {
            title: title,
            path: path,
        }
    },

	// 获取用户信息
	getUserInfo: function (e) {
		console.log(e);
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
			this.goGame();
		} else {
			util.showToastFun('需要授权哦亲~');
		}
	},

	// 声音开关
	voideSwitch:function(){
		app.globalData.daZhuanPanMusicflg = !app.globalData.daZhuanPanMusicflg;
		this.setData({
			musicflg: app.globalData.daZhuanPanMusicflg,
		})
	},

    //接收当前转盘结束后的答案选项
    getAwards(e) {
        console.log(e);
        let _this = this;
        this.setData({
            s_awards: e.detail.end ? "？" : e.detail.s_awards,
            share: e.detail.end ? true : false,
            currentIndex: e.detail.index,
        });
        setTimeout(function() {
			_this.selectGameOver = true;
			if (_this.shareGameAgain === "ifShow"){
				wx.navigateTo({
					url: `/pages/selectionResult /selectionResult?s_awards=${e.detail.s_awards}&title=${_this.data.themeTitle}&selectId=${_this.data.selectId}`,
				});
			}else{
				wx.navigateTo({
					url: `/pages/selectionResult /selectionResult?s_awards=${e.detail.s_awards}&title=${_this.data.themeTitle}&selectId=${_this.data.selectId}&userId=${wx.getStorageSync('u_id')}`,
				});
			}
            
			_this.setData({
				goGame: "goGame",
			})
        }, 800);
    },

    //开始转
    startZhuan(e) {
        this.setData({
            zhuanflg: e.detail ? true : false
        })
    },

    //数组随机取出一个数
    arrayRandomTakeOne: function(array) {
        var index = Math.floor((Math.random() * array.length + 1) - 1);
        return array[index];
    },

	//startGame 处理跑马灯
	startGame:function(e){
		let _this=this;
		this.setData({
			autoplay: true,
		});
		this.holdTimer = setInterval(function () {
			_this.setData({
				ifhaloOne: !_this.data.ifhaloOne,
			})
		}, 500)
	},

	// 点击开始按钮
    goGame: function() {
        let _this = this;
        this.zhuanpan._zhuan();
		this.setData({
			goGame: "",
		});
        setTimeout(function() {
            _this.setData({
                autoplay: false,
            });
            clearInterval(_this.holdTimer);
        }, 7600);
    },

	catchtap:function(){},

})