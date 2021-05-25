// var that;  这种方式会污染全局，下面的方式更好些
class Tab {
    // 构造函数 只要new了一个对象就会自动调用
    constructor(id) {   // 这里的this指向的是实例对象，所以that=this也是指向的实例对象
        // that = this;
        // 首先获取元素 类里面的共有的属性和方法一定要加this使用
        this.main = document.querySelector(id);
        this.add = this.main.querySelector('.tabadd');
        this.ul = this.main.querySelector('ul');
        this.fsection = this.main.querySelector('.tabscon');
        this.init();
    }
    // 获取所有元素的 放在一个函数里，因为它们的个数是变化的
    updateNode() {
        this.lis = this.main.querySelectorAll('li');
        this.sections = this.main.querySelectorAll('section');
        this.remove = this.main.querySelectorAll(".icon-guanbi");
        this.spans = this.main.querySelectorAll('.fisrstnav li span:first-child');
    }
    // 初始化的方法 绑定事件
    init() {   // this → 实例对象
        this.updateNode();  // 当添加完新的元素时，新的元素没有绑定点击事件，所以每次增加元素都要重新获取一下
        // bind()方法可以改变this指向，但不会立即调用函数（call()和apply()也可以改变this指向，但会立即调用函数）
        // 这里第一个参数是addTab函数的this指向，这里还是指向它自己this.add，因为函数里需要还需要用到this
        // 第二个参数是形参，把this（指向实例对象）当做实参传递进去
        this.add.onclick = this.addTab.bind(this.add, this);   // 给添加按钮绑定点击事件
        // 利用for循环给每个li绑定点击事件
        for(var i = 0; i < this.lis.length; i++) {
            this.lis[i].index = i;  // 给每个li添加一个index属性，用来存储li的索引
            this.lis[i].onclick = this.toggleTab.bind(this.lis[i], this);
            this.remove[i].onclick = this.removeTab.bind(this.remove[i], this);
            this.spans[i].ondblclick = this.editTab;  // ondblclick 双击事件  不加()，因为只有点击的时候才调用，加了()就会页面一加载就调用
            this.sections[i].ondblclick = this.editTab;  // sections编辑事件同上，调用一下就可以了
        }
    }
    // 切换功能
    toggleTab(that) {  // 是按钮调用的，这里的this指的是li
        // 排他思想 去除其他li的liactive类，只给自己添加；通过index给对应的section改变样式
        that.clearClass();
        this.className = 'liactive';
        that.sections[this.index].className = 'conactive';
    }
    clearClass() {   // 是that调用的，所以this指向的是实例对象
        for(var i = 0; i < this.lis.length; i++) {
            this.lis[i].className = '';
            this.sections[i].className = '';
        }
    }
    // 添加功能
    addTab(that) {  // 是添加按钮调用的，所以this是添加按钮
        // 创建li和section
        var random = Math.random();  // 生成一个随机数，来区分新选项卡
        var li = '<li class="liactive"><span>新选项卡</span><span class="iconfont icon-guanbi"></span></li>';
        var section = '<section class="conactive">新选项卡 ' + random + '</section>';
        // 添加进父元素  insertAdjacentHTML可以直接添加进父元素，可以传递字符串 beforeend相当于appendChild添加到最后
        that.clearClass();
        that.ul.insertAdjacentHTML('beforeend', li);
        that.fsection.insertAdjacentHTML('beforeend', section);
        that.init();  // 给新选项卡添加点击事件
    }
    // 删除功能
    removeTab(that, e) {
        e.stopPropagation();  // 阻止冒泡 它父亲也有点击事件，所以会冒泡
        var index = this.parentNode.index;
        that.lis[index].remove();
        that.sections[index].remove();
        that.init();
        // 当用户删除的不是当前选中状态的选项卡时，就不执行下边的代码了，让当前选定状态不变
        if(document.querySelector('.liactive')) return;
        index--;
        // that.lis[index].className = 'liactive';
        // that.sections[index].className = 'conactive';
        // 可以用更简单的方式：手动调用点击事件 &&短路运算符，存在才调用click();
        // that.lis[index] && that.lis[index].click();
        // 优化：删除元素为第一个的话，就给它后一个元素调用click()
        that.lis[index] ? that.lis[index].click() : that.lis[index + 1] && that.lis[index + 1].click();
    }
    // 修改功能
    // 用户双击文字，创建一个文本框，文本框内容是从双击元素获取过来的，用户修改后，再把文本框内容赋给被点击的元素
    editTab() {
        var str = this.innerHTML;  // 先将原来的内容获取过来
        // 双击禁止选定文字
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        // 创建一个文本框
        this.innerHTML = '<input type="text" />';
        // 将原来的内容给文本框
        var input = this.children[0];
        input.value = str;   // 文本框赋值要用value
        input.select();   // 让文本框的内容为选定状态

        // 文本框失去焦点后，把文本框内容赋值给span
        input.onblur = function() {
            this.parentNode.innerHTML = this.value;
        }
        // 按下回车
        input.onkeyup = function(e) {
            if(e.keyCode === 13) {  // 回车的ASCII为13
                // 手动调用失焦事件
                this.blur();
            }
        }
    }
}
new Tab("#tab");