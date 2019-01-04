const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        selectIcon: "https://tp.datikeji.com/a/15457095866742/fci6b6raCf5TNpzOrLoyDnUVT8bDSEFg34eXeG5R.png",
        overIcon: "https://tp.datikeji.com/a/15457096346057/3fVbDSLL2wcBbxt7utAkE3naYAwThxfGQKF2kbDP.png",
        NotCardIcon: "https://tp.datikeji.com/a/15457096943342/agE1TZu3Lg0gr18mKFkck1vO5eciWF72Th22dPkP.png",
        noSelectIcon: "https://tp.datikeji.com/a/15457097273605/Mjvwfk05XsIzGBZtF3sUuJlOefO8nxA9oKggapbc.png",
        crayIcon: "https://tp.datikeji.com/a/15457179137395/3WCeW2sMUPsytxbfVH02qNNAlkgP6I5iF5ZHpUhk.png",
        cryIcon: "https://tp.datikeji.com/a/15457179457671/IdqSdtzjYXWa1CwWskHEsVdzfFewHlnFLgA79tNm.png",
		ifShowView:0,
    },

    onLoad: function(options) {
        if (options) {
            this.setData({
                ifPrizeIcon: this.data.NotCardIcon,
                release_id: options.release_id
            })
            this.getDrawtData()
        }

    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function(e) {
		console.log(e);
		let title = `${this.data.title} 咱们抽签决定吧！`;
		let img = app.globalData.invitFriendIcon;
		let path = `/pages/overTheCard/overTheCard?actId=${this.data.release_id}&title=${this.data.title}&userId=${wx.getStorageSync('u_id')}`;
		this.isCanClickDraw = true;
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
    },

    // 返回首页
    goToHomePage: function() {
		if (this.data.ifPrizeIcon == this.data.NotCardIcon){
			wx.navigateBack({
				delta: 1
			});
			return;
		};
        wx.switchTab({
            url: '/pages/index/index',
        });
    },

    // 查看抽签的数据
    getDrawtData: function() {
		util.showLoadfun('加载中');
        let _this = this;
        let getDefaultDataUrl = wxAPIF.domin + 'seeResult';
        wxAPIF.wxRequest(_this, getDefaultDataUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            release_id: this.data.release_id,
        }, function(res) {
            console.log('===========', res);
			wx.hideLoading();
            if (res.code == 0) {
				for (let key in res.data.user){
					res.data.user[key].time = res.data.user[key].created_at.date.slice(5,19);
				};
				res.data.user=res.data.user ? Object.keys(res.data.user).map(key => res.data.user[key]) : [];
				for (let n = 0; n < res.data.user.length;n++){
					if (res.data.user[n].is_prize==1){
						let item = res.data.user[n]
						res.data.user.splice(n,1);
						res.data.user.unshift(item);
					};
				};
				console.log("LLLLLLLLL", res.data.user)
                _this.setData({
					ifShowView: 1,
                    is_end: res.data.is_end,
                    is_enjoy: res.data.is_enjoy,
                    if_prize: res.data.is_prize,
                    ifPrizeIcon: !res.data.is_end ? (res.data.is_enjoy ? (res.data.is_prize ? _this.data.selectIcon : _this.data.noSelectIcon) : _this.data.NotCardIcon) : _this.data.overIcon,
                    participate_num: res.data.participate_num, //参与人数
                    selection_num: res.data.selection_num, //中奖人数
                    winning: res.data.winning, //已经有多少人中奖
					playerArr: res.data.user, //参与人数
					title:res.data.title,
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
    }
})