const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';

Page({

    data: {
        themeTitle: "",
        themeItem: [{
                title: '',
            },
            {
                title: '',
            }
        ],
    },

    onLoad: function(options) {
        this.setData({
            scrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 374 - 98 - 34,
        });

        if (options && options.title && options.SType == 1) {
            this.setData({
                themeTitle: options.title,
                themeItem: JSON.parse(options.sun),
            })
        };
		
		if (options && options.title && options.SType == 2) {
			let Sarr = JSON.parse(options.sun);
			let sun=[];
			for(let i=0;i<Sarr.length;i++){
				let obj={
					title: Sarr[i] ,
				};
				sun.push(obj);
			}
			this.setData({
				themeTitle: options.title,
				themeItem: sun,
			})
		};

    },

    onShow: function() {

    },

    //分享
    onShareAppMessage: function() {
		let title = "真心话还是大冒险？别纠结了，一局转盘做决定！";
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&navType=selectTemp`;
		let img = app.globalData.selectListIcon;
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
    },

    // 添加选项
    Addselect: function(e) {
        if (this.data.themeItem.length > 16) {
            util.showToastFun("选项数目不能大于17个");
            return;
        };

        let obj = {
            title: '',
        };

        this.data.themeItem.push(obj);

        this.setData({
            themeItem: this.data.themeItem,
			scrollId: "scroll"+this.data.themeItem.length
        });
    },

    // 删除选项
    MinsSelect: function(e) {
		if (this.data.themeItem.length <=2) {
			util.showToastFun("选项数目不能小于2个");
			return;
		};
        let num = e.currentTarget.dataset.num;
        this.data.themeItem.splice(num, 1);
        this.setData({
            themeItem: this.data.themeItem,
			scrollId: "scroll" + this.data.themeItem.length
        })
    },

    // 键盘输入时触发
    ItemBindinput: function(e) {
        console.log(e);
        let num = e.currentTarget.dataset.num;
        let value = e.detail.value;
        this.data.themeItem[num].title = value;
        this.setData({
            themeItem: this.data.themeItem,
        })
    },

    titleBindinput: function(e) {
        let value = e.detail.value;
        this.data.themeTitle = value;
        this.setData({
            themeTitle: this.data.themeTitle,
        })
    },

    // 完成按钮点击
    completeClick: function() {

        if (this.data.themeTitle == '') {
            util.showToastFun("请填写主题");
            return;
        };

        this.urlArr = [];
        let title = this.data.themeTitle;
		let isReturn=false;
        for (let i = 0; i < this.data.themeItem.length; i++) {
            if (this.data.themeItem[i].title == "") {
                util.showToastFun('请完善选项');
				isReturn=true;
                break;
            } else {
                this.urlArr.push(this.data.themeItem[i].title);
            }
        };
		if (!isReturn){
			this.createdNewSelect(title);
		};
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
})