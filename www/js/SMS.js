//rongyun 20150615
//消息推送		
	/*window.onload = function () {	  
		
        RongIMClient.init(AppKey);

        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                window.console.log(status.getValue(), status.getMessage(), new Date())
            }
        });
		
        RongIMClient.getInstance().setOnReceiveMessageListener({
            onReceived: function (data) {				
				if (data.getContent() != "")
				{
					var Arry = data.getContent().split("||");
					var SMSFlag = GetSMSFlag(Arry[0]);					
					if (SMSFlag == 3)
					{
						CreateSMS("Receive",Arry[4], Arry[1]);
						ChangeReadStatus(Arry[0]);
						document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
						ChangePushStatus(Arry[0]);					
					}
				}
            }
        });
        
        var UserId = ThisUserId;  //当前用户
		var Token = GetToken(UserId);
		GetToken(TheOtherId); //同时为接收方申请Token
        RongIMClient.connect(Token, {
            onSuccess: function (x) {
                //alert("connected，userid＝" + x)
                UserId = x;
            },
            onError: function (x) {
                window.console.log(x.getMessage())
            }
        });

        ins = RongIMClient.getInstance();
        
		var TargetId = TheOtherId; //收信人Id!!!!!!!!!!!!!!!
        document.getElementById('SMSbtn').onclick = function () {
			submitSMS();
			
            var Type = RongIMClient.ConversationType.setValue(4); //默认私聊
			var NewArry = GetLatestSMS(TheOtherId, ThisUserId);
			var ContentStr = NewArry[0] + "||" + NewArry[1] + "||" + NewArry[2] + "||" + NewArry[3] + "||" + NewArry[4] + "||" + ThisUserId;
            ins.sendMessage(Type, TargetId, RongIMClient.TextMessage.obtain(ContentStr || Date.now()), null, {
                onSuccess: function () {
                    //confirm("send successfully");
                }, onError: function () {
                    //confirm("send fail") 2015-6-4 废弃即时消息
                }
            });
        }
    };*/
	
var ThisUserId = window.localStorage.getItem("ID");
var TheOtherId = window.localStorage.getItem("DoctorId");
var piUserId = window.localStorage.getItem("ID");
var piTerminalName = "Y-PHONE";
var piTerminalIP = window.localStorage.getItem("TerminalIP");
var Device = window.localStorage.getItem("Device");
var piDeviceType = (Device == "Phone")?1:0;

var DocHeight = $(document).height();

var ClickFlag = true;
//var AppKey = "sfci50a7chxxi";
var InitialHt = $("#SMSContent").height(); //初始高度
var InitialTop = $("#OutField").position().top; //初始位置
var MaxHt = 0; //输入框最大高度



var ws; //websocket
var wsServerIP = serverIP.substring(0, 11) + ":4141/chat"; 
var SocketCreated = false;
var isUserloggedout = false;


$(document).ready(function(event){
  $("#DoctorName").html(window.localStorage.getItem("DoctorName"));
  $("#DoctorPhoto").attr("src", window.localStorage.getItem("DoctorPhoto"));
  GetSMSDialogue(ThisUserId, TheOtherId);
  document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
  
  var SMSBtn = document.getElementById('SMSbtn');	
  SMSBtn.addEventListener("mouseover", ChangeFlagToF, false);
  SMSBtn.addEventListener("mouseout", ChangeFlagToT, false);
  SMSBtn.addEventListener("click", submitSMS, false); //rongyun 20150615
  
  document.getElementById('SMSContent').style.height = "47px"; //设定文本域初始高度
  $('#GenaralField').height(DocHeight-160); //设定文档高度
  WsPush();
  SetSMSRead(ThisUserId, TheOtherId); //将消息变为已读
})

//**************************************************************************************

//获取服务器IP
function getLocalmachineIPAddress()
{
	var Ip = "";
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/getLocalmachineIPAddress',
		async: false,
		beforeSend: function() {
		},
		success: function(result) {     	  	  
			Ip = $(result).text();		  
		},
		error: function(msg) {
			alert("getLocalmachineIPAddress出错啦！");
		}
	});
	return Ip;	  
}


//消息推送
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


//window.onload = function() //建立连接
function WsPush ()
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
	ws.send("login:" + ThisUserId);   
 };

 function WSonMessage(event) {
	var DataArry = event.data.split("||");
	if (DataArry[0] == TheOtherId)
	{
		CreateSMS("Receive", DataArry[1], DataArry[2]);
		document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
		SetSMSRead(ThisUserId, TheOtherId);//改写阅读状态
	}
	//消息通知
	//$.sticky('<p style="line-height:150%;">您有一条新的消息</br>主题</br>发件人</br>' + event.data + '</p>' );
 };

 function WSonClose() {
 };

 function WSonError() {
	console.log("远程连接中断。", "ERROR");
 };
 
 //**************************************************************************************

//autogrow初始化
$("#SMSContent").textinput({
	autogrow: true
});

//固定文本框下边框与添加滚动条
$("#SMSContent").resize(function(){
	var PresentTop = $("#OutField").position().top; //获取当前位置
	var PresentHt = $("#SMSContent").height(); //获取当前始高度
	var t = document.getElementById('SMSContent'); 
	var h = t.scrollHeight; 
	if (PresentHt < 170)
	{
		$( "#SMSContent" ).textinput( "option", "autogrow", true );
		if (PresentHt != InitialHt)
		{
			var temp = PresentHt - InitialHt;
			InitialHt = PresentHt; //改变比较值
			$("#OutField").css("top", PresentTop - temp);
		}
	}
	else
	{
		if (MaxHt == 0)
		{
			MaxHt = PresentHt;
		}
		$( "#SMSContent" ).textinput( "option", "autogrow", false );
		h = h > MaxHt ? MaxHt : h;
			
		if (PresentHt != InitialHt)
		{
			var temp = PresentHt - InitialHt;
			InitialHt = PresentHt; //改变比较值
			$("#OutField").css("top", PresentTop - temp);
		}
	}
});
	
//退格到最大高度内后恢复autogrow
document.onkeydown = function (event) 
{				
	var e = event || window.event || arguments.callee.caller.arguments[0]; 
	var t = document.getElementById('SMSContent'); 
		
	if(e && e.keyCode == 8)
	{ 
		var a = document.getElementById('SMSContent').scrollTop;
		if ((a == 0) && ($("#SMSContent").height() <= MaxHt))
		{
			$( "#SMSContent" ).textinput( "option", "autogrow", true );
		}
	}
}
	


//获取短信对话
function GetSMSDialogue(Reciever, SendBy)
{
	var Day1 = ""; //上一次天日期
	var Day2 = "";//本次日期
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSDialogue',
	async: false,
	data: 
	{
		Reciever: Reciever,
		SendBy: SendBy
	},
	beforeSend: function() {
	},
	success: function(result) {     
	  $(result).find('Table1').each(function() {	  
		  var Time = $(this).find("SendDateTime").text();
		  var Day2 = Time.substring(1, 11);
		  if (Day2 != Day1)
		  {
			  var Temp = Time.substring(1, 17);
		  }
		  else
		  {
			  var Temp = Time.substring(12, 17);
		  }	    		  
		  Day1 = Time.substring(1, 11);
		  var Type = $(this).find("IDFlag").text();
		  var Content = $(this).find("Content").text();
		  CreateSMS(Type, Temp, Content);
	  })
	},
	error: function(msg) {
	  alert("GetSMSDialogue出错啦！");
	}
  });
}

//将短信按格式输出
function CreateSMS(Type, Time, Content)
{
	
	var ReiceiveStr = '<table width="100%"><tr><td colspan="2" align="center">' + Time + '</td></tr><tr><td><div class="ForReceive"><div class="ReceiveTri"></div>' + Content + '</div></td><td width="20px"></td></tr></table>';

	var SendStr = '<table width="100%"><tr><td colspan="2" align="center">' + Time + '</td></tr><tr><td width="20px"></td><td><div class="ForSend"><div class="SendTri"></div>' + Content + '</div></td></tr></table>';

	if (Type == "Send")
	{
		$('#MainField').append(SendStr);
	}
	else
	{
		$('#MainField').append(ReiceiveStr);
	}
}




//发送短信
function submitSMS()
{
	var Content = $("#SMSContent").val();
	if ((Content != "")&&(Content != null))//短信内容不能为空
	{
		$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/SetSMS',
			async: false,
			data: 
			{
				SendBy: ThisUserId,
				Reciever: TheOtherId,		
				Content: Content,
				piUserId: piUserId,
				piTerminalName: piTerminalName,
				piTerminalIP: piTerminalIP,
				piDeviceType: piDeviceType
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				var flag = $(result).find("boolean").text();
				if (flag == "true")
				{		
					CreateSMS("Send", GetLatestSMS(TheOtherId, ThisUserId)[4], Content);
					document.getElementById('SMSContent').value = "";
					//$('#SMSContent').attr("rows", "1");
					document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
					ws.send(ThisUserId + "||" + GetLatestSMS(TheOtherId, ThisUserId)[4] + "||" + Content + "||" + GetLatestSMS(TheOtherId, ThisUserId)[2]);
				}
				else
				{
					alert("发送失败！");
				}
			},
			error: function(msg) {
			  alert("出错啦！");
			}
		});
	}
	document.getElementById('SMSContent').style.height = "47px"; //设定文本域初始高度
	$('#MainField').attr("class", "NormalField");
}

//输入时文本框上移以留出软键盘空间
$(document).ready(function(event){	
	var ContentTxt = document.getElementById('SMSContent');
	ContentTxt.addEventListener("focus", InTxt, false);
	ContentTxt.addEventListener("blur", OutOfTxt, false);
})

function InTxt() //开始输入
{
	$('#MainField').attr("class", "ShortField");
	document.getElementById('MainField').scrollTop = document.getElementById('MainField').scrollHeight;
}

function OutOfTxt() //输入完成
{
	if (ClickFlag)
	{
		$('#MainField').attr("class", "NormalField");
	}
}

function ChangeFlagToF() //鼠标移上发送按钮
{
	ClickFlag = false;
}

function ChangeFlagToT() //鼠标离开发送按钮
{
	ClickFlag = true;
}

//获取Token
function GetToken (UserId)
{
	var Token;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/GetToken',
			async: false,
			data: 
			{
				UserId: UserId,
				UserName: "",
				piUserId: piUserId,
				piTerminalName: piTerminalName, 
				piTerminalIP: piTerminalIP, 
				piDeviceType: piDeviceType
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				Token = $(result).text();
			},
			error: function(msg) {
			  alert("GetToken出错啦！");
			}
		});
	return Token;
}

//获取最近发送的一条消息
function GetLatestSMS(DoctorId, PatientId)
{
	var SMSArry = new Array();
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestSMS',
		async: false,
		data: 
		{
			DoctorId: DoctorId,
			PatientId: PatientId
		},
		beforeSend: function() {
	   },
		success: function(result) {  	  
			var MessageNo = $(result).find("MessageNo").text();	
			var Content = $(result).find("Message").find("Content").text();	
			var SendDateTime = $(result).find("Message").find("SendDateTime").text();	
			var SendByName = $(result).find("Message").find("SendByName").text();	
			var Flag = $(result).find("Message").find("Flag").text(); 
			var Time;
			if(Flag == "1")
			{
				Time = SendDateTime.substring(1, 17);
			}
			else
			{
				Time = SendDateTime.substring(12, 17);
			}	
			SMSArry[0] = MessageNo;
			SMSArry[1] = Content;
			SMSArry[2] = SendDateTime;
			SMSArry[3] = SendByName;
			SMSArry[4] = Time;
		},
		error: function(msg) {
		  alert("GetLatestSMS出错啦！");
		}
	});
	return  SMSArry;
}

//获取推送标志
function GetSMSFlag (MessageNo)
{
	var SMSFlag;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/GetSMSFlag',
			async: false,
			data: 
			{
				MessageNo: MessageNo
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				SMSFlag = $(result).text();
			},
			error: function(msg) {
			  alert("GetSMSFlag出错啦！");
			}
		});
	return SMSFlag;
}

//改写推送状态
function ChangePushStatus (MessageNo)
{
	var ret;
	$.ajax({
			type: "POST",
			dataType: "xml",
			timeout: 30000,
			url: 'http://'+ serverIP +'/'+serviceName+'/ChangePushStatus',
			async: false,
			data: 
			{
				MessageNo: MessageNo,
				piUserId: piUserId,
				piTerminalName: piTerminalName,
				piTerminalIP: piTerminalIP,
				piDeviceType: piDeviceType
			},
			beforeSend: function() {
			},
			success: function(result) {          	  
				ret = $(result).text();
			},
			error: function(msg) {
			  alert("ChangePushStatus出错啦！");
			}
		});
	return ret;
}

//改写阅读状态（一条）
function ChangeReadStatus(MessageNo)
{
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/ChangeReadStatus',
	async: false,
	data: 
	{
		MessageNo: MessageNo,
		revUserId: piUserId,
		pTerminalName: piTerminalName,
		pTerminalIP: piTerminalIP,
		pDeviceType: piDeviceType
	},
	beforeSend: function() {
	},
	success: function(result) {
		//var flag = $(result).find("boolean").text();  
	},
	error: function(msg) {
	  alert("ChangeReadStatus出错啦！");
	}
  });
}

  function BacktoLogOn(){
	window.localStorage.clear();
	window.location.href='LogOn-Phone.html';
}

//SetSMSRead 改写阅读状态（多条）
function SetSMSRead (Reciever, SendBy)
{
	$.ajax({
	type: "POST",
	dataType: "xml",
	timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetSMSRead',
	async: false,
	data: 
	{
		Reciever: Reciever,
		SendBy: SendBy,
		piUserId: piUserId,
		piTerminalName: piTerminalName,
		piTerminalIP: piTerminalIP,
		piDeviceType: piDeviceType
	},
	beforeSend: function() {
	},
	success: function(result) {
		//var flag = $(result).find("boolean").text();  
	},
	error: function(msg) {
	  alert("SetSMSRead出错啦！");
	}
  });
}