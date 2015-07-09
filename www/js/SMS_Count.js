//实时显示未读消息数
//********************************************************************
var ws;
var wsServerIP = serverIP.substring(0, 11) + ":4141/chat"; 
var SocketCreated = false;
var isUserloggedout = false;

var SMSCount1 = 0; 
var SMSCount2 = 0;
$(document).ready(function(event){
	Present();
	WsPush();
})

window.onunload = function () //断开连接 
{
	SocketCreated = false;
	isUserloggedout = true;
	//ws.close();
	ws.send();
}


window.onbeforeunload = function () //断开连接 
{
	SocketCreated = false;
	isUserloggedout = true;
	//ws.close();
	ws.send("");
}


function WsPush () //建立连接
{
	try
	{
		if ("WebSocket" in window) 
		{
			//alert(1);
			ws = new WebSocket("ws://" + wsServerIP);
		}
		else if("MozWebSocket" in window) 
		{
			alert(2);
			ws = new MozWebSocket("ws://" + wsServerIP);
		}
		else
		{
			alert("当前浏览器不支持WebSocket");
		}
	
		SocketCreated = true;
		isUserloggedout = false;
	} 
	catch (ex) 
	{
		console.log(ex, "ERROR");
		return;
	}
	ws.onopen = WSonOpen;
	ws.onmessage = WSonMessage;
	ws.onclose = WSonClose;
	ws.onerror = WSonError;
}


 function WSonOpen() {
	ws.send("login:" + window.localStorage.getItem("ID"));
 };

 function WSonMessage(event) {
	var DataArry = event.data.split("||");
	if (DataArry[0] == window.localStorage.getItem("DoctorId"))
	{
		Present();			
	}
 };

 function WSonClose() {
 };

 function WSonError() {
	console.log("远程连接中断。", "ERROR");
 };

//显示未读消息数
function Present ()
{
   var TempStr;
   SMSCount2 = GetSMSCountForOne(window.localStorage.getItem("ID"), window.localStorage.getItem("DoctorId"));
  // alert(window.localStorage.getItem("ID") + "   " + window.localStorage.getItem("DoctorId"));
  
   if (SMSCount2 != 0)
   {
	   if (SMSCount1 == 0)
	   {
		   TempStr = '<span id="SMSCount"> （<font color = "red">' + SMSCount2 + '</font>）</span>';
		   $('#Communicate').append(TempStr);
		   SMSCount1 = SMSCount2; 
	   }
	   else
	   {
		   $('#SMSCount').remove();
		   TempStr = '<span id="SMSCount"> （<font color = "red">' + SMSCount2 + '</font>）</span>';
		   $('#Communicate').append(TempStr);
		   SMSCount1 = SMSCount2;
	   }
   }   
   else
   {
	   if(SMSCount1 != 0)
	   {
		   $('#SMSCount').remove();
		   SMSCount1 = SMSCount2;
	   }
   }
}

//获取一对一未读消息数
function GetSMSCountForOne (Reciever, SendBy)
{
	var ret;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSCountForOne',
			async: false,
			data: 
			{
				Reciever: Reciever,
				SendBy: SendBy			
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				ret = $(result).text();
			},
			error: function(msg) {
			  alert("GetSMSCountForOne出错啦！");
			}
		});
	return ret;
}
//***************************************************************************************

