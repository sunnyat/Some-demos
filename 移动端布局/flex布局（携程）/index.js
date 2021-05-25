window.addEventListener('load', function() {
    var focus = document.querySelector('.focus');
    var ul = focus.children[0];
    var ol = focus.children[1];
    var w = focus.offsetWidth;
    var index = 0;
    var timer = setInterval(function() {
        index++;
        var translatex = -index * w;
        ul.style.transition = 'all .4s';
        ul.style.transform = 'translateX(' + translatex + 'px)';
    }, 2000);
    // 监听函数  transitionend过渡效果完成时执行
    ul.addEventListener('transitionend', function() {
        if(index >= 3) {
            index = 0;
            // 去掉过渡效果 快速回到第一张
            ul.style.transition = '';
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        } else if(index < 0) {    // 用户可能往后滑 
            index = 2;
            ul.style.transition = '';
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }
        // 小圆点跟着一起动
        // 将带有.current的li去掉
        ol.querySelector('.current').classList.remove('current');
        // 给当前li添加.current
        ol.children[index].classList.add('current');
    })
    // 手指滑动轮播图
    var startX = 0;
    var moveX = 0;
    var flag = false;
    ul.addEventListener('touchstart', function(e) {
        startX = e.targetTouches[0].pageX;
        clearInterval(timer);
    })
    ul.addEventListener('touchmove', function(e) {
        moveX = e.targetTouches[0].pageX - startX;
        var translatex = -index * w + moveX;
        ul.style.transition = 'none';
        ul.style.transform = 'translateX(' + translatex + 'px)';
        flag = true;    // 当用户移动图片时改为true
        e.preventDefault();  // 阻止屏幕滚动行为
    })
    ul.addEventListener('touchend', function(e) {
        if(flag) {     // 移动图片时才去判断
            if(Math.abs(moveX) > 50) {
                if(moveX > 0) {  // 右滑
                    index--;
                } else {    // 左滑
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
        flag = false;
        // 开启定时器 先清除再开启
        clearInterval(timer);
        timer = setInterval(function() {
            index++;
            var translatex = -index * w;
            ul.style.transition = 'all .4s';
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }, 2000);
    })

    // 回顶操作
    var goBack = document.querySelector('.goBack');
    var banner = document.querySelector('.banner');
    window.addEventListener('scroll', function() {
        if(window.pageYOffset >= banner.offsetTop) {
            goBack.style.display = 'block';
        } else {
            goBack.style.display = 'none';
        }
    })
    goBack.addEventListener('click', function() {
        window.scroll(0, 0);
    })
}) 