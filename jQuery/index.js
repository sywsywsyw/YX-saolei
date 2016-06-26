//禁用右键
$(function  () {
  $(document).on('contextmenu',false);
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
  var digui=function  (x,y) {
    var mine=finding(x,y);
    if(mine===0){
      for(var i = x - 1;i <= x + 1;i++){
        for(var j = y - 1;j <= y + 1;j ++) {
          //越界
          if(i>9||i<0||j<0||j>9){
            continue;
          }
          //自己
          if(i == x && j == y){
            continue;
          }
          //已遍历
          if($('#'+xy2Id(i,j)).hasClass('paichu')){
            continue;
          }

          mine=finding(i,j);
          $('#'+xy2Id(i,j)).addClass('paichu').text(mine);
          if(mine===0){
            $('#'+xy2Id(i,j)).text('')
          }

          digui(i,j);
        }
      }
    }
  }
  //左击3种状态
  var leftclick=function  (e) {
    if($(this).is('.biaoji')){
      return;
    }else if(e.data.lei){
      alert('死')
    }else{
      var mine=finding(e.data.x,e.data.y);
      $(this).addClass('paichu').text(mine);
      if(mine===0){
        $(this).text('')
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
    if($('.lei').length===$('.biaoji').length){
      if($('.lei.biaoji').length===$('.lei').length){
        alert('yes')
      }
    }
  }
  //mousedown函数
  var clickHandler=function  (e) {
    if(e.which===1){
      $.proxy(leftclick,this)(e);
    }else if(e.which===3){
      $.proxy(rightclick,this)(e);
    }
  }
  //画盒子，在其中随机插入雷
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
})
