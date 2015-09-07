 function setnewmpush(){
          
      //    var now = new Date().getTime(),
     //              _5_sec_from_now = new Date(now + 5 * 1000);
     var randomID=parseInt(Math.random()*1000+1);
    var mvalue={
        "id":randomID,
        "title":"",
        "text":"",
        "hour":"",
        "minute":"",
      //  "period":""
    };
  mvalue.hour=$("#hour").text();
  mvalue.minute=$("#minute").text();

    var sound =device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
     
    x=$("form").serializeArray();
     
    $.each(x, function(i, field){
      $("#results").append(field.name + ":" + field.value + " ");
      switch(field.name)
      {
          case "title" :mvalue.title=field.value;break;
          case "text" :mvalue.text=field.value;break;
 
      }

    });
       
        var datetime = new Date().getTime();
        var now = new Date(datetime);
        var m_at = new Date(datetime);
        m_at.setHours(mvalue.hour);
        m_at.setMinutes(mvalue.minute);
        m_at.setSeconds(0);
        if(m_at < now){
            m_at = new Date(m_at.getTime() + 1000*60*60*24);
        }
     //    alert(mat.toTimeString());
     if(mvalue.title!="")
     {
         
        cordova.plugins.notification.local.schedule({
            id: mvalue.id,
            title: mvalue.title,
            text: mvalue.text,
            at: m_at,
            every:'day',
            sound: sound,
        });
 //   }
        //alert(mvalue.title);
        var storage = window.localStorage;
        if (!storage.getItem("allmpush"))
        {
            var jsonarr=[];
            jsonarr[0]=mvalue;
            storage.setItem("allmpush",JSON.stringify(jsonarr));
         /*   $("#showmpush").append(
                    '<li data-role="collapsible" id='+jsonarr[0].id+'>'+
                        '<h1>名称：&#60'+jsonarr[0].title+'&#62时间：<'+jsonarr[0].hour+':'+jsonarr[0].minute+'></h1>'+
                        '<ul data-role="listview">'+
                            '<li style="line-height:24px;word-break:break-all;">'+
                                '<a href="#"><p style="white-space: normal;">待办内容：'+jsonarr[0].text+'</p></a>'+
                                '<a href="#"  data-icon="delete" onclick=deletempush('+jsonarr[0].id+')>删除</a>'+
                            '</li>'+
                        '</ul>'+
                    '</li>'
            );*/
           
        }else{
             jsonarr = JSON.parse(storage.getItem("allmpush"));
             jsonarr[jsonarr.length]=mvalue;
             storage.allmpush=JSON.stringify(jsonarr);
          /*   $("#showmpush").append(
                    '<li data-role="collapsible" id='+jsonarr[jsonarr.length-1].id+'>'+
                        '<h1>名称：&#60'+jsonarr[jsonarr.length-1].title+'&#62时间：<'+jsonarr[jsonarr.length-1].hour+':'+jsonarr[jsonarr.length-1].minute+'></h1>'+
                        '<ul data-role="listview">'+
                            '<li style="line-height:24px;word-break:break-all;">'+
                                '<a href="#"><p style="white-space: normal;">待办内容：'+jsonarr[jsonarr.length-1].text+'</p></a>'+
                                '<a href="#"  data-icon="delete" onclick=deletempush('+jsonarr[jsonarr.length-1].id+')>删除</a>'+
                            '</li>'+
                        '</ul>'+
                    '</li>'
             );*/
          
        }
        $("#showmpush").trigger('create');
        $("#pback").click();
     }else{
         showToast("事件名称不能为空");
     }
  };
//"<li data-role='collapsible'><h1>"+jsonarr[jsonarr.length-1].title+"</h1><ul data-role='listview'><li><p>"+jsonarr[jsonarr.length-1].text+"</p></li><li>ssss</li></ul></li>"
function test(){
    $("#showmpush").append(
        '<li data-role="collapsible" id='+456+'>'+
        "<h1>ssssss</h1><h1>aaaaaa</h1>"+
            '<ul data-role="listview">'+
                '<li>'+
                    '<a href="#"><h3>待办内容：'+"jsonarr[jsonarr.length-1].text"+'</h3></a>'+
                    '<a href="#"  data-icon="delete" onclick=test2()>删除</a>'+
                '</li>'+
            '</ul>'+
        '</li>'
        );
    $("#showmpush").trigger('create');
}
function test2(){
      var rm="#"+456;
  $(rm).remove();
  $("#showmpush").trigger('create');
}

function getstorage(){
   // alert("getstorage");
   // swipeud();//开启上下滑动事件监听（时间选择）
    var storage = window.localStorage;
    jsonarr = JSON.parse(storage.getItem("allmpush"));
    for(var i=0;i<jsonarr.length;i++)
    {
        if(!$('#'+jsonarr[i].id).text())
        {
        $("#showmpush").append(
                    '<li data-role="collapsible" id='+jsonarr[i].id+'>'+
                        '<h1>名称：&#60'+jsonarr[i].title+'&#62时间：<'+jsonarr[i].hour+':'+jsonarr[i].minute+'></h1>'+
                        '<ul data-role="listview">'+
                            '<li style="line-height:24px;word-break:break-all;">'+
                                '<a href="#"><p style="white-space: normal;">待办内容：'+jsonarr[i].text+'</p></a>'+
                                '<a href="#"  data-icon="delete" onclick=deletempush('+jsonarr[i].id+')>删除</a>'+
                            '</li>'+
                        '</ul>'+
                    '</li>'
             );
        }
    }
    $("#showmpush").trigger('create');
//    alert(details.length);
}

function deletempush(Id){  
    cordova.plugins.notification.local.cancel(Id);
    var storage = window.localStorage;
    jsonarr = JSON.parse(storage.getItem("allmpush"));
 //   alert(jsonarr.length+":"+Id+":"+jsonarr[0].id);
    for(var i=0;i<jsonarr.length;i++)
    {
        if(Id==jsonarr[i].id)
        {
            var rm="#"+jsonarr[i].id;            
            $(rm).remove();
            $("#showmpush").trigger('create');
           // alert(jsonarr[i].id);
            jsonarr.splice(i,1);
            storage.allmpush=JSON.stringify(jsonarr);
        }
    }
    
}

function time_pick(Id)
{
    switch(Id)
    {
        case "h_up":
            var hour_u=parseInt($("#hour").text())+1;
            if(hour_u>23)hour_u=0;
            if(hour_u<10)hour_u="0"+hour_u;
            //alert(hour_u);
            hour.innerHTML=hour_u;
            break;
        case "h_down":
            var hour_d=parseInt($("#hour").text())-1;
            if(hour_d<0)hour_d=23;
            if(hour_d<10)hour_d="0"+hour_d;
            hour.innerHTML=hour_d;
            break;
        case "m_up":
            var minute_u=parseInt($("#minute").text())+1;
            if(minute_u>59)minute_u=0;
            if(minute_u<10)minute_u="0"+minute_u;
            minute.innerHTML=minute_u;
            break;
        case "m_down":
            var minute_d=parseInt($("#minute").text())-1;
            if(minute_d<0)minute_d=59;
            if(minute_d<10)minute_d="0"+minute_d;
            minute.innerHTML=minute_d;
            break;
        case "load":
        var timeNow=new Date();
        var hourNow=timeNow.getHours();
        var minute_Now=timeNow.getMinutes();
        if(minute_Now>=30){minute_Now="00";hourNow=(hourNow+1)==24?"00":(hourNow+1)<10?"0"+(hourNow+1):(hourNow+1);}else{minute_Now=30;}
        hour.innerHTML=hourNow;
        minute.innerHTML=minute_Now;
        break;
    }
}
function swipeud()
{
    //alert("1");
    $("#sethour").touchwipe({
            min_move_x: 40, //横向灵敏度
            min_move_y: 20, //纵向灵敏度
            wipeUp: function() {time_pick("h_up");}, //向上滑动事件
            wipeDown: function() {time_pick("h_down");}, //向下滑动事件
            preventDefaultEvents: true //阻止默认事件
    });
    $("#setminute").touchwipe({
            min_move_x: 40, //横向灵敏度
            min_move_y: 20, //纵向灵敏度
            wipeUp: function() {time_pick("m_up");}, //向上滑动事件
            wipeDown: function() {time_pick("m_down");}, //向下滑动事件
            preventDefaultEvents: true //阻止默认事件
    });
}
