$(function() {
    //规划场景   设置
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 5);
            //设置背景，属性id，添加奥场景
            $("<div>").addClass("block").attr('id', i + '-' + j).css("backgroundColor", "rgba(0," + g + "," + b + ",0.7)").appendTo(".changjing");
        }
    }
    //初始化snake的初始状态；
    var snake = [
        { x: 5, y: 3 },
        { x: 5, y: 4 }, 
        { x: 5, y: 5 }
    ];
    if(snake.length-3===1){
        console.log(1)
    }
    //判断自己能不能撞到自己身上的字典
    var dict={
        '5-3':true,
        '5-4':true,
        '5-5':true
    }

    //设置食物的盒子；
    function foodbox() {
        do {
            var a = Math.floor(Math.random() * 20);
            var b = Math.floor(Math.random() * 20);
        }while(dict[a+"-"+b]){
            $('#' + a + '-' + b).addClass("food");
            return { x: a, y: b };
        }
    }
    var food=foodbox();

    var zhaoDian = function(dian){
        return $("#"+dian.x+"-"+dian.y)
    }

    for (var i = 0; i < snake.length; i++) {
        zhaoDian(snake[i]).addClass("snake");
    }
    zhaoDian(food).addClass("food");

    //方向改变时蛇头的方向
    var direction = "right";
    function move(){
        var oldhead = snake[snake.length - 1];

        if (direction == "right") {
            var newhead = { x: oldhead.x, y: oldhead.y + 1 };
        }else if (direction == 'bottom') {
            var newhead = { x: oldhead.x + 1, y: oldhead.y };
        }else if (direction == "left") {
            var newhead = { x: oldhead.x, y: oldhead.y - 1 };
        }else if (direction == 'top') {
            var newhead = { x: oldhead.x - 1, y: oldhead.y };
        }
        //判断到了边界时游戏结束；
        if (newhead.x > 19 || newhead.x < 0 || newhead.y > 19 || newhead.y < 0) {
            $('.gameEnd').css({opacity:1})
                .animate({
                    height:220,
                    width:600
                })
            zanting();
            return;
        }
        //判断撞到自己身上时游戏结束；
        if(dict[newhead.x+'-'+newhead.y]){
            $(".knockSelf").css({transform:"translateY(0)"});
            zanting();
            return;
        }
        snake.push(newhead);
        zhaoDian(newhead).addClass('snake');
        dict[newhead.x+"-"+newhead.y]=true;

        //表的作用是判断是否能够反方向移动；
        var biao={
            'right':39,
            'left':37,
            'top':38,
            'bottom':40
        }

        //键盘控制
        $(document).on("keyup", function(e) {
            e.preventDefault();
            if(Math.abs(e.keyCode-biao[direction])===2){
                return;
            }
            if (e.keyCode == 37) {
                direction = "left";
            }
            if (e.keyCode == 38) {
                direction = "top";
            }
            if (e.keyCode == 39) {
                direction = "right";
            }
            if (e.keyCode == 40) {
                direction = "bottom";
            }
        })
        

        //吃食物的功能；
        if(newhead.x===food.x && newhead.y===food.y){
            zhaoDian(food).removeClass("food");
            food=foodbox();
            $(".deFen").text(snake.length-3);
        }else{
            var tail=snake.shift();
            zhaoDian(tail).removeClass("snake");
            delete dict[tail.x+"-"+tail.y]
        }
    }


    var time;
    function kaishi(){
        clearInterval(time);
        time =setInterval(move,300);
    }
    function zanting(){
        clearInterval(time);
    }

    //游戏开始键
    $(".operate  .start").on("click", function() {
        $(".gamestart").css('display', 'none');
        $(this).css({background:"rgba(0,100,100,0.8)"});
        $(".operate  .stop, .operate  .refresh").css("background",'darkgreen');
        kaishi();
    })

    //游戏暂停键
    $(".operate  .stop").on('click',function() {
        $(this).css({background:"rgba(0,100,100,0.8)"});
        $(".operate  .start, .operate  .refresh").css("background",'darkgreen');
        zanting();
    })

    //刷新键
    $(".operate  .refresh").on("click",function(){
        $(this).css({background:"rgba(0,100,100,0.8)"});
        $(".operate  .stop, .operate  .start").css("background",'darkgreen');
    })

    //游戏说明书
    $(".right .gameIntroduce").on("mouseover",function(){
        $(".right .jieShaoShu").css({transform:"translateX(0)"})
    }).on("mouseout",function(){
        $(".right .jieShaoShu").css({transform:"translateX(-100%)"});
    })

   //快键键的设置
    $(document).on("keyup",function(e){
        e.preventDefault();
        if(e.keyCode==32){
            zanting();
        }
    })
})

/*
1.蛇头经过的div旁边的div动画
2.投放食物的地方的动画
3.背景部分的动画
4.暂停/开始按钮（空格快捷键）游戏重新开始按钮
5.画面精致
*/