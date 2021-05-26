window.addEventListener('DOMContentLoaded', function() {   // DOMContentLoaded等页面DOM元素加载完毕
    // 获取需要用到的的元素
    var arrow_l = document.querySelector('.arrow-l');
    var arrow_r = document.querySelector('.arrow-r');
    var con = document.querySelector('.con');
    var conWidth = con.offsetWidth;
    // 鼠标经过箭头显示，鼠标离开箭头隐藏
    con.addEventListener('mouseenter', function() {
        arrow_l.style.display = 'block';  // 将左右箭头的display设为block
        arrow_r.style.display = 'block';
        // 鼠标经过停止定时器
        clearInterval(timer);
        timer = null; // 释放定时器变量
    });
    con.addEventListener('mouseleave', function() {
        arrow_l.style.display = 'none';  // 将左右箭头display设为none
        arrow_r.style.display = 'none';
        // 鼠标离开再重新开启定时器
        timer = setInterval(function() {
            // 手动调用点击事件
            arrow_r.click();  // 自动轮播
        }, 2000);
    });
    
    var ul = con.querySelector('ul');
    var ol = con.querySelector('ol');
    // 动态添加底部小圆圈
    for(var i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li');
        // 通过添加自定义属性来记录小圆圈索引号
        li.setAttribute('index', i);
        ol.appendChild(li);
        // 生成小圆圈的同时就可以给它绑定单击事件
        li.addEventListener('click', function() {
            // 排他思想 干掉所有人，留下我自己
            for(var i = 0; i < ol.children.length; i++) {  // 先把所有的小圆圈改为未选中状态
                ol.children[i].className = '';
            }
            // 再把当前小圆圈改为选中状态
            this.className = 'current';
            var index = this.getAttribute('index');  // 获取当前小圆圈的索引
            // 将index值赋值给num以及circle，将小圆圈的点击事件和左右箭头点击事件同步
            num = index;
            circle = index;
            animate(ul, - index * conWidth);
        })
    }
    // 让第一个小圆圈底色为白色（选中状态）
    ol.children[0].className = 'current';
    // 克隆第一张图片
    var first = ul.children[0].cloneNode(true);  // true 深拷贝
    ul.appendChild(first); // 拷贝第一张图片添加到ul最后

    var num = 0;    // 用来存储点击后图片序号
    var circle = 0;   // 用来存储点击后小圆圈序号
    var flag = true;   // flag 节流阀 防止用户点击过快 图片播放太快
    // 右侧箭头点击播放
    arrow_r.addEventListener('click', function() {
        if(flag) {
            // 点击后先关闭节流阀
            flag = false;
            // 如果播放到了最后一张，就把left直接值设为0从头播放，同时还原num
            if(num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0;
            }
            num++;
            animate(ul, - num * conWidth, function() {
                // 回调函数 动画执行完后开启节流阀
                flag = true;
            });
            // 小圆圈和箭头一起变化
            circle++;
            /* if(circle == ol.children.length) {
                  circle = 0;
               } */
            // 可以用三元运算符判断小圆圈是否到了最后一个，如果是最后一个就还原circle
            circle == ol.children.length ? circle = 0 : circle;
            circleChange();   // 使当前小圆圈为选中状态
        }
    });

    // 左侧箭头点击播放
    arrow_l.addEventListener('click', function() {
        if(flag) {
            // 关闭节流阀
            flag = false;
            // 如果播放到了第一张，就把left值设为最后一张的值
            if(num == 0) {
                num = ul.children.length - 1;
                ul.style.left = - num * conWidth + 'px';
            }
            num--;
            animate(ul, - num * conWidth, function() {
                flag = true;
            });
            // 小圆圈和箭头一起变化 
            circle--;
            // circle < 0 时说明是第一张图片，将小圆圈改为第四个（索引为3）
            if(circle < 0) {
                circle = ol.children.length - 1;
            }
            circleChange();
        }
    })
    // 小圆圈的选中状态（相同代码可以封装为一个函数，使代码更简洁）
    function circleChange() {
        // 排他思想
        for(var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        ol.children[circle].className = 'current';
    }
    // 自动播放轮播图，相当于隔一段时间调用一次右侧箭头点击事件
    var timer = setInterval(function() {
        // 手动调用点击事件
        arrow_r.click();
    }, 2000);

    // obj 动画对象
    // target 目标位置
    // callback 回调函数
    function animate(obj, target, callback) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            var step = (target - obj.offsetLeft) / 10;  // step步长值
            step = step > 0 ? Math.ceil(step) : Math.floor(step); // 大于零向上取整,小于零向下取整
            if(obj.offsetLeft == target) {
                clearInterval(obj.timer);
                callback && callback();
            }
            obj.style.left = obj.offsetLeft + step + 'px';
        }, 15)
    }
})