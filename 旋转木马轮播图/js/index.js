window.addEventListener("load", function() {
    var arr = [
        {   // 1
            width: 450,
            top: 60,
            left: 0,
            opacity: 40,
            zIndex: 2
        },
        {   // 2
            width: 550,
            top: 30,
            left: 100,
            opacity: 70,
            zIndex: 3
        },
        {   // 3  中间图片
            width: 650,
            top: 0,
            left: 200,
            opacity: 100,
            zIndex: 4
        },
        {   // 4
            width: 550,
            top: 30,
            left: 400,
            opacity: 70,
            zIndex: 3
        },
        {   // 5
            width: 450,
            top: 60,
            left: 600,
            opacity: 40,
            zIndex: 2
        }
    ];
    var slider = document.querySelector(".slider");
    var lis = slider.querySelectorAll("li");
    var arrow_l = slider.querySelector(".arrow-l");
    var arrow_r = slider.querySelector(".arrow-r");

    // 鼠标移入移出箭头显示隐藏
    slider.addEventListener("mouseover", function() {
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
    });
    slider.addEventListener("mouseout", function() {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
    });
    
    var flag = true; // flag节流阀 为了解决点击过快而产生bug
    move(); // 先调用一下，为了刚打开浏览器时渲染页面

    // 点击左右箭头轮播图片
    arrow_r.addEventListener("click", function() {
        if(flag) {
            flag = false; // 关闭节流阀 等到动画结束了才能继续执行点击操作
            arr.unshift(arr.pop());  // 将数组最后边的元素删除，添加到最前边
            move();  // 轮播图片
        }
    });
    arrow_l.addEventListener("click", function() {
        if(flag) {
            flag = false;
            arr.push(arr.shift());  // 将数组最前边的元素删除，添加到最后边
            move();
        }
    });

    // 让每个图片执行动画
    function move() {
        for(var i = 0; i < lis.length; i++) {
            animate(lis[i], arr[i], function() {
                flag = true;  // 回调函数，当动画执行完 再把节流阀打开
            });
        }
    }
    // 动画函数
    function animate(obj, json, callback) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            var bool = true;
            for(var attr in json) {
                var icur = 0;
                if(attr == 'opacity') {
                    icur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
                } else {
                    icur = parseInt(getStyle(obj, attr));
                }
                var speed = (json[attr] - icur) / 10;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if(icur != json[attr]) {
                    bool = false;
                }
                if(attr == 'opacity') {
                    obj.style.filter = 'alpha(opacity = '+ (icur + speed) +')';
                    obj.style.opacity = (icur + speed) / 100;
                } else if(attr == 'zIndex') {
                    obj.style.zIndex = json[attr];
                } else {
                    obj.style[attr] = icur + speed + 'px';
                }
            }
            if(bool) {
                clearInterval(obj.timer);
                callback && callback();
            }
        },15);
    }
    // 获取属性函数 
    function getStyle(obj, attr) {
        if(obj.currentStyle){   //IE浏览器
            return obj.currentStyle[attr];
        }else{    //chrome、firefox等浏览器
            return getComputedStyle(obj,null)[attr];
        }
    }
});