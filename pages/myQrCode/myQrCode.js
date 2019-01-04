const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
		ifShowServiceMask:false,
    },

    onLoad: function(options) {
        this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/index/index&scene=${wx.getStorageSync('u_id')}`;
        console.log(this.qrcodeImg);
		this.setData({
			qrcodeImg: this.qrcodeImg,
		})
    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function(e) {
		let title = "给你推荐一个超好用的小工具集合，玩转微信全靠他了。";
		let img = app.globalData.recommendIcon;
        let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}`;
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

	//ifShowServiceMask
	ifShowServiceMask:function(){
		this.setData({
			ifShowServiceMask: !this.data.ifShowServiceMask,
		})
	},

	// 绘制Canvas
	drawcanvs: function () {
		wx.showLoading({
			title: '正在生成名片',
			mask: true,
		});
		let _this = this;
		let ctx = wx.createCanvasContext('canvas');
		let canvasImg = 'https://tp.datikeji.com/a/15459935689962/84Ih8ah09dgN9RDWY0cTVkrQE5ovRn5dgixRro5u.png';
		let bottxt = "长按识别二维码，即可使用";
		let toptxt = "向你推荐了抽签工具";
		let uerName = app.globalData.userInfo.nickName.slice(0,10);
		let userImg = app.globalData.userInfo.avatarUrl;
		wx.getImageInfo({
			src: canvasImg,
			success: function (res) {
				_this.setData({
					bgimgH: res.height,
					bgimgW: res.width,
				});
				ctx.setTextBaseline('top');
				ctx.drawImage(res.path, 0, 0, res.width, res.height);

				ctx.setFillStyle('#797979');
				ctx.setFontSize(28);
				ctx.setTextAlign('center');
				ctx.fillText(bottxt, res.width / 2, 750);

				ctx.setFontSize(26);
				ctx.setTextAlign('left');
				ctx.fillText(toptxt, 220, 138);

				ctx.setFillStyle('#333333');
				ctx.fillText(uerName, 220, 88);
				wx.getImageInfo({
					src: userImg,
					success: function (res2) {
						ctx.save();
						ctx.beginPath();
						ctx.arc(131, 131, 60, 0, 2 * Math.PI);
						ctx.closePath();
						ctx.clip();
						ctx.drawImage(res2.path, 71, 71, 120, 120);
						ctx.restore();
						ctx.beginPath();
						ctx.setLineWidth(2);
						ctx.arc(131, 131, 62, 0, 2 * Math.PI);
						ctx.setStrokeStyle('rgba(237, 73, 64, 0.16)');
						ctx.stroke();
						wx.getImageInfo({
							src: _this.qrcodeImg,
							success: function (res1) {
								ctx.drawImage(res1.path, 105, 234, 502, 494);
								ctx.draw();
								setTimeout(function () {
									wx.hideLoading();
									_this.showOffRecord();
								}, 1000)

							}
						})
					}
				})



			}
		})
	},

	// 生成临时图片
	showOffRecord: function () {
		let _this = this;
		wx.showLoading({
			title: '正在保存名片',
			mask: true,
		});
		wx.canvasToTempFilePath({
			destWidth: this.data.bgimgW * 2,
			destHeight: this.data.bgimgH * 2,
			canvasId: 'canvas',
			success: function (res) {
				wx.hideLoading();
				_this.saveCanvas(res);
			}
		})
	},

	// 保存图片
	saveCanvas: function (res) {
		wx.saveImageToPhotosAlbum({
			filePath: res.tempFilePath,
			success: function () {
				wx.showModal({
					title: '名片生成成功',
					content: `记得分享哦~`,
					showCancel: false,
					success: function (data) {
						wx.previewImage({
							urls: [res.tempFilePath]
						})
					}
				});
			},
			fail: function () {
				wx.previewImage({
					urls: [res.tempFilePath]
				})
			}
		})
	},
})