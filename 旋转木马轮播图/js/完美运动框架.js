var timer = null;  // 声明一个timer来存储定时器
function animate(obj, json, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        /* 
            * 当我们改变多个属性时，如果其中一个属性已经达到目标值，就会清除定时器，就会导致其他没有达到目标值的属性也会停止
            * 为了解决这个问题，我们声明一个节流阀flag，让它为true
            * 判断是否还有没达到目标值的属性，如果还有，就让flag为false（关闭节流阀），让定时器继续执行
            * 当所有属性都达到了目标值时，才执行清除定时器那一步
            */
        var flag = true;
        for(var attr in json) {  // for...in...遍历对象
            var icur = 0;  // 存储获取过来的属性值
            if(attr == 'opacity') {  // 判断获取过来的属性是否为opacity
                icur = Math.round(parseFloat(getStyle(obj, attr)) * 100); // float会有小误差，所以需要四舍五入一下
            } else {
                icur = parseInt(getStyle(obj, attr));  // 获取过来的值可能带单位，所以需要用到parseInt()
            }
            var speed = (json[attr] - icur) / 10;  // 速度 逐渐变慢（也可以设为固定值实现匀速运动）
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); // speed并不总是整数，会导致和目标值不相等，所以需要对speed进行取整，大于0向上取整，小于0向下取整
            if(icur != json[attr]) {  // 判断是否还有属性没有达到目标值
                flag = false;
            }
            if(attr == 'opacity') {  // opacity是没有单位的，所以在这里需要判断一下
                obj.style.filter = 'alpha(opacity = '+ (icur + speed) +')';
                obj.style.opacity = (icur + speed) / 100;  // opacity别忘了除以100
            } else if(attr == 'zIndex') {
                obj.style.zIndex = json[attr];
            }else {
                obj.style[attr] = icur + speed + 'px';  // 原来的值加上速度赋值给属性
            }
        }
        if(flag) { // 当所有属性都达到目标值，即flag为true时，再停止定时器
            clearInterval(obj.timer);
            callback && callback();  // 判断是否有回调函数，有的话就执行
        }
    }, 25)
}
// 获取属性函数 
function getStyle(obj, attr) {
    if(obj.currentStyle){   //IE浏览器
        return obj.currentStyle[attr];
    }else{    //chrome、firefox等浏览器
        return getComputedStyle(obj,null)[attr];
    }
}