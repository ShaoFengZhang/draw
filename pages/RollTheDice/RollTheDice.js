const app = getApp();
import util from '../../utils/util.js';
import wxAPIF from '../../utils/wxApiFun.js';
Page({

    data: {
        TopAni: '',
        BotAni: '',
        drawStart: 'drawStart',
        drawMove: 'drawMove',
        drawEnd: 'drawEnd',
		thelidClick:'thelidClick',
        zAni: '',
        bindtap: 'bindtap',
        setDiceNum: 5,
        tabType: 1,
        ifShowSetUp: false,
        waveClickEvent: 'wavePhoneFun',
        openClickEvent: "clickBInd",
        voiceTxt: "1",
		shakeTxt: "1",
        openVoice: true,
		openShake:true,
        DiceArr: [{
                class: 'oneDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/01.png'
            },
            {
                class: 'twoDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/02.png'
            },
            {
                class: 'threeDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/03.png'
            },
            {
                class: 'fourDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/04.png'
            },
            {
                class: 'fiveDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/05.png'
            },
            {
                class: 'sixDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/06.png'
            },
        ],
    },

    onLoad: function(options) {
        this.diceOriginArr = [{
                class: 'oneDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/01.png'
            },
            {
                class: 'twoDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/02.png'
            },
            {
                class: 'threeDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/03.png'
            },
            {
                class: 'fourDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/04.png'
            },
            {
                class: 'fiveDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/05.png'
            },
            {
                class: 'sixDice',
                ifSHowDice: 1,
                DiceIcon: '/assets/dice/06.png'
            },
        ];
        this.produceDice(this.data.setDiceNum);
        this.audioDice();

    },

    onShow: function() {
        this.setData({
            waveClickEvent: 'wavePhoneFun',
        });
        this.shakeFun();
    },

    onHide: function() {
        wx.stopAccelerometer();
    },

    onUnload: function() {
        wx.stopAccelerometer()
    },

    // 分享
    onShareAppMessage: function(e) {
		if (e.from=="button"){
			if (e.target.id == "shareBtn"){
				var title = "你不是说运气比我好么？快来摇骰子玩游戏吧。";
				var img = 'https://tp.datikeji.com/a/15465884659240/mOYbs40TPsy1wQeNIyJhu7uMBnWfQqvphkUInANn.png';
			};
			if (e.target.id == "shareFriend") {
				var title = "输了喝几杯随便你说，敢不敢来玩？";
				var img = "https://tp.datikeji.com/a/15465884169029/S9dThcblkso35ioltUJ9JWzkZ7Ctk9f2EkaIgr0p.png";
			};
		}else{
			var title = "摇大还是摇小？我想要的是666";
			var img = 'https://tp.datikeji.com/a/15465884452119/6mFid58e9mnAOClYJmB92nZe38dQ99jKpI2jrMpV.png';
		}
        
		let path = `/pages/index/index?userId=${wx.getStorageSync('u_id')}&roll=roll`;
        return {
            title: title,
            path: path,
            imageUrl: img,
        }
    },

    // 模式点击按钮
    modeTypeClick: function(e) {
        if (this.data.tabType == e.currentTarget.dataset.type) {
            return;
        }
        this.setData({
            tabType: e.currentTarget.dataset.type
        })
    },

	// 盖子点击事件
	thelidClick:function(){
		if (this.data.TopAni == "" && this.data.BotAni == ""){
			this.setData({
				TopAni: "TopAni",
				BotAni: "",
			});
			return;
		}
		if (this.data.TopAni == "" && this.data.BotAni =="BotAni"){
			this.setData({
				TopAni: "TopAni",
				BotAni: "",
			});
			return;
		}
		if (this.data.BotAni == "" && this.data.TopAni == "TopAni") {
			this.setData({
				TopAni: "",
				BotAni: "BotAni",
			});
			return;
		}
	},

    // 打开按钮点击
    clickBInd: function() {
        this.setData({
            TopAni: "TopAni",
            BotAni: "",
        });
    },

	clickBInd2: function () {
		this.setData({
			TopAni: "",
			BotAni: "BotAni",
		});
	},

    // 滑动相关事件
    drawStart: function(e) {
        var touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;

    },

    drawMove: function(e) {
        var touch = e.touches[0];
        this.disX = this.startX - touch.clientX;
        this.disY = touch.clientY - this.startY;
    },

    drawEnd: function() {
        // console.log('++++++++++++++', this.disY);
        // console.log('--------------', this.disX);
        // if (Math.abs(this.disX) > 50) {
        //     return;
        // } else {
            if (this.disY >= 20) {
                if (this.data.BotAni == "BotAni") {
                    return;
                }
                this.setData({
                    BotAni: 'BotAni',
                    TopAni: '',
                })
            } else if (this.disY <= -20) {
                if (this.data.TopAni == "TopAni") {
                    return;
                }
                this.setData({
                    BotAni: '',
                    TopAni: 'TopAni',
                })
            };
        // };
        this.startX = 0;
        this.startY = 0;
        this.disX = 0;
        this.disY = 0;
    },

    // 产生骰子点数
    produceDice: function(num) {
        let RandomArr = [];
        for (let i = 0; i < 6; i++) {
            RandomArr.push(util.getRandom(6, 1));
        };
        for (let n = 0; n < RandomArr.length; n++) {
            this.data.DiceArr[n].DiceIcon = `/assets/dice/0${RandomArr[n]}.png`
        };
        this.setData({
            DiceArr: this.getRandomArrayElements(this.data.DiceArr, num),
        });
    },

    // 随机显示几张
    getRandomArrayElements: function(arr, count) {
        var shuffled = arr.slice(0),
            i = arr.length,
            min = i - count,
            temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    },

    // 显示设置弹窗
    ifShowSetUpView: function() {
        this.setData({
            ifShowSetUp: !this.data.ifShowSetUp,
        })
    },

    ifShowSetUpView1: function() {
        this.setData({
            ifShowSetUp: !this.data.ifShowSetUp,
            TopAni: "TopAni",
            BotAni: "",
        })
    },

    // 点击设置弹窗摇晃手机按钮
    wavePhoneFun: function(e) {
        let _this = this;
        if (this.data.TopAni == "TopAni") {
            this.diceTimeOne = 1000;
            this.decetTimneTwo = 1500;
        } else {
            this.diceTimeOne = 0;
            this.decetTimneTwo = 500;
        }
        this.setData({
            TopAni: "",
            BotAni: "BotAni",
            waveClickEvent: '',
            openClickEvent: '',
			drawStart: '',
			drawMove: '',
			drawEnd: '',
			thelidClick:'',
        });
        setTimeout(function() {
            if (e && e.currentTarget.dataset.num) {
                _this.ifShowSetUpView();
            };
            _this.setData({
                DiceArr: _this.diceOriginArr,
                zAni: "zAni",
            });
            if (_this.data.openVoice) {
                _this.DiceAudio.play();
            }
            _this.produceDice(_this.data.setDiceNum);
        }, this.diceTimeOne);

        setTimeout(function() {
            _this.setData({
                waveClickEvent: 'wavePhoneFun',
                openClickEvent: "clickBInd",
                zAni: '',
				drawStart: 'drawStart',
				drawMove: 'drawMove',
				drawEnd: 'drawEnd',
				thelidClick: 'thelidClick',
            });
			if (_this.data.openShake){
				wx.vibrateLong();
			}
            
            if (_this.data.tabType == 2) {
                setTimeout(function() {
                    _this.setData({
                        TopAni: "TopAni",
                        BotAni: '',
                    })
                });
            };
			_this.DiceAudio.stop();
        }, this.decetTimneTwo + 1100)

    },

    // MinusFun
    MinusFun: function() {
        this.data.setDiceNum--;
        if (this.data.setDiceNum < 1) {
            this.data.setDiceNum++;
            util.showToastFun("骰子数量不少于1个");
            return;
        };
        this.setData({
            setDiceNum: this.data.setDiceNum,
            DiceArr: this.diceOriginArr.slice(0, this.data.setDiceNum)
        });

    },

    // Addfun
    Addfun: function() {
        this.data.setDiceNum++;
        if (this.data.setDiceNum > 6) {
            this.data.setDiceNum--;
            util.showToastFun("骰子数量不超过6个");
            return;
        };
        this.setData({
            setDiceNum: this.data.setDiceNum,
            DiceArr: this.diceOriginArr.slice(0, this.data.setDiceNum)
        })
    },

    // 声音开关
    voiceFun: function() {
        this.setData({
            voiceTxt: this.data.voiceTxt == 1 ? 2 : 1,
            openVoice: this.data.voiceTxt == 1 ? false : true,
        })
    },

	//震动开关
	zhendongFun:function(){
		console.log(12121211211)
		this.setData({
			shakeTxt: this.data.shakeTxt == 1 ? 2 : 1,
			openShake: this.data.shakeTxt == 1 ? false : true,
		})
	},

    // 创建背景音乐
    audioDice: function() {
        this.DiceAudio = wx.createInnerAudioContext();
        this.DiceAudio.autoplay = false;
        this.DiceAudio.src = '/assets/shaizi.mp3';
    },

	catchtap:function(){},

    // 摇一摇方法封装
    shakeFun: function() {
        let _this = this;
        var numX = 0.2;  //x轴
        var numY = 0.2;  // y轴
        var numZ = 0;   // z轴
        var stsw = true // 开关，保证在一定的时间内只能是一次，摇成功
        var positivenum = 0 //正数 摇一摇总数
        wx.onAccelerometerChange(function(res) {
            if (numX < res.x && numY < res.y) { //个人看法，一次正数算摇一次，还有更复杂的
                positivenum++
                setTimeout(() => {
                    positivenum = 0
                }, 2000) //计时两秒内没有摇到指定次数，重新计算
            }
            if (numZ < res.z && numY < res.y) { //可以上下摇，上面的是左右摇
                positivenum++
                setTimeout(() => {
                    positivenum = 0
                }, 2000) //计时两秒内没有摇到指定次数，重新计算
            }
            if (positivenum == 2 && stsw) { //是否摇了指定的次数，执行成功后的操作
                stsw = false;
                console.log('摇一摇成功');
				_this.setData({
					ifShowSetUp:false,
				})
                _this.wavePhoneFun();
                setTimeout(() => {
                    positivenum = 0 // 摇一摇总数，重新0开始，计算
                    stsw = true
                }, 3000)
            }
        })
    },
})