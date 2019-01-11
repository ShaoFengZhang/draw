// components/zhuanpan/zhuanpan.js
//创建并返回内部 audio 上下文 innerAudioContext 对象


import wxAPIF from '../../utils/wxApiFun.js';

var app = getApp(),timer = null;

Component({
    options: {
        multipleSlots: false // 在组件定义时的选项中启用多slot支持
    },

    /**
     * 组件的属性列表
     * 用于组件自定义设置   组件的对外属性
     */
    properties: {
        myProperty: { // 属性名        myProperty2: String, 简化的定义方式
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: '', // 属性默认 初始值（可选），如果未指定则会根据类型选择一个
            observer: function(newVal, oldVal, changedPath) {
                // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
                // 通常 newVal 就是新设置的数据， oldVal 是旧数据
            }
        },

        probability: {
            type: Boolean, // 概率开关，默认随机 false
            value: false
        },

        musicflg: {
            type: Boolean, // 转盘声音开关，默认true
            value: true
        },

        fastJuedin: {
            type: Boolean, // 快速转动转盘的开关，默认false
            value: false
        },

        repeat: {
            type: Boolean, // 重复抽取开关，默认false
            value: false
        },

        size: {
            type: Object, // 转盘大小，宽高单位rpx
            value: {
                w: 659, // 注意宽要比高小1rpx
                h: 660
            }
        },

        // 限制：最多17个选项， 单个选项最多填10-13个字, 选项名称最多21个字
        awardsConfig: { // 默认的当前转盘选项 
            type: Object,
            value: {
                option: '我的小决定？',
                awards: [{
                        id: 0,
                        name: "最多17个选项",
                        color: 'red',
                        probability: 0
                    },
                    {
                        id: 1,
                        name: "选项最多填13字",
                        color: 'green',
                        probability: 0
                    }
                ],
            }
        }

    },

    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染   
     */
    data: {
        animationData: {}, // 转盘动画
        zhuanflg: false, // 转盘是否可以点击切换的标志位
        fastTime: 7600, // 转盘快速转动的时间
        slowTime: 3900, // 转盘慢速转动的时间
        block1: 'block', // 转盘中心的图片标志位，用来显示隐藏
        block2: 'none',
        block3: 'none',
        block4: 'none',
		imangeClick:"_zhuan",
    },

    //组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
    created: function() {
        console.log('==========created==========');
    },

    // 组件生命周期函数，在组件实例进入页面节点树时执行
    attached: function() {
        console.log('==========attached==========');
		   
    },

	// 组件生命周期函数，在组件布局完成后执行
	ready:function(){
		console.log("===========ready==========");
		app.start.src = 'https://tp.datikeji.com/a/15470291187716/WmKmoOBFsU6M9wXRtgabiyVSqkKeeX2HQhU48Mwq.mpga';
		app.mid.src = 'https://tp.datikeji.com/a/15470291432773/Arcu1N6xrAxGAhbjYGSCKhiBbOfBORCKNV9QRq3e.mpga';
		app.stop.src = 'https://tp.datikeji.com/a/15470291751556/S280m9BS3v6Dzn0S3sDJ5GnbrF6rkVvPlC5VjDov.mpga'; 
		this.setData({
			awardsConfig: app.xiaojuedingArr,
		});
		this.initAdards();
	},

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
        /*
         * 公有方法
         */
        //判断值是否为空
        isNull(str) {
            if (str == null || str == undefined || str == '') {
                return true;
            } else {
                return false;
            }
        },

        //初始化数据
        initAdards() {
            var that = this,
                awardsConfig = that.data.awardsConfig;
            var t = awardsConfig.awards.length; // 选项长度
            var e = 1 / t,
                i = 360 / t,
                r = i - 90;

            for (var g = 0; g < t; g++) {
                awardsConfig.awards[g].item2Deg = g * i + 90 - i / 2 + "deg"; //当前下标 * 360/长度 + 90 - 360/长度/2
                awardsConfig.awards[g].afterDeg = r + "deg";
            }

            that.setData({
                turnNum: e, // 页面的单位是turn
                awardsConfig: awardsConfig,
            })
        },

        //重置转盘
        reset() {
			console.log('========reset==========')
            var that = this,
                awardsConfig = that.data.awardsConfig;
            console.log(awardsConfig);
            var animation = wx.createAnimation({
                duration: 1,
                timingFunction: "linear"
            });
            that.animation = animation;
            animation.rotate(0).step(), app.runDegs = 0;

            that.setData({
                animationData: animation.export(),
                block4: 'block'
            })

            for (let x in awardsConfig.awards) {
                awardsConfig.awards[x].opacity = '1';
            }

            setTimeout(function() {
                that.setData({
                    block1: 'block',
                    block2: 'none',
                    block3: 'none',
                    block4: 'none',
                    awardsConfig: awardsConfig,
                })

                // that._myAwards(true,0);
            }, 300)
        },

        /*
         * 内部私有方法建议以下划线开头
         * triggerEvent 用于触发事件,通过triggerEvent来给父组件传递信息的
         * 写法： this.triggerEvent('cancelEvent', { num: 1 })  // 可以将num通过参数的形式传递给父组件
         */

        // GO转盘开始转动
		userDoSelect(e) {
            let that = this;
			let awardsConfig = that.data.awardsConfig;
			let r = e;



            console.log('当前答案选项的下标==', r);
            setTimeout(function() {

                //转盘开始转动音乐
				that.data.musicflg ? that.data.fastJuedin ? app.mid.play() : app.start.play() : '';

                //要转多少度deg
                app.runDegs = app.runDegs || 0, app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (2160 - r * (360 / awardsConfig.awards.length));

                var animation = wx.createAnimation({
                    duration: that.data.fastJuedin ? that.data.slowTime : that.data.fastTime,
                    timingFunction: "ease"
                });
                that.animation = animation;

                //这动画执行的是差值 
                //如果第一次写rotate（360） 那么第二次再写rotate（360）将不起效果
                animation.rotate(app.runDegs).step(), 0 == r && (app.runDegs = 0);

                that.setData({
                    animationData: animation.export(),
					block1: 'block',
                    block2: 'block',
                    block3: 'none',
                    zhuanflg: true,
                })

                that._setatZhuan(true);
            }, 100);

            app.timer = setTimeout(function() {
                for (let x in awardsConfig.awards) {
                    if (x != r) {
                        awardsConfig.awards[x].opacity = '0.3';
                    } else {
                        awardsConfig.awards[x].opacity = '1';
                    }
                }

                //转盘停止后的音乐
				!that.data.musicflg ? '' : app.stop.play();

                that.setData({
                    animationData: {},
                    s_awards: awardsConfig.awards[r].title, //最终选中的结果
                    awardsConfig: awardsConfig,
                    block1: 'none',
                    block2: 'none',
                    block3: 'block',
                    zhuanflg: false,
					imangeClick: "",
                })

				that._myAwards(false, r);
                that._setatZhuan(false);
            }, that.data.fastJuedin ? that.data.slowTime : that.data.fastTime);
        },

        //当前转盘的结果   e:转盘什么时候能点击的标志位
        _myAwards(boolean,r) {
            this.triggerEvent('myAwards', {
                s_awards: this.data.s_awards,
				end: boolean,
				index:r,
            });
        },

        //转盘开始转动或者结速转动后的要传的值
        _setatZhuan(e) {
            this.triggerEvent('startZhuan', e); // 向父组件传出当前决定的数组数据
        },

		// 传出计时器

		// 用户做选择
		_zhuan:function(){
			let _this = this;
			this.setData({
				imangeClick: "",
			})
			let userDoSelectUrl = wxAPIF.domin + 'makeChoice';
			wxAPIF.wxRequest(_this, userDoSelectUrl, "POST", {
				open_id: wx.getStorageSync('user_openID'),
				release_id: app.userSelcetId,
			}, function (res) {
				console.log(res);
				if (res.code == 0) {
					_this.userDoSelect(res.data.join_num);
					_this.triggerEvent('startGame', true)
				}else{
					wx.showModal({
						title: '提示',
						content: res.msg,
						showCancel: false,
						success: function () {
							wx.navigateBack({
								delta: 1
							})
						}
					})
				}
			})
		},
    }
})