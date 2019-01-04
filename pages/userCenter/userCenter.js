const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({
    data: {

        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        delBtnWidth: -150,
        windowHeight: 0,
        isScroll: true,
        myLaunche: 'selectMyLaunche',
        myJoin: 'selectMyJoin',
        drawStart: 'drawStart',
        drawMove: "drawMove",
        typeWay: 1,
		ifShowPoster:0,
		ifshowView:0,
    },

    onLoad: function(options) {
        var _this = this;
        this.setData({
            // departmentBoxHeight: app.windowHeight * 750 / app.sysWidth - 388,  //底部有Baner
            // departmentBoxHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 388, //底部无Baner
            scrollHeight: app.windowHeight * 750 / app.sysWidth - 288,
        });
        if (app.globalData.userInfo) {
            console.log('goodif');
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            console.log('goodelseif');
            app.userInfoReadyCallback = res => {
                console.log('goodindex');
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
            console.log('goodelse');
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
    },

    onShow: function() {
		this.getMyActive();
    },

    onHide: function() {

    },

    // 分享
    onShareAppMessage: function(e) {
		let img = app.globalData.indexShareIcon;
		console.log(e);
		if(e.from =='button'){
			var title = `${this.data.title} 咱们抽签决定吧！`;
		var path = `/pages/overTheCard/overTheCard?actId=${this.data.release_id}&userId=${wx.getStorageSync('u_id')}`;
		}else{
			var title = "生活工作和聚会怎能少的了这样的神器，快点收入袋中";
			var path = `/pages/overTheCard/overTheCard?userId=${wx.getStorageSync('u_id')}`;
		}
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
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
			this.navToMyQrCode();
        } else {
            util.showToastFun('个人二维码需要授权哦~');
        }
    },

	//跳转我的二维码
	navToMyQrCode:function(){
		wx.navigateTo({
			url: '/pages/myQrCode/myQrCode',
		})
	},

	catchtap:function(){},

    //我发起的和我参加的点击事件
    aboutMePlay: function(e) {
        let navType = e.currentTarget.dataset.way;
        if (this.data.typeWay == navType) {
            return;
        } else {
            this.setData({
				isScroll: true,
                typeWay: navType,
                myLaunche: navType == 1 ? 'selectMyLaunche' : 'selectMyJoin',
                myJoin: navType == 2 ? "selectMyLaunche" : 'selectMyJoin',
				ifshowView: 0,
				ItemArr:[],
            });
			this.getMyActive();
        };
    },

    // 查看参与的详情
    goToItemContent: function(e) {
        if (!this.data.isScroll) {
            this.setData({
                isScroll: true,
            })
            return;
        }
		let actId = e.currentTarget.dataset.release_id;
		let ifDelete = e.currentTarget.dataset.ifdelete;
		let navType = e.currentTarget.dataset.navtype;
		if (ifDelete==2){
			util.showToastFun('该活动已删除')
			return;
		};
		if (navType==0){
			wx.navigateTo({
				url: `/pages/overTheCard/overTheCard?actId=${actId}&userId=${wx.getStorageSync('u_id')}`,
			})
		}
		
    },

    //删除Mask点击事件
    deleteCatchTap: function() {
		console.log("===========")
        if (!this.data.isScroll) {
			for (var index in this.data.ItemArr) {
				var item = this.data.ItemArr[index];
				item.transX = 0;
				item.ifShowDel = 0;
			};

            this.setData({
                isScroll: true,
				ifShowPoster: 0,
				ItemArr: this.data.ItemArr,
            });
            return;
        }
    },

	// 删除点击事件
	deleteViewClick:function(e){
		this.setData({
			ifShowPoster: 1,
			isScroll: false,
			// release_id: e.currentTarget.dataset.release_id,
		})
	},

	// 删除数据
	deleteData:function(e){
		let type = e.currentTarget.dataset.type;
		this.deleteDataURL(type);
	},

	// 删除数据请求
	deleteDataURL:function(type){
		util.showLoadfun('正在删除');
		let _this = this;
		let deleteDataURL = wxAPIF.domin + 'changeRelease';
		wxAPIF.wxRequest(_this, deleteDataURL, "POST", {
			open_id: wx.getStorageSync('user_openID'),
			release_id: this.data.release_id,
			type: type,
			category: _this.data.typeWay==2?2:null,
		}, function (res) {
			wx.hideLoading();
			if (res.code == 0) {
				console.log(res);
				_this.getMyActive();
			}
		})
	},

    // 滑动删除相关事件
    drawStart: function(e) {
        var touch = e.touches[0]
        for (var index in this.data.ItemArr) {
            var item = this.data.ItemArr[index];
            item.transX = 0;
            item.ifShowDel = 0;
        }
        this.setData({
            ItemArr: this.data.ItemArr,
            startX: touch.clientX,
            startY: touch.clientY,
            isScroll: true,
        })

    },
    drawMove: function(e) {
        var touch = e.touches[0]
        var item = this.data.ItemArr[e.currentTarget.dataset.index]
        var disX = this.data.startX - touch.clientX;
        var disY = touch.clientY - this.data.startY;

        if (Math.abs(disY) > 8) {
            return;
        } else {
            if (disX >= 20) {
                if (disX > this.data.delBtnWidth) {
                    disX = this.data.delBtnWidth
                }
                item.transX = disX;
                item.ifShowDel = 1;
                this.setData({
                    isScroll: false,
                    ItemArr: this.data.ItemArr,
					ifShowPoster: 1,
					release_id: e.currentTarget.dataset.release_id,
					title: e.currentTarget.dataset.title,
                })
            } else {
                item.transX = 0;
                item.ifShowDel = 0;
                this.setData({
                    isScroll: true,
                    ItemArr: this.data.ItemArr,
					ifShowPoster: 0,
                })
            };
        }


    },
    drawEnd: function(e) {
        return
        var item = this.data.ItemArr[e.currentTarget.dataset.index]
        if (item.transX >= this.data.delBtnWidth / 2) {
            item.transX = this.data.delBtnWidth;
            item.ifShowDel = 1;
            this.setData({
                isScroll: true,
                ItemArr: this.data.ItemArr,
            })
        } else {
            item.transX = 0;
            item.ifShowDel = 0;
            this.setData({
                isScroll: true,
                ItemArr: this.data.ItemArr,
            })
        }
        console.log(this.data.ItemArr)
    },

    // 获取数据
    getMyActive: function() {
        util.showLoadfun('加载中');
        let _this = this;
		let getDataFunUrl = wxAPIF.domin + 'userPage';
        wxAPIF.wxRequest(_this, getDataFunUrl, "POST", {
            open_id: wx.getStorageSync('user_openID')
        }, function(res) {
            wx.hideLoading();
            console.log(res);
            if (res.code == 0) {
				for (let i = 0; i < res.data.release_data.length;i++){
					res.data.release_data[i].transX=0;
					res.data.release_data[i].ifShowDel=0;
					res.data.release_data[i].time = res.data.release_data[i].release_time.slice(5,16);
				};
				for (let i = 0; i < res.data.part_data.length;i++){
					res.data.part_data[i].transX = 0;
					res.data.part_data[i].ifShowDel = 0;
					res.data.part_data[i].time = res.data.part_data[i].created_at.slice(5,16);
				};
               _this.setData({
				   ifshowView:1,
				   part_count: res.data.part_count, 
				   release_count: res.data.release_count, 
				   releaseArr: res.data.release_data,
				   partArr: res.data.part_data,
				   ItemArr: _this.data.typeWay == 1 ? res.data.release_data.reverse() : res.data.part_data.reverse(),
			   }) 
            }
        })
    },
})