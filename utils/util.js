// 格式化时间
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-');
}

// 给个位数前边加0
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
};

// 得到一个区间之内的随机数
const getRandom = function(max, min) {
    min = arguments[1] || 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// showToast简单封装一下
const showToastFun = function(ags) {
    wx.showToast({
        title: `${ags}`,
        icon: "none",
        duration: 1600,
        mask: true,
    });
};

//showLoading简单封装一下
const showLoadfun=function(args){
	wx.showLoading({
		title:`${args}`,
		mask:true,
	})
}

module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    getRandom: getRandom,
	showToastFun: showToastFun,
	showLoadfun: showLoadfun,
}