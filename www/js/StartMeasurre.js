	
//传进来的参数
		//var PatientId = "PID201501070012";
		var PatientId = window.localStorage.getItem("PatientId");
		 var TerminalIP = window.localStorage.getItem("TerminalIP");
		 var TerminalName = window.localStorage.getItem("TerminalName");
		 var DeviceType = window.localStorage.getItem("DeviceType");
		 var revUserId  = window.localStorage.getItem("ID");
		var extraInfo;
		//仅该页面用到参数
		var MDate = "";
		var MTime = "";
		var SBP = "";
		var DBP = "";
		var PulseF = "";
		var SetSFlag = 0;
		var SetDFlag = 0;
		var SetPFlag = 0;
		var jump = 0;
		var LastSBP = "";
		
		$(document).ready(function(event){
			$('#SBPget').blur(function (){
				if ($('#SBPget').val() > 200)
				{
					$('#SBPget').val(200);	
				}
				if ($('#SBPget').val() < 60)
				{
					$('#SBPget').val(60);	
				}
			});
			$('#DBPget').blur(function (){
				if ($('#DBPget').val() > 150)
				{
					$('#DBPget').val(150);	
				}
				if ($('#DBPget').val() < 30)
				{
					$('#DBPget').val(30)	
				}
			});
			$('#PulseF').blur(function (){
				if ($('#PulseF').val() > 200)
				{
					$('#PulseF').val(200);	
				}
				if ($('#PulseF').val() < 30)
				{
					$('#PulseF').val(30);	
				}
			});
			
			$.ajax({  
				  type: "POST",
				  dataType: "xml",
				  timeout: 30000,  
				  url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestSbpByPatientId',
				  async:false,
				  data: { PatientId: PatientId},
				  beforeSend: function(){},
				  success: function(result) {
					  var LS = $(result).find("string").text();
					  if (isNaN(LS) == true)
					  {
							LS = "";  
					  }	
					  $('#SBPget').val(LS);	
					  LastSBP = LS;    
				  }, 
				  error: function(msg) {alert("Error: GetLatestSbpByPatientId");}
			});
			
			$.ajax({  
				  type: "POST",
				  dataType: "xml",
				  timeout: 30000,  
				  url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestDbpByPatientId',
				  async:false,
				  data: { PatientId: PatientId},
				  beforeSend: function(){},
				  success: function(result) {
					  var LD = $(result).find("string").text();
					   if (isNaN(LD) == true)
					  {
							LD = "";  
					  }	
					  $('#DBPget').val(LD);		    
				  }, 
				  error: function(msg) {alert("Error: GetLatestDbpByPatientId");}
			});
			
			$.ajax({  
				  type: "POST",
				  dataType: "xml",
				  timeout: 30000,  
				  url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestPulseByPatientId',
				  async:false,
				  data: { PatientId: PatientId},
				  beforeSend: function(){},
				  success: function(result) {
					  var LP = $(result).find("string").text();
					   if (isNaN(LP) == true)
					  {
							LP = "";  
					  }	
					  $('#PulseF').val(LP);		    
				  }, 
				  error: function(msg) {alert("Error: GetLatestPulseByPatientId");}
			});
		});
		
		function Test1()
		{
			SBP = parseInt($('#SBPget').val());
			DBP = parseInt($('#DBPget').val());
			PulseF = parseInt($('#PulseF').val());
			if(DBP > SBP){
				document.getElementById("alert7").innerHTML = "舒张压不可能高于收缩压，请重新填写"
				$("#popdiv7").popup("open");
				return;
			}
			$.ajax({  
				  type: "POST",
				  dataType: "xml",
				  timeout: 30000,  
				  url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',
				  async:false,
				  data: {},
				  beforeSend: function(){},
				  success: function(result) {
					  MDate = $(result).text().slice(0,10).replace(/-/g,"");
					  MTime = $(result).text().slice(11,16).replace(":","");		    
				  }, 
				  error: function(msg) {alert("Error: GetServerTime");}
			  });
			SetPatientVitalSigns(PatientId, MDate, MTime, "Bloodpressure", "Bloodpressure_1", SBP, "mmHg", revUserId, TerminalName, TerminalIP, DeviceType)
			SetPatientVitalSigns(PatientId, MDate, MTime, "Bloodpressure", "Bloodpressure_2", DBP, "mmHg", revUserId, TerminalName, TerminalIP, DeviceType)
			SetPatientVitalSigns(PatientId, MDate, MTime, "Pulserate", "Pulserate_1", PulseF, "次/分", revUserId, TerminalName, TerminalIP, DeviceType)
			if (SetSFlag ==1 & SetDFlag == 1 & SetPFlag ==1)
			{
				$( "#popdiv5" ).popup( "close" ) 
				setTimeout(function () {
					document.getElementById("alert6").innerHTML = "录入成功，是否返回主页面？"

//					$("#returnMain").attr("onclick", function () {
//						extraInfo.disableBT(null,
//						function(r){printResult4(r)},
//						function(e){log(e)}
//					);	
//					});
					$("#popdiv6").popup("open");	
				},100)
				
			}
			
		}
		
		function SetPatientVitalSigns(UserId, RecordDate, RecordTime, ItemType, ItemCode, Value, Unit, revUserId, TerminalName, TerminalIP, DeviceType)
		{
			var options;
			$.ajax({  
				type: "POST",
				dataType: "xml",
				timeout: 30000,  
				url: 'http://'+ serverIP +'/'+serviceName+'/SetPatientVitalSigns',
				async:false,
		        data: {UserId:UserId,
					   RecordDate:RecordDate,
					   RecordTime:RecordTime,
				       ItemType:ItemType,
					   ItemCode:ItemCode,
					   Value:Value,
					   Unit:Unit,
					   revUserId:revUserId,
					   TerminalName:TerminalName,
					   TerminalIP:TerminalIP,
					   DeviceType:DeviceType},//输入变量
				beforeSend: function(){},
		        success: function(result){ 
				    if(ItemCode == "Bloodpressure_1"){
						SetSFlag = 1;
						//alert("收缩压录入成功");
					}
					if(ItemCode == "Bloodpressure_2"){
						SetDFlag = 1;
						//alert("舒张压录入成功");
					}
					if(ItemCode == "Pulserate_1"){
						SetPFlag = 1;
						//alert("脉率录入成功");
					}		    
		        }, 
		        error: function(msg) {alert("Error: SetPatientVitalSigns");}
			});
			return options;	
		}// JavaScript Document
		
		function BACK() {
			//alert("1");
			//window.history.back(-1);
			//$.mobile.changePage("Target.html",{ reloadPage: "true"});
			location.href = "TaskMenu.html";
		}
//蓝牙传输模块


//
//function TestBT1() {
//	$("#popdiv2").popup("open");		
//}
//
//function TestBt() {	
//	$( "#popdiv2" ).on({
//        popupafterclose: function() {
//            setTimeout(function() { $( "#popdiv3" ).popup( "open" ) }, 100 );
//        }
//    });	
//	$("#popdiv2").popup("close");
//}
//
//function TestGetData() {
//	extraInfo.getData(null,
//		function(r){GetDataSuccess(r)},
//		function(e){log(e)}
//	);	
//}

///////////////////////////蓝牙模块

			
			
			document.addEventListener('deviceready', function() {
				var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
				$(document).on("click","#testPL",function(){
					extraInfo.getExtra(function(r) {
						connectSuccess(r);
						 alert("message1");
					}, function() {
						 alert("message2");
					});
				});
			});
			
            document.addEventListener('deviceready', function () {
				var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
				
				$(document).on("click","#TestBT",function(){
					extraInfo.isBTEnabled(null,
					function(r){
						//printResult2(r);
						if (r == "false")
						{
							$("#popdiv1").popup("open");		
						}
						else if (r == "true")
						{
							document.getElementById("alert2").innerHTML = "正在搜索设备";
							$("#popdiv2").popup("open");
							ListDevice();	
						}
					},
					function(e){log(e)}
					);				
				});
				
				$(document).on("click","#popbtn1",function () {
					extraInfo.enableBT(null,
					function(r){
						//printResult3(r);
						$( "#popdiv1" ).on({
							popupafterclose: function() {
								setTimeout(function() { 
								document.getElementById("alert2").innerHTML = "正在搜索设备";
								$("#popdiv2").popup("open");
								ListDevice();
								}, 100 );
							}
						});	
						$("#popdiv1").popup("close");
												
					},
					function(e){log(e)}
					);		
				});
				
				function ListDevice() {
						//alert(1);
						var str = "";
						for (i=0; i<100; i++)
						{
							extraInfo.listBoundDevices(null,
								function(r){
									//alert(r);
									//printResult7(r);
									str = r;
								},
								function(e){log(e)}
							);	
							if (str.split('name').length > 1)
							{
								str = r;
								break;
							}
						}
						setTimeout(function () {
						$("#DeviceList").empty();
								document.getElementById("alert3").innerHTML = "已配对设备";
								var ss = str.split('"');
								var No = str.split('name');
								var DeviceNo = No.length - 1; 
								//alert(r);
								//alert(DeviceNo);
								if (DeviceNo <= 0)
								{
									document.getElementById("alert3").innerHTML = "没有配对好的设备，请先在设置中配对蓝牙设备";
									$("#DeviceList").append('<a id="gotoset" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a">确定</a>');
									$("#gotoset").click(function(){
										location.href= "Settings.html";
									});
								}
								else if (DeviceNo > 0)
								{
									for (i=0; i<DeviceNo; i++)
									{
										var id = "Device" + i;
										var name = ss[3+i*12];
										var add = ss[7+i*12];
										//alert(name);
										
										//$("#DeviceList").append("<p id='"  + add + "' onclick = 'connect()'>" + name + "</p>");
										$("#DeviceList").append("<a id='"  + add + "' class = 'devicelist' data-role = 'button'>" + name + "</a>");	
										
									}
									$(".devicelist").click(function ()
									{
										console.log(this);
										var Add = $(this).attr("id");
																
							
										connect(Add);	 
									 });
									$("#DeviceList").trigger("create");
								}
								$( "#popdiv2" ).on({
										popupafterclose: function() {
											setTimeout(function() { 
											$( "#popdiv3" ).popup( "open" );
											}, 100 );
									}
								});	
								$("#popdiv2").popup("close");
						},1000);
				}
				
				function connect (add) {
						$( "#popdiv3" ).on({
									popupafterclose: function() {
										setTimeout(function() { 
										document.getElementById("alert8").innerHTML = "正在连接中";
										$( "#popdiv8" ).popup( "open" );
										setTimeout(function(){
											var jsonstr = "{address:" + "'" + add+ "'}";  //具体地址可变
											var address = eval('('+jsonstr+')');	
											extraInfo.connect(address,
											function(r){
//												setTimeout(function () {
												//alert(r);
												connectSuccess(r);
//												},15000);
												//alert(1);
												
												
											},
											function(e){
												//alert("correctError");
												$( "#popdiv8" ).on({
													popupafterclose: function() {
														setTimeout(function() { 	
														document.getElementById("alert4").innerHTML = "连接失败，请检查设备是否正常工作";									
														$( "#popdiv4" ).popup( "open" ) 
														}, 100 );
													}
												});	
												$("#popdiv8").popup("close");
											}
											); 
											
										},3000);
										}, 100);
									}
								});	
 						$("#popdiv3").popup("close");
						
				}
							
				
				
				$(document).on("click","#TestBT2",function (){
					location.href = "TaskMenu.html";
				});
				
					function connectSuccess(resultado){
			
			//var htmlText="<ul><li>connect: "+resultado+"</li></ul>";
//			   document.getElementById("result").innerHTML=htmlText;
			   // var temp = $("<p>"+ resultado +"</p>");
//				
//				   var results = temp.text().trim();
//				   alert(results);
			  // while(resultado != "")
////			   if ( resultado == "true")
//			   {
//			   		
//			   }
			   GetData();
			 //  else
//			   {
//					$( "#popdiv8" ).on({
//						popupafterclose: function() {
//							setTimeout(function() { 										
//							$( "#popdiv4" ).popup( "open" ) 
//							}, 100 );
//						}
//					});	
//					$("#popdiv8").popup("close");   
//			   }
			}
			
				function GetData() {
					
					document.getElementById("alert8").innerHTML = "正在测量，请稍后";
					console.log("entergetdata");
					//alert(2);
					setTimeout(function () {
//					for (i=0; i<100; i++)
//					{
						extraInfo.getData(null,
								function(r){
									//alert("enter");
									
									GetDataSuccess(r);
									
									
								},
								function(e){
									//alert("error");
									log(e);
									$( "#popdiv8" ).on({
										popupafterclose: function() {
											setTimeout(function() { 										
											$( "#popdiv4" ).popup( "open" ) 
											}, 100 );
										}
									});	
									$("#popdiv8").popup("close");
								}
							)	
							
//					}
					},100);
				};
				
				$(document).on("click","#backtoMain",function(){
					//alert("1");
					location.href = "TaskMenu.html";
				});
				//var testBT = cordova.require('cn.edu.zjubme319.cordova.BT');
					//------------------------------------------------------ listDevices example ------------------------------------------------------
				$(document).on("click","#list-devices",function(){
					extraInfo.listDevices(null,
					function(r){printResult(r)},
					function(e){log(e)}
					);
				});
					
					//------------------------------------------------------ isBTEnabled example ------------------------------------------------------
				$(document).on("click","#isBTEnabled",function(){
					//window.plugins.bluetooth.isBTEnabled(null,
					extraInfo.isBTEnabled(null,
					function(r){printResult2(r)},
					function(e){log(e)}
					);			
				});
				
				//------------------------------------------------------ enableBT example ------------------------------------------------------
				$(document).on("click","#enableBT",function(){
					//window.plugins.bluetooth.enableBT(null,
					//alert("BluetoothPlugin.testBT");
					extraInfo.enableBT(null,
					function(r){printResult3(r)},
					function(e){log(e)}
					);		
				});
				
					//------------------------------------------------------ disableBT example ------------------------------------------------------
				$(document).on("click","#disableBT",function(){
					extraInfo.disableBT(null,
					function(r){printResult4(r)},
					function(e){log(e)}
					);	
				});
              
			  
//------------------------------------------------------ pairBT example ------------------------------------------------------
 $(document).on("click","#pairBT",function(){
					extraInfo.pairBT("6C:9B:02:44:FA:BF",
					function(r){printResult5(r)},
					function(e){log(e)}
					);
				});
              
			  //------------------------------------------------------ listBoundDevices example ------------------------------------------------------
				$(document).on("click","#listBoundDevices",function(){
					extraInfo.listBoundDevices(null,
					function(r){alert(r);printResult7(r)},
					function(e){log(e)}
					);
				});
              
			  //------------------------------------------------------ stopDiscovering example ------------------------------------------------------
				$(document).on("click","#stopDiscovering",function(){
					extraInfo.stopDiscovering(null,
					function(r){printResult8(r)},
					function(e){log(e)}
					);
				});
				
				//------------------------------------------------------ isBound example ------------------------------------------------------
				$(document).on("click","#isBound",function(){
									extraInfo.isBound("8C:DE:52:99:26:23",
				function(r){printResult9(r)},
				function(e){log(e)}
				);
								});
				
				
				
				//															connect
				$(document).on("click","#connect",function(){
									//var address = {"address":"8C:DE:52:99:26:23"};
					var jsonstr = "{address:'8C:DE:52:99:26:23'}";  //具体地址可变
					var address = eval('('+jsonstr+')');
									extraInfo.connect(address,
					function(r){connectSuccess(r)},
					function(e){alert("correctError");}
					);

								});
				 
				//															getData
				$(document).on("click","#getData",function(){
									extraInfo.getData(null,
				function(r){GetDataSuccess(r)},
				function(e){log(e)}
				);
				
				
				})
 
 
            }, false);
			
			

			function GetDataSuccess(resultado){
			 //alert(resultado);
				//var htmlText="<ul><li>GetData: "+resultado+"</li></ul>";
//				   document.getElementById("result").innerHTML=htmlText;
				   var temp = $("<p>"+ resultado +"</p>");
					
				   var results = temp.text().trim().split("|");
				   var SBP = results[17];
				   var DBP = results[18];
				   var PulseF = results[20];
				   
				   //var AgainFlag = 0;
				   if ( isNaN(SBP) == false && isNaN(DBP) == false && isNaN(PulseF) == false)
				   {
					   $('#SBPget').val(SBP);
					   $('#DBPget').val(DBP);
					   $('#PulseF').val(PulseF);
					   document.getElementById("alertS").innerHTML = "您的收缩压：" + $('#SBPget').val();
					   document.getElementById("alertD").innerHTML = "您的舒张压：" + $('#DBPget').val();
					   document.getElementById("alertP").innerHTML = "您的脉率：" + $('#PulseF').val();
					   if (SBP < 160)
					   {
						   if (LastSBP != "" )
						   {
							 var WarningFlag = SBP/LastSBP;
							 if (WarningFlag < 1)
							 {
								document.getElementById("alertW").innerHTML = "您的血压比上次低了，做得很好，请继续保持!"; 
							 }
							 else if (WarningFlag >= 1 && WarningFlag <= 1.03)
							 {
								document.getElementById("alertW").innerHTML = "您的血压比较稳定，请在保持的同时，努力把血压降下去!";
							 }
							 else if (WarningFlag > 1.03 && WarningFlag <= 1.1)
							 {
								document.getElementById("alertW").innerHTML = "您的血压比上次高了不少！请注意个人饮食及生活方式！";
							 }
							 else if (WarningFlag > 1.1)
							 {
								document.getElementById("alertW").innerHTML = "您的血压比上次高了很多！请确认是否需要联系您的医生！";
								//var AgainFlag = 1;
							 }
						   }
					   }
					   else
					   {
						   document.getElementById("alertW").innerHTML = "您的血压已超出了正常范围！请重新测量！如果多次测量仍超出正常范围，请尽快联系您的医生！";
					   }
					}
					else
					{
						document.getElementById("alertW").innerHTML = "数据获取错误，请重新测量！";
					}
					 //resetBT();
					 $( "#popdiv8" ).on({
						popupafterclose: function() {
							setTimeout(function() { 
							  Test1();							
							  $( "#popdiv5" ).popup( "open" ) 
							//resetBT();
							}, 100 );
						}
					});	
					$("#popdiv8").popup("close");
				  //return null;
				  
				  
 					//alert(SBP);
				   //alert(DBP);
				   //alert(pulse);
			};
			
		function resetBT() {
			var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
			extraInfo.disableBT(null,
			function(r){
					//alert("r");
					if (r == "true")
					{
					setTimeout(function() {
						extraInfo.enableBT(null,
						function(r){
							//alert("r");
							//printResult3(r);
						},
						function(e){log(e)}
						);		
					},300);
					}
			},
			function(e){log(e)}
			);		
		};

			function printResult(resultadoString){
				var htmlText ="";
				var i=0;
				
				var resultado = eval(resultadoString);
				
				for(i=0;i<resultado.length;i++)
				{
					htmlText=htmlText+"<ul><li>Name Device: "+resultado[i].name+"</li></ul>";
					htmlText=htmlText+"<ul><li>Address Device: "+resultado[i].address+"</li></ul>";
				}
				document.getElementById("result").innerHTML=htmlText;
			}



function printResult2(resultado){

var htmlText="<ul><li>is Bluetooth Enabled?: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}



function printResult3(resultado){

var htmlText="<ul><li>Bluetooth Enabled?: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}




function printResult4(resultado){

var htmlText="<ul><li>Bluetooth Disabled?: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}



function printResult5(resultado){

var htmlText="<ul><li>Pairing with Bluetooth Device: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}



function printResult6(resultado){

var htmlText="<ul><li>unPairing Bluetooth Device: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}



function printResult7(resultadoString){
var htmlText ="";
var i=0;

var resultado = eval(resultadoString);

for(i=0;i<resultado.length;i++)
{
htmlText=htmlText+"<ul><li>Name Device: "+resultado[i].name+"</li></ul>";
htmlText=htmlText+"<ul><li>Address Device: "+resultado[i].address+"</li></ul>";
}
   document.getElementById("result").innerHTML=htmlText;
}



function printResult8(resultado){

var htmlText="<ul><li>Stopping Discovering Bluetooth Devices: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}



function printResult9(resultado){

var htmlText="<ul><li>is Device bound with mobile address 6C:9B:02:44:FA:BF?: "+resultado+"</li></ul>";
   document.getElementById("result").innerHTML=htmlText;
}