//禁用右键
$(function  () {
  $(document).on('contextmenu',false);
  var leishu,qishu;
  var xy2Id=function  (a,b) {
    return  a+'-'+b;
  }
  //左击显示数字
  var finding=function  (x,y) {
    var num=0;
    for(var i=x-1;i<=x+1;i++){
      for(var j=y-1;j<=y+1;j++){
        if($('#'+xy2Id(i,j)).is('.lei')){
          num+=1;
        }
      }
    }
    return num;
  }
  var jiance={};
  var digui=function  (x,y) {
    var mine=finding(x,y);
    if(mine===0){
      for(var i = x - 1;i <= x + 1;i++){
        for(var j = y - 1;j <= y + 1;j ++) {
          //越界
          if(i>7||i<0||j<0||j>13){
            continue;
          }
          //自己
          if(i == x && j == y){
            continue;
          }
          //已遍历
          if(jiance[xy2Id(i,j)]){
            continue;
          }
          jiance[xy2Id(i,j)]=true;
          mine=finding(i,j);
          if(mine===0){
            $('#'+xy2Id(i,j)).addClass('paichu')
          }else{
            $('#'+xy2Id(i,j)).addClass('paichu number'+mine)
          }
          digui(i,j);
        }
      }
    }
  }
  //gameover函数
  var gameover=function () {
    $('.lei')
    .addClass('islei')
    .delay(400)
    .queue(function () {
      $(this)
      .parents('.saolei')
      .css({width:0,height:0})
      .children().css('display','none')
    })
    $('.gameover')
    .stop(true,true)
    .append('<img src="./image/gameover.gif" width="764px" height="572px">')
    .delay(1000)
    .queue(function () {
      $(this).empty()
      $('.restart')
      .css('display','block')
      .animate({bottom:0},1000)
      .dequeue()
    })
  }
  //success函数
  var success=function () {
    $('.success')
    .stop(true,true)
    .css('display','block')
    .animate({width:581,height:283},400)
    .children()
    .delay(400)
    .css('display','block')
    .animate({opacity:1},1000)
  }
  //左击3种状态
  var leftclick=function  (e) {
    if($(this).is('.biaoji')){
      return;
    }else if(e.data.lei){
       $.proxy(gameover,this)(e);
    }else{
      var mine=finding(e.data.x,e.data.y);
      if(mine===0){
        $('#'+xy2Id(e.data.x,e.data.y)).addClass('paichu')
      }else{
        $('#'+xy2Id(e.data.x,e.data.y)).addClass('paichu number'+mine)
      }
      digui(e.data.x,e.data.y)
    }
  }
  //右击3种状态
  var rightclick=function  (e) {
    if($(this).is('.paichu')){
      return
    }
    $(this).toggleClass('biaoji');
    //统计旗数
    qishu=$('.biaoji').length;
    $('.qishu span').text(qishu);
    if($('.lei').length===$('.biaoji').length){
      if($('.lei.biaoji').length===$('.lei').length){
          success();
      }
    }
  }
  //mousedown函数
  var clickHandler=function  (e) {
    if(e.which===1){
      //左击
      $.proxy(leftclick,this)(e);
    }else if(e.which===3){
      //右击
      $.proxy(rightclick,this)(e);
    }
  }
  //画盒子，在其中随机插入雷
  var render=function () {
    for(var i = 0; i < 7; i++){
      for(var j = 0; j < 13; j++){
        var isLei=Math.random()>0.88;
        $('<div>')
        .attr('id',i+'-'+j)
        .addClass(function  () {
          return 'block '+(isLei?'lei':'');
        })
        .on('mousedown',{x:i,y:j,lei:isLei},clickHandler)
        .appendTo('.box')
      }
    }
    //统计雷数
    leishu=$('.lei').length;
    qishu=0;
    $('.leishu span').text(leishu);
    $('.qishu span').text(qishu);
  }
  //box显示动画函数
  var boxshow=function () {
    $('.saolei')
    .stop(true,true)
    .children('.box').empty().end()
    .animate({width:895,height:600},400)
    .queue(function () {
      render();
      $(this).children().css('display','block').dequeue()
    })
  }
  //开始重新按钮耟点击动画
  var button=function () {
    var el=$(this).hasClass('startClick')?'startClicking':'restartclicking'
         $(this)
         .queue(function () {
            $(this).addClass(el).dequeue()
         })
         .delay(100)
         .queue(function () {
           $(this).removeClass(el).dequeue()
         })
         .delay(200)
         .queue(function () {
           $(this).parent().css('display','none').dequeue()
         })
  }
  //点击开始游戏动画
  $('.startClick').on('click',function () {
    $.proxy(button,this)();
    boxshow();
  })
  //重新开始
  $('.restartclick').on('click',function () {
    jiance={};
    $.proxy(button,this)();
    $('.restart').css('bottom',-1000)
    boxshow();
  })
  //再来一局
  $('.successclick').on('click',function () {
      $('.saolei').css({width:0,height:0})
      $(this)
      .css({display:'none',opacity:0})
      .parent().css({display:'none',width:0,height:0});
      boxshow();

  })
})
