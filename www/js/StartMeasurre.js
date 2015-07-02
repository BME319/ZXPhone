//传进来的参数
		//var PatientId = "PID201501070012";
		var PatientId = window.localStorage.getItem("PatientId");
		 var TerminalIP = window.localStorage.getItem("TerminalIP");
		 var TerminalName = window.localStorage.getItem("TerminalName");
		 var DeviceType = window.localStorage.getItem("DeviceType");
		 var revUserId  = window.localStorage.getItem("ID");
		
		//仅该页面用到参数
		var MDate = "";
		var MTime = "";
		var SBP = "";
		var DBP = "";
		var PulseF = "";
		var jump = 0;
		
//		$(document).ready(function(event){
//			$.spin.imageBasePath = './img/spin/';
//			$('#SBPget').spin({
//				max: 200,
//				min: 50,
//				timeInterval: 125
//			});
//			$('#DBPget').spin({
//				max: 150,
//				min: 30,
//				timeInterval: 125
//			});
//			$('#PulseF').spin({
//				max: 150,
//				min: 30,
//				timeInterval: 125
//			});
//		});
		
		function Test1()
		{
			SBP = parseInt($('#SBPget').val());
			DBP = parseInt($('#DBPget').val());
			PulseF = parseInt($('#PulseF').val());
			if(DBP > SBP){
				alert("舒张压不可能高于收缩压，请重新填写");
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
						alert("收缩压录入成功");
					}
					if(ItemCode == "Bloodpressure_2"){
						alert("舒张压录入成功");
					}
					if(ItemCode == "Pulserate_1"){
						alert("脉率录入成功");
					}		    
		        }, 
		        error: function(msg) {alert("Error: SetPatientVitalSigns");}
			});
			return options;	
		}// JavaScript Document