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

/**
 * 判断两个日期相差天数
 */
function getDays(strDateStart, strDateEnd) {
	var strSeparator = "-"; //日期分隔符
	var oDate1;
	var oDate2;
	var iDays;
	oDate1 = strDateStart.split(strSeparator);
	oDate2 = strDateEnd.split(strSeparator);
	var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
	var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
	iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
	return iDays;
}

function dateToString(now) {
	var year = now.getFullYear();
	var month = (now.getMonth() + 1).toString();
	var day = (now.getDate()).toString();
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	var dateTime = year + "-" + month + "-" + day;
	return dateTime;
}


//一定概率执行处理，N是概率，例如：七分之一，n就是7
const randomJudgeDo = n => {
	var randomValue = Math.floor(Math.random() * n) + 1;
	console.log("====randomJudgeDo===" + n + "|" + randomValue);
	if (randomValue == n) {
		return true;
	} else {
		return false;
	}
}

function getRandomCode() {
	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	var nums = "";
	for (var i = 0; i < 32; i++) {
		var id = parseInt(Math.random() * 61);
		nums += chars[id];
	}
	return nums;
}


const isNull = str => {
	if (str == null || str == undefined || str == '') {
		return true;
	} else {
		return false;
	}
}

module.exports = {
    formatTime: formatTime,
    formatNumber: formatNumber,
    getRandom: getRandom,
	showToastFun: showToastFun,
	showLoadfun: showLoadfun,
	isNull: isNull,
	getRandomCode: getRandomCode,
	randomJudgeDo: randomJudgeDo,
	dateToString: dateToString,
	getDays: getDays,
}