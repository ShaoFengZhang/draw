const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

	data: {
		myIcon: '/assets/drawRecord/icon.png',
		ifShowView:0,
	},

	onLoad: function (options) {
		this.setData({
			usericon: JSON.parse(wx.getStorageSync("rawData")).avatarUrl,
			scrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth -408-222,
			selectId: options.selectId ? options.selectId:'',
			title: options.title ? options.title:"",
		});
		
		this.getDrawtData();
	},

	onShow: function () {

	},

	// 分享
	onShareAppMessage: function (e) {
		let title = `“选择主题${this.data.title}”  假如是你会选到什么？`;
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&selectId=${this.data.selectId}`;
		return {
			title: title,
			path: path,
		}
	},

	// 用户下拉刷新
	onPullDownRefresh:function(){
		this.getDrawtData();
	},

	// 查看做选择的数据
	getDrawtData: function () {
		util.showLoadfun('加载中');
		let _this = this;
		let getDefaultDataUrl = wxAPIF.domin + 'seeResult';
		wxAPIF.wxRequest(_this, getDefaultDataUrl, "POST", {
			open_id: wx.getStorageSync('user_openID'),
			release_id: this.data.selectId,
			type:1,
		}, function (res) {
			console.log('===========', res);
			wx.hideLoading();
			if (res.code == 0) {
				res.data.user = res.data.user ? Object.keys(res.data.user).map(key => res.data.user[key]) : [];
				res.data.user_self = res.data.user_self ? Object.keys(res.data.user_self).map(key => res.data.user_self[key]) : [];
				_this.setData({
					ifShowView: 1,
					myIcon: res.data.user_self[0].pic,
					myName: res.data.user_self[0].userName,
					mySelect: res.data.user_self[0].content,
					friendList: res.data.user,
				})
			} else {
				wx.showToast({
					title: `${res.msg}`,
					icon: "none",
					duration: 1200,
					mask: true,
				});
			};
		})
	},
})