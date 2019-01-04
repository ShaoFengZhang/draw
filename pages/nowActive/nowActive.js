const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
		temaIcon: "https://tp.datikeji.com/a/15459826773637/oGLjACxLNxthJdZzoOngQwHqNY3xO50B64Z9Ou1T.png",
    },

    onLoad: function(options) {
        this.qrcodeImg = wxAPIF.domin + `get_qrcode?page=pages/overTheCard/overTheCard&scene=${options.actId}@${wx.getStorageSync('u_id')}`;
        console.log(this.qrcodeImg);

        this.setData({
            name: app.globalData.userInfo.nickName.slice(0, 5),
            avatarUrl: app.globalData.userInfo.avatarUrl,
            title: options.title,
            actId: options.actId,
            qrIcon: this.qrcodeImg,
        });
    },

    onShow: function() {

    },

    // 分享
    onShareAppMessage: function(e) {
		console.log(e);
		let title = `${this.data.title}咱们抽签决定吧！`;
		let img = app.globalData.invitFriendIcon;
		let path = `/pages/overTheCard/overTheCard?actId=${this.data.actId}&title=${this.data.title}&userId=${wx.getStorageSync('u_id')}`;
		console.log(path);
		return {
			title: title,
			path: path,
			imageUrl: img,
		}
    },

    // 绘制Canvas
    drawcanvs: function() {
        util.showLoadfun("正在生成海报");
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        let canvasImg = 'https://tp.datikeji.com/a/15458769292778/MKN6J0WgTsjoUqhdqM1hK8uUEXj1qyGZTE9rM2GS.png';
        let titleIcon = this.data.temaIcon;
        let avatarUrl = this.data.avatarUrl;
        let teamName = this.data.title;
        let titleTxt =  '我发起了一个活动';
        let teamTxt = "[活动主题]";
        let bottxt = "长按识别小程序，参与活动";
        wx.getImageInfo({
            src: canvasImg,
            success: function(res) {
                _this.setData({
                    bgimgH: res.height,
                    bgimgW: res.width,
                });
                ctx.drawImage(res.path, 0, 0, res.width, res.height);
                ctx.setTextBaseline('top');
                ctx.setTextAlign('center');
                ctx.setFillStyle('#9D9D9D');
                ctx.setFontSize(28);
                ctx.fillText(bottxt, res.width / 2, 936);

                ctx.setTextAlign('left');
                ctx.setFillStyle('#333333');
                ctx.setFontSize(32);
                if (teamName.length > 11) {
                    ctx.fillText(teamName.slice(0, 11), 260, 516);
                    ctx.fillText(teamName.slice(11, 28), 70, 576);
                } else {
                    ctx.fillText(teamName, 260, 516);
                }


                ctx.setFillStyle('#FFC16F');
                ctx.font = 'normal bold 38px sans-serif';
                ctx.fillText(teamTxt, 70, 510);

                ctx.setTextAlign('left');
                ctx.setFillStyle('#333333');
                ctx.font = 'normal bold 34px sans-serif';
                ctx.fillText(titleTxt, 198, 98);

                ctx.beginPath();
                ctx.setLineWidth(4);
                ctx.arc(360, 776, 140, 0, 2 * Math.PI);
                ctx.setStrokeStyle('#E8E8E8');
                ctx.stroke();

                wx.getImageInfo({
                    src: titleIcon,
                    success: function(res1) {
                        ctx.drawImage(res1.path, 70, 196, 582, 290);

                        wx.getImageInfo({
                            src: avatarUrl,
                            success: function(res2) {
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(124, 114, 54, 0, 2 * Math.PI);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(res2.path, 70, 60, 108, 108);
                                ctx.restore();
                                ctx.beginPath();
                                ctx.setLineWidth(2);
                                ctx.arc(124, 114, 54, 0, 2 * Math.PI);
                                ctx.setStrokeStyle('#FFFFFF');
                                ctx.stroke();

                                wx.getImageInfo({
                                    src: _this.qrcodeImg,
                                    success: function(res3) {
                                        ctx.drawImage(res3.path, 220, 636, 280, 280);
                                        ctx.draw();
                                        setTimeout(function() {
                                            wx.hideLoading();
                                            _this.showOffRecord();
                                        }, 1000)
                                    }
                                });

                            }
                        });



                    }
                });




            }
        })
    },

    // 生成临时图片
    showOffRecord: function() {
        let _this = this;
        wx.showLoading({
            title: '正在生成海报',
            mask: true,
        });
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW * 2,
            destHeight: this.data.bgimgH * 2,
            canvasId: 'canvas',
            success: function(res) {
                wx.hideLoading();
                _this.canvasSaveArgs = res;
                _this.saveCanvas(res)
            }
        })
    },

    // 保存图片
    saveCanvas: function(res) {
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function() {
                wx.showModal({
                    title: '保存图片',
                    content: `记得发送到哦~`,
                    showCancel: false,
                    success: function(data) {
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                });
            },
            fail: function() {
                wx.previewImage({
                    urls: [res.tempFilePath]
                })
            }
        })
    },

})