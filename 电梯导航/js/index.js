$(function() {
    // 节流阀（互斥锁） 用来解决一个小bug（当用户点击导航条时，页面滚动会触发eachTool()里的内容，当我们点击时不需要触发eachTool()）
    var flag = true;
    // 当用户滑动到banner区域，显示电梯导航。封装成一个函数toggleTool()
    function toggleTool() {
        if($(document).scrollTop() > $(".banner").offset().top - 1) {
            $(".slider-bar").fadeIn();  // fadeIn()淡入（显示）
        } else {
            $(".slider-bar").fadeOut(); // fadeOut()淡出（隐藏）
        }
    }
    // each()遍历所有模块，让电梯导航和对应模块保持一致。封装成一个函数eachTool()
    function eachTool() {
        if(flag) {
            $(".w").each(function(i, ele) {   // i是索引，ele是遍历对象
                // 如果滚动上去的高度大于模块距离文档顶部的距离，说明滚动到了相应模块（减1是为了解决一个小bug）
                if($(document).scrollTop() > $(ele).offset().top - 1) {
                    // 给对应的电梯导航添加current类，并移除兄弟的current类（li里就这一个类，写不写上current都行）
                    $(".slider-bar li").eq(i).addClass("current").siblings().removeClass();
                // 如果footer部分太短，那footer对应的导航永远也不会亮了，所以要再写一个判断↓判断是否滚动到底部
                } else if($(window).scrollTop() + $(window).height() >= $(document).height() - 1) {
                    // 当页面滚到底部时，给footer对应的导航添加current类
                    var footIndex = $(".slider-bar li").length - 1;
                    $(".slider-bar li").eq(footIndex).addClass("current").siblings().removeClass();
                }
            })
        }
    }
    // 先调用两个函数，以防用户刷新页面后不显示
    toggleTool(); 
    eachTool();
    $(window).scroll(function(e) {
        toggleTool();
        eachTool();
    })

    // 用户点击导航，让滚动条滚到相应模块
    $(".slider-bar li").click(function(e) {
        // 点击li页面也会滚动，就会触发页面滚动事件，会执行eachTool()里的背景选择
        // 所以点击li后让flag为false，禁止执行eachTool()里的内容
        flag = false;
        // $(this).index()获取用户当前点击的li的索引，正好对应的就是相应模块索引
        // 得到相应模块索引就可以算出这个模块距离顶部的高度，赋值给current
        var current = $(".w").eq($(this).index()).offset().top;  // $(".w").eq(index) 选择器，选择第几个元素
        $("html").stop().animate({  // 调用动画前先stop()停止其他未完成的动画（解决排队问题）
            scrollTop: current
        }, function() {   // 回调函数，动画执行完后执行
            flag = true;   // 让flag变为true，不然flag永远是false，没办法执行eachTool()里的内容
        })
        // 点击添加current类 并移除兄弟节点的current类
        $(this).addClass("current").siblings().removeClass();
    })
})