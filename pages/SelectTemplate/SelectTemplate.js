const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        hotSelect: 'selectTopBar',
        mySelect: 'noSelectTopBar',
        topbarSelect: 1,
        ifshowView: false,
        ifShowPoster: false,
    },

    onLoad: function(options) {
        this.setData({
            scrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 198 - 98 - 4,
        });
    },

    onShow: function() {
        this.getHotTemplate();
    },

    // 分享
    onShareAppMessage: function() {
		let title = "真心话还是大冒险？别纠结了，一局转盘做决定！";
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&navType=selectTemp`;
		let img = app.globalData.selectListIcon;
        return {
            title: title,
            path: path,
			imageUrl:img,
        }
    },

    // 顶部tabbar点击事件
    topTabBarClick: function(e) {
        let num = e.currentTarget.dataset.num;
        if (num == this.data.topbarSelect) {
            return;
        }
        this.setData({
            topbarSelect: num,
            hotSelect: num == 1 ? 'selectTopBar' : 'noSelectTopBar',
            mySelect: num == 2 ? 'selectTopBar' : 'noSelectTopBar',
            itemList: num == 1 ? this.data.hotItemArr : this.data.myItemArr,
        });
		wx.setNavigationBarTitle({
			title: num == 1 ?"热门选择":"我的选择"
		})
    },

    // showSetView
    showSetView: function(e) {
        if (this.showNum != undefined) {
            this.data.itemList[this.showNum].showNormal = true;
            this.setData({
                itemList: this.data.itemList,
            })
        }
        this.showNum = e.currentTarget.dataset.num;
        this.data.itemList[this.showNum].showNormal = false;
        this.setData({
            itemList: this.data.itemList,
        })
    },

    // hideSetView
    hideSetView: function(e) {
        console.log(e);
        let num = e.currentTarget.dataset.num;
        this.data.itemList[num].showNormal = true;
        this.setData({
            itemList: this.data.itemList,
        })
    },

    // goToDaZhuanPan
    goToDaZhuanPan: function(e) {
        let num = e.currentTarget.dataset.num;
        let title = this.data.itemList[num].title;
		let actId = this.data.itemList[num].id;
        if (this.data.topbarSelect == 1) {
            this.zhuanpanArr = this.data.itemList[num].sun;
            var selectType = 1;
			this.completeClick(title, this.zhuanpanArr);
        } else {

            this.zhuanpanArr = this.data.itemList[num].content.split("`||");
            var selectType = 2;
			this.selectClickList(this.data.itemList[num].id, title, this.zhuanpanArr)
        };

    },

    // goToCreateSelect
    goToCreateSelect: function(e) {
        if (e && e.currentTarget.dataset.num != undefined) {
            let num = e.currentTarget.dataset.num;
            let title = this.data.itemList[num].title;
            if (this.data.topbarSelect == 1) {
                var sun = this.data.itemList[num].sun;
                var selectType = 1;
            } else {
                var sun = this.data.itemList[num].content.split("`||");
                var selectType = 2;
            }

            wx.navigateTo({
                url: `/pages/createSelect/createSelect?title=${title}&sun=${JSON.stringify(sun)}&SType=${selectType}`,
            })
        } else {
            wx.navigateTo({
                url: `/pages/createSelect/createSelect`,
            })
        }
    },

    //删除Mask点击事件
    deleteCatchTap: function() {
        this.setData({
            ifShowPoster: false,
        })

    },

    // 删除按钮点击事件
    deleteBtnClick: function(e) {
        let num = e.currentTarget.dataset.num;
        this.setData({
            ifShowPoster: true,
            release_id: this.data.itemList[num].id
        })
    },

    // 删除数据
    deleteData: function(e) {
        let type = e.currentTarget.dataset.type;
        this.deleteDataURL(type);
    },

    // 删除数据请求
    deleteDataURL: function(type) {
        util.showLoadfun('正在删除');
        let _this = this;
        let deleteDataURL = wxAPIF.domin + 'changeRelease';
        wxAPIF.wxRequest(_this, deleteDataURL, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            release_id: this.data.release_id,
            type: type,
        }, function(res) {
            wx.hideLoading();
            if (res.code == 0) {
                console.log(res);
                _this.getHotTemplate();
            }
        })
    },

    // 得到页面模板
    getHotTemplate: function() {
        util.showLoadfun('加载中');
        let _this = this;
        let getHotTemplateUrl = wxAPIF.domin + 'getTemplate';
        wxAPIF.wxRequest(_this, getHotTemplateUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            type: 1,
        }, function(res) {
            wx.hideLoading();
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].showNormal = true;
            }
            for (let i = 0; i < res.user_create.length; i++) {
                res.user_create[i].showNormal = true;
            }
            _this.showNum = undefined;
            if (res.code == 0) {
                _this.setData({
                    hotItemArr: res.data,
                    myItemArr: res.user_create,
                    itemList: _this.data.topbarSelect == 1 ? res.data : res.user_create,
                    ifshowView: true,
                });

            }
        })
    },

    catchtap: function() {},

    // 完成按钮点击
    completeClick: function(titles, arr) {
        this.urlArr = [];
        let title = titles;
        if (this.data.topbarSelect == 1) {
            for (let i = 0; i < arr.length; i++) {
                this.urlArr.push(arr[i].title);
            };
        } else {
            this.urlArr = arr;
        }
        this.createdNewSelect(title);
    },

    // 创建新选择
    createdNewSelect: function(title) {
        util.showLoadfun('创建选择中~');
        let _this = this;
        let getDataFunUrl = wxAPIF.domin + 'creatPopular';
        wxAPIF.wxRequest(_this, getDataFunUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            title: title,
            content: this.urlArr.join("`||"),

        }, function(res) {
            wx.hideLoading();
            console.log(res);
            if (res.code == 0) {
                let selectId = res.id;
                wx.navigateTo({
                    url: `/pages/daZhuanPan/daZhuanPan?title=${title}&sun=${JSON.stringify(_this.urlArr)}&SType=${2}&selectId=${selectId}`,
                })
            } else {
                if (res.code == -1) {
                    wx.showModal({
                        title: '提示',
                        content: '网络错误',
                        showCancel: false,
                        success: function() {
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    })
                } else {
                    util.showLoadfun(res.msg);
                }
            }
        })
    },

	// 做选择查看事件
	selectClickList: function (id, title,arr) {
		util.showLoadfun('loading');
		let _this = this;
		let selectClickListURL = wxAPIF.domin + 'clickList';
		wxAPIF.wxRequest(_this, selectClickListURL, "POST", {
			open_id: wx.getStorageSync('user_openID'),
			popular_id: id,
		}, function (res) {
			wx.hideLoading();
			if (res.code == 0) {
				console.log(res);
				if (res.data == 1) {
					wx.navigateTo({
						url: `/pages/daZhuanPan/daZhuanPan?title=${title}&sun=${JSON.stringify(arr)}&SType=${2}&selectId=${id}`,
					})
				} else {
					// wx.navigateTo({
					// 	url: `/pages/selectionResult /selectionResult?s_awards=${res.data.content}&title=${res.data.title}&userId=${wx.getStorageSync('u_id')}`,
					// })

					wx.navigateTo({
						url: `/pages/daZhuanPan/daZhuanPan?title=${title}&sun=${JSON.stringify(arr)}&SType=${2}&selectId=${id}`,
					})
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
})