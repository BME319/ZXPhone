var PatientUPL = 'http://10.12.43.40:8019/CDFiles/PersonalPhoto/Patient/'
var DoctorURL = 'http://10.12.43.40:8019/CDFiles/PersonalPhoto/Doctor/'


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
				$("#PatientName").html(m);
			},
			error: function(msg) {alert("Error!");}
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
				if(m == "") m = PatientUPL+"non.jpg";
				$("#PatientPhoto").attr("src", m);
			},
			error: function(msg) {alert("Error!");}
		});
	}
	