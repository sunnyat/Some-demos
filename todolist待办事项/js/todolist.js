$(function() {
    load();   // 第一步先渲染页面，不然一开始刷新页面时列表不显示
    // 1、给文本框绑定键盘按下事件
    $("#title").on("keydown", function(event) {
        if(event.keyCode === 13) {
            if($(this).val().trim() !== "") {  // trim()去除字符串两侧空格
                var data = getDate();       // 获取本地存储数据
                // 把数组进行更新数据，把最新数据追加给数组
                data.push({title: $(this).val(), done: false});
                saveDate(data);      // 保存到本地存储
                load();              // 渲染加载到页面
                $(this).val("");
            }
        }
    })
    //2、删除待办事项
    $("ol, ul").on("click", "a", function() {
        var data = getDate();    // 获取本地数据（data是局部变量，不用担心冲突）
        var index = $(this).attr("index");   // 用attr获取自定义属性index，得到索引
        // splice(index, num)删除数组对象  index为开始删除的位置，num为删除几个
        data.splice(index, 1);
        saveDate(data);
        load();
    })
    //3、正在进行和已完成
    $("ol, ul").on("click", "input", function() {
        var data = getDate();
        // 利用a获取用户点击的第几个复选框
        var index = $(this).siblings("a").attr("index");
        // 修改数据：data[索引].属性名  获取固有属性用prop
        data[index].done = $(this).prop("checked");
        saveDate(data);
        load();
    })
    // 4、修改事项
    $("ol, ul").on("dblclick", "p", function() {
        var data = getDate();
        var index = $(this).siblings("a").attr("index");
        // 先将p原来的内容获取过来
        var str = $(this).text();
        // 创建一个文本框，直接添加到p里
        $(this).prepend('<input type="text" />');
        // 将原来内容给文本框，并让其为选中(select)状态
        var input = $(this).children();
        input.val(str);
        input.select();
        // 当文本框失去焦点，将修改过的文本框的内容给title
        $(input).on("blur", function() {
            data[index].title = input.val();
            saveDate(data);
            load();
        })
        // 按下回车也可以保存修改
        $(input).on("keyup", function(e) {
            if(e.keyCode === 13) {   // 回车ASCII值为13
                // 手动调用点击事件
                this.blur();
            }
        })
    })
    // 获取本地存储数据
    function getDate() {
        var data = localStorage.getItem("todolist");   // 将获取到的数据赋给data
        if(data !== null) {     // 如果本地有数据，则返回数据
            return JSON.parse(data);  // 本地存储只能存储字符串，所以要获取里边的数据就必须将字符串转换为数组形式返回
        } else { 
            return [];   // 如果本地没有数据，则返回一个空数组
        }
    }
    // 保存本地存储数据
    function saveDate(data) {
        // 用JSON.stringify()将数组转化成字符串保存到本地存储
        localStorage.setItem("todolist", JSON.stringify(data));
    }
    // 渲染加载数据
    function load() {
        var data = getDate();    // 先获取本地存储数据

        // 遍历本地存储数据 将他们添加到列表中
        $("ol, ul").empty();   // 遍历之前先清空列表
        var doneCount = 0;  // 已经完成的个数
        var todoCount = 0;  // 正在进行的个数
        $.each(data, function(i, ele) {    // i为索引 ele为遍历对象
            // 如果复选框被选中（已完成done: true）添加到ul里，未被选中（未完成done: false）添加到ol里
            if(ele.done) {
                $("ul").prepend("<li><input type='checkbox' checked='checked' > <p>" + ele.title + "</p> <a href='javascript:;' index=" + i + "></a></li>");
                doneCount++;  // 每添加一个li，已完成数加一
            } else {
                $("ol").prepend("<li><input type='checkbox'> <p>" + ele.title + "</p> <a href='javascript:;' index=" + i + "></a></li>");
                todoCount++;
            }
        })
        $("#donecount").text(doneCount);
        $("#todocount").text(todoCount);
    }
})