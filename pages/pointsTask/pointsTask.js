const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        taskItemArr: [{
            title: '',
            num: 1,
        }],
        taskTheme: '',
        promptIsShow: false,
		haveDelete:false,
    },

    onLoad: function(options) {
        this.setData({
            scrollHeight: (app.windowHeight + app.Bheight) * 750 / app.sysWidth - 570,
        });

    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function() {
        let title = "一键分派协作任务，就是这么任性。";
		let img = "https://tp.datikeji.com/a/15477206769184/vUlVZUVPzYNFzOABZKl6OmGNnp5w1P2C5xDYi2Yg.png";
        let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&navType=points`;
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    ifShowPrompt: function(num){
        this.setData({
            promptIsShow: !this.data.promptIsShow,
			haveDelete: true,
        });
	},

	determine:function(num){
		this.data.taskItemArr.splice(num, 1);
		this.setData({
			promptIsShow: false,
			taskItemArr: this.data.taskItemArr,
		})
	},

    // 减少项目
    minsItemArr: function(e) {
        if (this.data.taskItemArr.length <= 1) {
            util.showToastFun("至少安排一个项目");
            return;
        };
        console.log(e);
        let number = e.currentTarget.dataset.number;
		if (this.data.haveDelete){
			this.data.taskItemArr.splice(number, 1);
			this.setData({
				taskItemArr: this.data.taskItemArr,
			})
		}else{
			this.ifShowPrompt(number)
		}
        
    },

    // 增加项目
    addItemArr: function() {
        if (this.data.taskItemArr.length >= 10) {
            util.showToastFun("最多安排10个任务");
            return;
        };
        let obj = {
            title: '',
            num: 1,
        };
        this.data.taskItemArr.push(obj);
        this.setData({
            taskItemArr: this.data.taskItemArr,
            scrollId: 'scroll' + this.data.taskItemArr.length,
        })
    },

    // 主题输入框
    themeBindinput: function(e) {
        let title = e.detail.value;
        this.setData({
            taskTheme: title,
        })
    },

    // 任务安排输入框
    itemBindinput: function(e) {
        let number = e.currentTarget.dataset.number;
        let title = e.detail.value;
        this.data.taskItemArr[number].title = title;
        this.setData({
            taskItemArr: this.data.taskItemArr,
        })
    },

    // 人数输入框
    peopleNumInput: function(e) {
        let number = e.currentTarget.dataset.number;
        let peopleNum = e.detail.value;
        if (peopleNum >= 10) {
            util.showToastFun('最多10个人');
            this.data.taskItemArr[number].num = 10;
        } else {
            this.data.taskItemArr[number].num = peopleNum;
        }

        this.setData({
            taskItemArr: this.data.taskItemArr,
        })
    },

    peopleMins: function(e) {
        let index = e.currentTarget.dataset.number;
        if (this.data.taskItemArr[index].num <= 1) {
            util.showToastFun('至少一个人');
            return;
        }
        this.data.taskItemArr[index].num--;
        this.setData({
            taskItemArr: this.data.taskItemArr,
        })
    },

    peopleAdd: function(e) {
        let index = e.currentTarget.dataset.number;
        if (this.data.taskItemArr[index].num >= 10) {
            util.showToastFun('最多10个人');
            return;
        }
        this.data.taskItemArr[index].num++;
        this.setData({
            taskItemArr: this.data.taskItemArr,
        })
    },

    // 创建任务
    creatOneTask: function() {
        if (this.data.taskTheme == "") {
            util.showToastFun('主题不能为空');
            return;
        };

        for (let i = 0; i < this.data.taskItemArr.length; i++) {
            if (this.data.taskItemArr[i].title == '') {
                util.showToastFun('任务安排不能为空');
                return;
            };
            if (this.data.taskItemArr[i].num == '' || this.data.taskItemArr[i].num < 1) {
                util.showToastFun('人数至少为1');
                return;
            }
            if (this.data.taskItemArr[i].num > 10) {
                util.showToastFun('人数最多为10');
                return;
            }
        };

        this.requestTaskUrl(this.data.taskTheme, JSON.stringify(this.data.taskItemArr));
    },

    // 创建任务
    requestTaskUrl: function(title, arr) {
        util.showLoadfun('创建中');
        let _this = this;
        let requestTaskUrl = wxAPIF.domin + 'assignTask';
        wxAPIF.wxRequest(_this, requestTaskUrl, "POST", {
            open_id: wx.getStorageSync('user_openID'),
            title: title,
            pic: 'https://tp.datikeji.com/a/15459826773637/oGLjACxLNxthJdZzoOngQwHqNY3xO50B64Z9Ou1T.png',
            user_assign: arr,
        }, function(res) {
            wx.hideLoading();
            console.log(res);
            if (res.code == 0) {
                let release_id = res.id;
                _this.navToWaitTask(release_id);
            }
        })
    },

    // 跳转等待分任务
    navToWaitTask: function(release_id) {
        wx.navigateTo({
            url: `/pages/waitPointsTask/waitPointsTask?release_id=${release_id}`,
        })
    },
})