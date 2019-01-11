const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        promptIsShow: false,
		ifShowAgain:true,
    },

    onLoad: function(options) {
		console.log(options);
        if (options && options.s_awards) {
            this.setData({
                s_awards: options.s_awards,
				ifShowAgain: options.userId?false:true,
            });
            wx.setNavigationBarTitle({
                title: options.title,
            })
        };
    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function() {
        let title = "真心话还是大冒险？别纠结了，一局转盘做决定！";
        let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
        }
    },

	//goToIndex
	goToIndex:function(){
		wx.switchTab({
			url: '/pages/index/index'
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
})