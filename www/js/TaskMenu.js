	var PatientURL;
	var DoctorURL;
	//var ImageAddressIP = "http://10.13.22.66:8088"; 
	var ImageAddressIP = "http://121.43.107.106:8088"; 


	function GetPatientName(PID){
		$.ajax({
			type: "POST",
        	dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/GetBasicInfo',
			async:false,
			data:{
				UserId:PID
			},
			success: function(result){
				var m = $(result).find('UserName').text();
				window.localStorage.setItem("PatientName",m);
			},
			error: function(msg) {alert("GetPatientName Error!");}
		});
	}
	
	function GetPatientPhoto(PID){
		$.ajax({
			type: "POST",
        	dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/GetDetailInfo',
			async:false,
			data:{
				UserId:PID
			},
			success: function(result){
				var m = $(result).find('PhotoAddress').text();
				var testStr = /.jpg/
				if(!testStr.test(m)) {
					m = PatientURL + "non.jpg";
				}
				else m = PatientURL + m;
				window.localStorage.setItem("PatientPhoto",m);
			},
			error: function(msg) {alert("GetPatientPhoto Error!");}
		});
	}
	
	function GetDoctorPhoto(DoctorID){
		$.ajax({
			type: "POST",
        	dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/GetDoctorDetailInfo',
			async:false,
			data:{
				Doctor:DoctorID
			},
			success: function(result){
				var m = $(result).find('PhotoAddress').text();
				var testStr = /.jpg/
				if(!testStr.test(m)) m = DoctorURL+"non.jpg";
				else m = DoctorURL+m;
				window.localStorage.setItem("DoctorPhoto",m);
			},
			error: function(msg) {alert("GetDoctorPhoto Error!");}
		});
	}
	
	
	function UpdateStatus(){
		//_Date = 20150415; //实际使用请去掉该句
		SetComplianceDetail(1);
		if (_Id == 1)
		{
			setTimeout(function() {
				_Id = 2;
				SetComplianceDetail(1);
			}, 100);
		}
	}
	
	function SetComplianceDetail(status){
		$.ajax({
			type: "POST",
        		dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/SetComlianceDetail',
			async:false,
			data:{
				PatientId:_PatientId,
				DateByNow:_Date,
				PlanNo:_PlanNo,
				Id:_Id,
				Status:status,
				revUserId:_UserId,
				TerminalName:_TerminalName,
				TerminalIP:_TerminalIP,
				DeviceType:_DeviceType
			},
			success: function(result){
				if($(result).text() == 1){
					RefreshTaskList(2);
				}
			},
			error: function(msg) {alert("SetComplianceDetail Error!");}
		});
	}
	
	//获取当前日期信息
	function GetDateTimebyNow(){
		$.ajax({
			type: "POST",
        	dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/GetDateTimebyNow',
			async:false,
			data:{},
			success: function(result){
				var date = $(result).text().substr(0,10);
				_Date = date.substr(0,4)+date.substr(5,2)+date.substr(8,2);
				var w_num = $(result).text().substr(11,1);
				switch(w_num){
					case "1":
						date += " 星期一";
						break;
					case "2":
						date += " 星期二";
						break;
					case "3":
						date += " 星期三";
						break;
					case "4":
						date += " 星期四";
						break;
					case "5":
						date += " 星期五";
						break;
					case "6":
						date += " 星期六";
						break;
					case "7":
						date += " 星期日";
						break;
				}
				//alert(date);
				$("#DateTimebyNow").text(date);
			},
			error: function(msg) {alert("GetDateTimebyNow Error!");}
		});
	}
	
	//刷新任务列表
	function RefreshTaskList(status){
		$("#TaskList").empty();
		var initial_str = '<li><a onclick="javascript:location.href='+"'HealthEducation.html'"+ '" style="background-color:#94D5FA">' + '<img src="img/HealthEducation.png">' + '<h2>健康教育</h2>' + '<p>点击观看教学视频</p></a>' + '<a href="#" data-rel="popup" data-position-to="window" data-transition="pop" class="ui-btn ui-btn-icon-notext ui-icon-edit ui-btn-a" style="background-color:#FFFFFF"></a>' + '</li>';
		if (status != 1) $("#TaskList").append(initial_str);
		GetTaskListbyStatus(status);
	}
	
	//根据状态获取任务列表
	function GetTaskListbyStatus(status){
		var TaskType;
		var TaskName;
		var TaskCode;
		var TaskStatus;
		var TaskId;	
		var Instruction;
		$.ajax({
			type: "POST",
        	dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/GetTaskByStatus',
			async:false,
			data:{
				PatientId:_PatientId,
				PlanNo:_PlanNo,
				PiStatus:status
			},
			success: function(result){
				$(result).find('Table1').each( function (){
					TaskType = $(this).children("TaskType").text();
					TaskName = $(this).children("TaskName").text();
					TaskCode = $(this).children("TaskCode").text();
					TaskStatus = $(this).children("Status").text();
					TaskId = $(this).children("Id").text();
					Instruction = $(this).children("Instruction").text();
					
					if (TaskName != "舒张压")
					{
						if (TaskName == "收缩压")
						{
							TaskName = "血压";
						}	
					
//					var TypeName;
					var ColorName_1;
					var ColorName_2;
					var HrefName = "#";
					var DoneFlag;
					var IconStyle;
//					switch(TaskType){
//						case "VitalSigns":
//							TypeName = '体征测量';
//							break;
//						case "LifeStyle":
//							TypeName = '生活方式';
//							break;
//						case "Drug":
//							TypeName = '服用药剂';
//							break;
//					}
					if(TaskType == "VitalSign"){
						HrefName = "javascript: window.location.href='StartMeasure.html'";
						if(TaskStatus == 0){
							Instruction = "请点击，并录入自测的体征参数";
						}
						else {
							Instruction = "参数已录入，点击可再次录入";
						}
					}
					switch(TaskStatus){
						case "0":
							ColorName_1 = '#94D5FA'; //浅蓝
							ColorName_2 = '#FFFFFF';
							DoneFlag = '#TaskDone';
							IconStyle = 'ui-icon-edit';
							break;
						case "1":
							ColorName_1 = '#FAF0F3';
							ColorName_2 = '#A9A9A9 '; //浅灰
							DoneFlag = '#';
							IconStyle = 'ui-icon-check';
							break;
					}
					var task_str = '<li  id="tasklist"><a href="' + HrefName + '" style="background-color:' + ColorName_1 + '"><img src="' + 'img/' + TaskType + '.png' + '"><h2>'+ TaskName+ '</h2><p>' + Instruction.replace(/，/,"&nbsp") + '</p></a>' + '<a href="' + DoneFlag + '" data-rel="popup" ' + 'style="background-color:' + ColorName_2 + '" class="ui-btn ui-btn-icon-notext ' + IconStyle + ' ui-btn-a"' + ' data-position-to="window" data-transition="pop"' + ' onclick="GetId(this)"' + ' id="' + TaskId  + '">' +'</a></li>';
					$("#TaskList").append(task_str);
					}
				})
				$("#TaskList").listview("refresh");
				
			},
			error: function(msg) {alert("GetTaskListbyStatus Error!");}
		});
	}
	
	function GetId(a){
		//alert(a.id);
		_Id = "0";
		_Id = a.id;
	}
	
	function GetPlanInfo(PID){
		$.ajax({
			type: "POST",
        	dataType: "xml",
			timeout: 30000,  
			url: 'http://'+ serverIP +'/'+serviceName+'/GetPlanInfobyPID',
			async:false,
			data:{
				PatientId:PID
			},
			success: function(result){
				var m = new Array(3);
				m = $(result).text().split("|");
				window.localStorage.setItem("PlanNo",m[0]);
				window.localStorage.setItem("DoctorId",m[1]);
				GetDoctorPhoto(m[1]);
				window.localStorage.setItem("DoctorName",m[2]);
			},
			error: function(msg) {alert("GetPlanInfo Error!");}
		});
	}
	function GetPlanDeadline(PlanNo){
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetPlanInfo',
		async:false,
		data:{
			PlanNo:PlanNo
		},
		success: function(result){
			var m = $(result).text();
			var n={
				"PlanNo":m.slice(0,18),
				"StartDate":m.slice(21,29),
				"EndDate":m.slice(32,40)
			}
			//alert('1');
			//window.localStorage.setItem("PlanDeadline",JSON.stringify(n));
			//var r = JSON.parse(window.localStorage.getItem("PlanDeadline"));
			//alert(r.PlanNo+'-'+r.StartDate+'-'+r.EndDate+m);
			
			var storage = window.localStorage;
    		var jsonarr = JSON.parse(storage.getItem("allmpush"));
			//alert('2');
			//alert(jsonarr.length);
			if(jsonarr.length)
			{
				for(var i=0;i<jsonarr.length-1;i++)
				{
					if(jsonarr[i].hour>jsonarr[i+1].hour)
					{
						jsonarr[i+1].minute=jsonarr[i].minute;
						jsonarr[i+1].hour=jsonarr[i].hour;
					}else if(jsonarr[i].minute>jsonarr[i+1].minute)
					{
						jsonarr[i+1].minute=jsonarr[i].minute;
						jsonarr[i+1].hour=jsonarr[i].hour;
					}
				}
				//alert('3');
				var deadline = new Date();
				//alert(n.EndDate.slice(0,4).length+'-'+n.EndDate.slice(4,6).length+'-'+n.EndDate.slice(6,8).length);
				var qwe=parseInt(n.EndDate);
				//alert(qwe);
				var y=parseInt(qwe/10000);
				var mo =parseInt(qwe%10000/100);
				var d=parseInt(qwe%10000%100);
				//alert(y+'-'+mo+'-'+d); 
				deadline.setFullYear(y,mo-1,d);
				deadline.setHours(parseInt(jsonarr[jsonarr.length-1].hour));
				//alert(jsonarr[jsonarr.length-1].hour);
				deadline.setMinutes(parseInt(jsonarr[jsonarr.length-1].minute));
				//alert(jsonarr[jsonarr.length-1].minute);
				deadline.setSeconds(30);
				//deadline.setDate(14);//parseInt(n.EndDate.slice(5,7)));
				//deadline.setMonth(9);//parseInt(n.EndDate.slice(3,5)));
				//alert(n.EndDate+'-'+n.EndDate.slice(0,4)+'-'+n.EndDate.slice(4,6)+'-'+n.EndDate.slice(6,8));
				//alert('4');
				//alert(deadline.getFullYear()+'-'+
				//	deadline.getMonth()+'-'+
				//	deadline.getDate()+'-'+
				//	deadline.getHours()+'-'+
				//	deadline.getMinutes()+'-'+
				//	deadline.getSeconds()+'-'+deadline.getTime());
				cordova.plugins.notification.local.schedule({
					id:0,
					title: '任务到期提醒',
					text: '您的计划即将到期',
					at: deadline,
					every:'day',
				});
				   cordova.plugins.notification.local.on("trigger", function (notification) {
					if(notification.id == 0)
					{
						//alert('cancelall');
						cancelAll();
						storage.removeItem('allmpush');
					}
				});
				//alert('添加了取消所有任务提醒');
			}
		},
		error: function(msg) {alert("GetPlanDeadline Error!");}
	});
}
	function cancelAll() {
		cordova.plugins.notification.local.cancelAll(alert('取消了所有通知'));
	};
	
	function GetModule(PID){
		window.localStorage.setItem("Module","M1");
		window.localStorage.setItem("IPAddress", "http://121.43.107.106:8088");
		window.localStorage.setItem("PatientFile", "/PersonalPhoto");
		window.localStorage.setItem("DoctorFile", "/PersonalPhoto");
		PatientURL = ImageAddressIP+window.localStorage.getItem("PatientFile")+"/";
		DoctorURL = ImageAddressIP+window.localStorage.getItem("DoctorFile")+"/";
	}
	
	function BacktoLogOn(){
		window.localStorage.clear();
		window.location.href='LogOn-Phone.html';
	}