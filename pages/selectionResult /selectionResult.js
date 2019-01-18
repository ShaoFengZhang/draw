const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
        promptIsShow: false,
		ifShowAgain:true,
		ifShowPoster:false,
    },

    onLoad: function(options) {
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

		console.log(options);
        if (options && options.s_awards) {
            this.setData({
                s_awards: options.s_awards,
				ifShowAgain: options.userId?false:true,
				selectId: options.selectId,
				title: options.title,
            });
            wx.setNavigationBarTitle({
                title: options.title,
            })
        };
    },

    onShow: function() {

    },

	// 获取用户信息
	getUserInfo: function (e) {
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
			if (btnID =="getInfo2"){
				this.posterClick();
			}else{
				this.gotoResult();
			}
			
		} else {
			util.showToastFun('需要授权哦亲~');
		}
	},

    // 分享
    onShareAppMessage: function(e) {
		this.userShare();
		let title = `“选择主题${this.data.title}”  假如是你会选到什么？`;
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&selectId=${this.data.selectId}`;
		if(e.from=="menu"){
			var img='';
		}else{
			var img = app.globalData.selectShareFriendBtnIcon;
		}
        return {
            title: title,
            path: path,
			imageUrl:img,
        }
    },

	//goToIndex
	goToIndex:function(){
		wx.switchTab({
			url: '/pages/index/index'
		})
	},

	//gotoResult
	gotoResult:function(){
		wx.navigateTo({
			url: `/pages/userSelectResult/userSelectResult?title=${this.data.title}&selectId=${this.data.selectId}`,
		})
	},

	// 跳转海报页面
	goToNowActive: function () {
		wx.navigateTo({
			url: `/pages/nowActive/nowActive?actId=${this.data.actId}&title=${this.data.title}&navtype=select&actId=${this.data.selectId}`,
		})
	},

	//是否显示分享弹窗
	posterClick:function(){
		this.setData({
			ifShowPoster: !this.data.ifShowPoster,
		})
	},

    // ifShowPrompt
    ifShowPrompt: function() {
        this.setData({
            promptIsShow: !this.data.promptIsShow
        })
    },

    //gameAgain
    gameAgain: function() {
		wx.navigateBack({
			delta: 1
		})
    },

	// 用户首次分享
	userShare:function(){
		util.showLoadfun('加载中');
		let _this = this;
		let userShareUrl = wxAPIF.domin + 'userShare';
		wxAPIF.wxRequest(_this, userShareUrl, "POST", {
			open_id: wx.getStorageSync('user_openID'),
			release_id: this.data.selectId,
		}, function (res) {
			wx.hideLoading();
			console.log(res);
		})
	},

	catchtap:function(){},
})