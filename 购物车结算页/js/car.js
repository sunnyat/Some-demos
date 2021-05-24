$(function() {
    $(".checkall").change(function() {
        // 当全选按钮改变时，让小复选框按钮和全选按钮保持一致（隐式迭代，不需要循环遍历）
        $(".j-checkbox, .checkall").prop("checked", $(this).prop("checked"));
        getSum();   // 计算总额函数
        // 添加背景
        // 判断是否是选中状态，是的话添加check-cart-item类，没有就移除
        if($(this).prop("checked")) {
            $(".cart-item").addClass("check-cart-item");
        } else {
            $(".cart-item").removeClass("check-cart-item");
        }
    })
    $(".j-checkbox").change(function() {
        if($(".j-checkbox:checked").length === $(".j-checkbox").length) {
            $(".checkall").prop("checked", true);
        } else {
            $(".checkall").prop("checked", false);
        }
        getSum();
        // 当小复选框为选中状态时，改变背景颜色（添加check-cart-item类）
        if($(this).prop("checked")) {
            $(this).parents(".cart-item").addClass("check-cart-item");
        } else {
            $(this).parents(".cart-item").removeClass("check-cart-item");
        }
    })

    // 点击+按钮，文本框数字加一
    $(".increment").click(function() {
        var n = $(this).siblings(".itxt").val();
        n++;
        $(this).siblings(".itxt").val(n);
        // 小计模块
        // num为获取过来的单价，用substr()截取字符串把前边的￥去掉
        var num = $(this).parents(".p-num").siblings(".p-price").html().substr(1);
        // toFixed(2)保留两位小数
        var price = (num * n).toFixed(2);
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + price);
        getSum();
    })
    // 点击-按钮，文本框数字减一
    $(".decrement").click(function() {
        var n = $(this).siblings(".itxt").val();
        n <= 1 ? n : n--;
        $(this).siblings(".itxt").val(n);
        // 小计模块
        var num = $(this).parents(".p-num").siblings(".p-price").html().substr(1);
        // toFixed(2)保留两位小数
        var price = (num * n).toFixed(2);
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + price);
        getSum();
    })
    // 当用户直接修改文本框时
    $(".itxt").change(function() {
        var n = $(this).val();
        var num = $(this).parents(".p-num").siblings(".p-price").html().substr(1);
        // toFixed(2)保留两位小数
        var price = (num * n).toFixed(2);
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + price);
        getSum();
    })

    // 计算总额函数
    getSum();
    function getSum() {
        var count = 0;
        var money = 0;
        // 只遍历选中的商品   each遍历，i为索引，ele为对象
        $(".j-checkbox:checked").parents(".cart-item").find(".itxt").each(function(i, ele) {
            count += parseInt($(ele).val());   // 会有小误差，要取整一下
        })
        $(".amount-sum em").text(count);
        $(".j-checkbox:checked").parents(".cart-item").find(".p-sum").each(function(i, ele) {
            money += parseFloat($(ele).text().substr(1));
        })
        $(".price-sum em").text("￥" + money.toFixed(2));
    }

    // 删除商品模块
    // 删除单个商品
    $(".p-action a").click(function() {
        $(this).parents(".cart-item").remove();
        getSum();
    })
    // 删除选中商品
    $(".remove-batch").click(function() {
        $(".j-checkbox:checked").parents(".cart-item").remove();
        getSum();
    })
    // 清理购物车
    $(".clear-all").click(function() {
        $(".cart-item").remove();
        getSum();
    })
})

