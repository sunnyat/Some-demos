window.addEventListener('load', function() {
    var focus = document.querySelector('.focus');
    var ul = focus.children[0];   // 获取focus的第一个孩子，也就是ul
    var ol = focus.children[1];
    var w = focus.offsetWidth;    // 获取focus的宽度
    var index = 0;    // 用来记录图片索引
    var timer = setInterval(function() {    // 添加定时器，两秒调用一次
        index++;   // 每调用一次（轮播一次），图片索引号+1
        var translatex = -index * w;    // ul要移动的距离
        ul.style.transition = 'all .4s';   // 添加过渡属性（css3里的属性）
        ul.style.transform = 'translateX(' + translatex + 'px)';
    }, 2000);
    // 给ul绑定监听函数（每次轮播移动的都是整个ul）  过渡结束（transitionend）时执行
    ul.addEventListener('transitionend', function() {
        if(index >= 3) {    // 索引 > 3说明已经轮播到最后一张了
            index = 0;
            // 去掉过渡效果 快速回到第一张
            ul.style.transition = '';
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        } else if(index < 0) {    // 索引 < 0说明用户一开始是往前滑的
            index = 2;
            ul.style.transition = '';
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }
        // 让底部小圆点跟着一起动
        // 将带有current类的li去掉该类
        ol.querySelector('.current').classList.remove('current');
        // 给当前li添加current类
        ol.children[index].classList.add('current');
    })
    // 手指滑动轮播图
    var startX = 0;    // 用来存储手指初始位置
    var moveX = 0;     // 用来存储手指在屏幕上移动的距离
    var flag = false;    // 记录用户是否在图上移动了手指
    // 给ul绑定手指触摸事件
    ul.addEventListener('touchstart', function(e) {
        startX = e.targetTouches[0].pageX;  // 手指的初始触摸位置（左右轮播，只记录x就可以了）
        clearInterval(timer);    // 当手指触摸屏幕时清除定时器（不让它自动轮播了）
    })
    // 给ul绑定手指移动事件
    ul.addEventListener('touchmove', function(e) {
        moveX = e.targetTouches[0].pageX - startX;   // 手指移动的距离
        var translatex = -index * w + moveX;
        ul.style.transition = 'none';
        ul.style.transform = 'translateX(' + translatex + 'px)';
        flag = true;    // 手指移动了，将flag改为true
        e.preventDefault();   // 阻止屏幕滚动的默认行为
    })
    // 给ul绑定手指离开事件
    ul.addEventListener('touchend', function(e) {
        if(flag) {     // flag==true（移动图片）时才去判断用户的移动方向和距离
            if(Math.abs(moveX) > 50) {  // 移动距离大于50时 滑向上一张或下一张（moveX可能为正也可能为负，Math.abs()取绝对值）
                if(moveX > 0) {  // 大于0右滑 图片索引减一
                    index--;
                } else {    // 小于0左滑 图片索引加一
                    index++;
                }
                var translatex = -index * w;
                ul.style.transition = 'all .3s';
                ul.style.transform = 'translateX(' + translatex + 'px)';
            } else {    // 小于50px就回弹
                var translatex = -index * w;
                ul.style.transition = 'all .1s';
                ul.style.transform = 'translateX(' + translatex + 'px)';
            }
        }
        // 结束后 把flag重新改为false，并开启定时器让图片开始轮播
        flag = false;
        // 先清除再开启，保证只有一个定时器在运行（不然会有bug）
        clearInterval(timer);
        timer = setInterval(function() {
            index++;
            var translatex = -index * w;
            ul.style.transition = 'all .4s';
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }, 2000);
    })
}) 