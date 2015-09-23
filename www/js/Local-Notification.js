 function setnewmpush(){
          
      //    var now = new Date().getTime(),
     //              _5_sec_from_now = new Date(now + 5 * 1000);
    var sound =device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
    var title_='';
    var text_='';
    x=$("form").serializeArray();
    $.each(x, function(i, field){
     // $("#results").append(field.name + ":" + field.value + " ");
      switch(field.name)
      {
          case "title" :title_=field.value;break;
          case "text" :text_=field.value;break;
 
      }
    });
     var c=document.getElementsByName('chooseday');
                var str=new Array();
                var day=new Array();
                var Id=new Array();
                var count=0;
                var every='';
                day[0]=1;day[1]=2;day[2]=3;day[3]=4;
                day[4]=5;day[5]=6;day[6]=0;
                for(var i=0;i<c.length;i++)
                {
                    if(c[i].checked)
                    {
                        str[count++] =day[i];
                        //alert(str[count-1]);
                    }
                }
                //alert(str.length);
                if(count==0)//一次
                {
                    count=1;
                    str[0]=new Date().getDay();
                    every='';
                }else if(count==7)//每天
                {
                    count=1;
                    str[0]=new Date().getDay();
                    every='day';
                }else//每周的某一天
                {
                    every='week';
                }
                // alert(str.length);
                var M_at=new Array(count);
                var mvalue={
                        "title":title_,
                        "text":text_,
                        "hour":$("#hour").text(),
                        "minute":$("#minute").text(),
                        "period":str,
                        "every":every,
                        "m_at":M_at,
                        "id":''
                    };
                for(var i=0;i<str.length;i++)
                {
                    var datetime = new Date().getTime();
                    var m_at = new Date(datetime);
                    var now = new Date(datetime);
                    m_at.setHours(mvalue.hour);
                    m_at.setMinutes(mvalue.minute);
                    m_at.setSeconds(0);
                    if(str[i] > m_at.getDay())
                    {
                        m_at.setDate(m_at.getDate()+str[i] - m_at.getDay());
                    }
                    else if(str[i] < m_at.getDay())
                    {
                        m_at.setDate(m_at.getDate()+str[i]- m_at.getDay()+7);
                    }else
                    {
                        if(m_at<now)
                        {
                            if(every=='day') m_at.setDate(m_at.getDate()+1);
                            if(every=='week') m_at.setDate(m_at.getDate()+7);
                        }
                    }
                    M_at[i]=m_at;
                    Id[i]=parseInt(Math.random()*1000+1);
                }
                mvalue.m_at=M_at;
                mvalue.id=Id;
                mvalue.period=str;
       
     //    alert(mat.toTimeString());
        ////////////////////
        //var tes=mvalue.period;
       // alert(mvalue.id[0]);
        //alert(mvalue.title+'-'+mvalue.text+'-'+mvalue.m_at.getDay()+'-'+mvalue.m_at.getHours()+'-'+mvalue.preiod[0]);
        /////////////////////////
        if(mvalue.title.length != 0 && mvalue.title.length < 20)
        {
            // alert(mvalue.title.length);
            
            for(var i=0;i<str.length;i++)
            { 
                cordova.plugins.notification.local.schedule({
                    id: Id[i],
                    title: mvalue.title,
                    text: mvalue.text,
                    at: M_at[i],
                    every:mvalue.every,
                    sound: sound,
                });
            }
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
            //alert('test');
            $("#showmpush").trigger('create');
            GetPlanDeadline(_PlanNo);
            $("#pback").click();
        }else{
            alert("事件名称不能为空且长度在20个字符内");
            $('#title').focus();
        }
  };
//"<li data-role='collapsible'><h1>"+jsonarr[jsonarr.length-1].title+"</h1><ul data-role='listview'><li><p>"+jsonarr[jsonarr.length-1].text+"</p></li><li>ssss</li></ul></li>"
function test(){
    $("#showmpush").append(
        '<li data-role="collapsible" id='+456+'>'+
        "<h1>ssssss</h1><h1>aaaaaa</h1>"+
            '<ul data-role="listview">'+
                '<li>'+
                    '<a href="#" onclick=""><h3>待办内容：'+"jsonarr[jsonarr.length-1].text"+'</h3></a>'+
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
    var jsonarr = JSON.parse(storage.getItem("allmpush"));
    for(var i=0;i<jsonarr.length;i++)
    {
        if(!$('#'+jsonarr[i].id[0]).text())
        {
            var str=jsonarr[i].title;
            if(str.length>4)
            {
                
                jsonarr[i].title=str.slice(0,4)+'...';
            }
            var day=new Array()
             day[1]='周一';day[2]='周二';day[3]='周三';day[4]='周四';
            day[5]='周五';day[6]='周六';day[0]='周日';
            var cycle='周期:';
            //alert(jsonarr[i].period.length);
            //alert(jsonarr[i].period[0]);
            if(jsonarr[i].every=='day')cycle +='每天';
            if(jsonarr[i].every=='')cycle +='一次';
            if(jsonarr[i].every=='week')
            {
                for(var f=0;f<jsonarr[i].period.length;f++)
                {
                    cycle=cycle+day[jsonarr[i].period[f]]+' ';
                }
            }
            //alert('---');
            $("#showmpush").append(
                        '<li data-role="collapsible" id='+jsonarr[i].id[0]+'>'+
                            '<h1>名称：&#60 '+jsonarr[i].title+' &#62 时间：< '+jsonarr[i].hour+':'+jsonarr[i].minute+' ></h1>'+
                            '<ul data-role="listview">'+
                            
                                '<li style="line-height:24px;word-break:break-all;">'+
                                    '<a href="#" onclick="updateclick('+jsonarr[i].id[0]+')"><p style="white-space: normal;">'+cycle+'<br><br>待办内容：'+jsonarr[i].text+'</p></a>'+
                                    '<a href="#"  data-icon="delete" onclick=deletempush('+jsonarr[i].id[0]+')>删除</a>'+
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
    
    var storage = window.localStorage;
    var jsonarr = JSON.parse(storage.getItem("allmpush"));
 //   alert(jsonarr.length+":"+Id+":"+jsonarr[0].id);
    for(var i=0;i<jsonarr.length;i++)
    {
        if(Id==jsonarr[i].id[0])
        {   
            //alert('dele');
            //alert(jsonarr[i].id.length);
            for(var f=0;f<jsonarr[i].id.length;f++)
            {
                cordova.plugins.notification.local.cancel(jsonarr[i].id[f]);
            }
            //alert('deleOK');
            var rm="#"+jsonarr[i].id[0];            
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
function updateclick(Id)
{
    var storage=window.localStorage;
    var jsonarr = JSON.parse(storage.getItem("allmpush"));
    var mvalue='';
    for(var i=0;i<jsonarr.length;i++)
    {
        if(Id==jsonarr[i].id[0])
        {
            mvalue=jsonarr[i];
        }
    }
    storage.setItem('updateflage','true');
    storage.setItem('updateId',mvalue.id[0]);
    $("#title").val(mvalue.title);
    $("#addnew").click();
}
function updatem()
{
    var storage=window.localStorage;
    var updateflage=storage.getItem('updateflage');
    var Id=storage.getItem('updateId');
    if(updateflage)
    {
        deletempush(Id);
        setnewmpush();
    }else
    {
        setnewmpush();
    }
}