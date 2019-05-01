// 点击开始游戏--->动态生成100个小格--->100个div
// leftClick --->如果没有雷--->显示数字 或则扩散（点到的数字为0）,有雷就游戏结束
// rightClick --->有数字无效果,有标记取消标记,没有且没有数字标记就进行标记 ---->十个都标记正确就提示成功
var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var startGame = true;//游戏判断,防止每次点击开始游戏有进行startBtn.onclick里的操作,会生成很多次100个小格
var minesNum;//雷数量
var minesOver;//被覆盖的雷数量
var block;
var mineMap = [];//定义一个数组，记录100格子，0表示无雷，1表示有雷 
bindEvent();
// 事件绑定
function bindEvent() {
    startBtn.onclick = function() {
        if(startGame){
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGame = false;
        }
    }
    box.oncontextmenu = function() {
        return false;//由于有右键点击,故而把右键默认菜单取消
    }
    // box是每个小格子的父级,将鼠标按下事件绑定到box上再利用事件原对象可以确定是哪一个小格子,用mousedown是因为它可以监听鼠标的左右键。
    box.onmousedown = function(e) {
        var event = e.target;
        if(e.which == 1){//如果是左键这执行左键发生的事
            leftClick(event);
        } else if(e.which == 3){//如果是右键这执行右键发生的事
            rightClick(event);
        }
    }
    closeBtn.onclick = function() {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';//在点击叉后原来box里的100div清空,下一次点击开始的时候有重新插入
        startGame = true;//点击叉后设置为true这样再点击开始游戏才会进入游戏
    }
}
// 点击鼠标左键发生的事
function leftClick(dom) {
    // 如果小方格被标记了点击左键就没有效果
    if(dom.classList.contains('flag')){
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if(dom && dom.classList.contains('isLei')){
        // 如果点击到的小方格中有雷时,首先让所有的雷显示出来,然后延迟800毫秒弹出游戏结束框
        for(var i = 0;i < isLei.length;i ++){
            isLei[i].classList.add('show');//show中的属性是有地雷的图片
        }
        setTimeout(function(){
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url(./img/over.jpg)';
        },800);
    } else{
        // 点击时如果不是雷就显示数字
        var n = 0;//n表示点击出来的数字,开始的时候为0,通过下面的遍历周围8个格子判断有多少个雷，再对其进行赋值
        // 下面是一种融错处理dom存在才会取后面的值。
        var possArr = dom && dom.getAttribute('id').split('-');//由于dom的id创建时是由两次循环的坐标加-组成的字符串，则这里的possArr是一个包含横纵坐标的数组
        var possX = possArr && +possArr[0];//+隐式转换为数字类型
        var possY = possArr && +possArr[1];
        dom && dom.classList.add('num');
        // 遍历周围8个数字,来判断自己周围有多少雷(class为isLei就为雷),从而也判断自己是什么数字
        for(var i = possX- 1;i <= possX + 1;i ++){
            for(var j = possY - 1;j <= possY + 1;j ++){
                    var aroundBox = document.getElementById(i+'-'+j);
                    if(aroundBox && aroundBox.classList.contains('isLei')){
                        n ++;
                    }
            }
        }
        dom && (dom.innerHTML = n);
        // 扩散
        if(n == 0){
            for(var i = possX -1;i <= possX + 1; i ++){
                for(var j = possY - 1;j <= possY + 1;j ++){
                    var nearBox = document.getElementById(i + '-' + j);
                    if (nearBox && nearBox.length != 0) {
                        // 扩散是遇到0的时候有可能遇到很多时候都是0，那么就有重合，所以为了避免浪费时间就加一个判断
                        if (!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox);
                        }
                    }            
                }
            }
        }
    }
}
// 点击鼠标右键发生的事
function rightClick(dom) {
    // 如果右键点击的是数字则什么也不做就返回
    if(dom.classList.contains('num')){
        return;
    }
    dom.classList.toggle('flag');//加上一个属性引入红旗,toggle没有这个属性就加上,有的话就删除
    //如果插旗插对了对应的剩余雷数就减一并插入分数中 
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
        minesOver --;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        minesOver ++;
    }
    score.innerHTML = minesOver;
    if(minesOver == 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url(./img/success.png)';
    }
}
// 生成一百个小格,并且插入到box里,同时生成十个随机雷
function init(){
    minesNum = 10;//生成雷的数量是10
    minesOver = 10;//开始时覆盖的是10
    score.innerHTML = minesOver;
    // 通过双重循环生成100个格子
    for(var i = 0;i < 10;i ++){
        for (var j = 0; j < 10; j++) {
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id',i+'-'+j);//添加id属性记录坐标
            box.appendChild(con);
            mineMap.push({mine:0});//每次push一个对象,对象里有一个属性mine，mine为0表示无雷,1表示有雷。开始时都是0.
        }
    }
    // 随机生成10雷
    block = document.getElementsByClassName('block');//取出刚刚成立的100小格,现在是一个数组
    while(minesNum){
        var mineIndex = Math.floor(Math.random()*100);//生成雷是雷的下标,由于有100个小格,故而要生成0-100之间的随机数
        // 判断一下的，目的是为了防止雷在生成过程中随机数生成相同，为避免引入mineMap数组，来判别
        if(mineMap[mineIndex].mine === 0){
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add('isLei');
            minesNum --;//生成一个雷，雷数量减少一个
        }
    }
} 

