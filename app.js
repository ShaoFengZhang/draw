import wxAPIF from './utils/wxApiFun.js';
// const ald = require('./utils/ald-stat.js');
App({
    onLaunch: function(options) {
        let _this = this;
        wx.getSystemInfo({
            success(res) {
                _this.pix = res.pixelRatio;
                _this.windowHeight = res.windowHeight;
                _this.windowwidth = res.windowWidth;
                _this.sysWidth = res.windowWidth;
                _this.Bheight = res.screenHeight - res.windowHeight - res.statusBarHeight - 44;
            }
        });
		this.ifPerformGetDataFun=true; //获取首页的模板
		this.ifPerformNavToSelectTemp = true; //跳转到做选择模板
		this.ifPerformNavToDaZhuanPan = true; //跳转到大转盘
		this.ifPerformNavToWaitTask = true; //跳转到等待分任务
		this.ifPerformNavToPointsPage = true; //跳转创建分任务
		wxAPIF.wxloginfnc(this);

		// 强制更新
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			console.log(res.hasUpdate)
		})

		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '分任务功能上线，立即试用~',
				showCancel:false,
				success: function (res) {
					if (res.confirm) {
						updateManager.applyUpdate()
					}
				}
			})
		})

		updateManager.onUpdateFailed(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本下载失败',
				showCancel: false
			})
		})
    },

	onShow:function(){
	},

    globalData: {
        userInfo: null,
		daZhuanPanMusicflg:1,
		// 首页加我的分享图片
		indexShareIcon:"https://tp.datikeji.com/a/15459649596683/83OSwovZtMTscFKNAumVUN8T8Dd8Fnblbnl0awUN.png",
		// 分享卡片推荐给好友
		recommendIcon:"https://tp.datikeji.com/a/15459650337308/7moVS6hxaicraGnK7wpuQge1ZGZjHuDZ7d3nrKfd.png",
		// 邀请好友
		invitFriendIcon:"https://tp.datikeji.com/a/15459651376715/n1ll85PDgEXVjwj2yR2uAu4ZJHk29OoYtRGRllVq.png",
		// 海报页面做选择图片
		qrSelecticon:"https://tp.datikeji.com/a/15475464055525/7dUu4nq8MOtHj0UaAgyDiePI9BxTFapIXLoteozs.png",
		// 做选择选择列表
		selectListIcon:"https://tp.datikeji.com/a/15475464726085/It3yBnM8P2wK3voqk4JO4v2NIm6IxkEqzpms5dyu.png",
		// 做选择邀请好友按钮
		selectShareFriendBtnIcon:"https://tp.datikeji.com/a/15475465315182/L5B92bhLo9yMlXpckc2yv4syiqmodtv0O4EdWQGo.png"
    }
})