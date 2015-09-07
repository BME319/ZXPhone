/**********************全局变量************************/
 var UserId = window.localStorage.getItem("ID");
 //var ImageAddressIP = window.localStorage.getItem("IPAddress");
 //var ImageAddressIP = "http://10.13.22.66:8088";  //webserviceIP
 var ImageAddressIP = "http://121.43.107.106:8088";  //webserviceIP
 window.localStorage.setItem("PatientFile", "/PersonalPhoto");
 var ImageAddressFile = window.localStorage.getItem("PatientFile");
 var pictureSource;   // picture source
 var destinationType; // sets the format of returned value
 var TerminalIP = window.localStorage.getItem("TerminalIP");
 var TerminalName = window.localStorage.getItem("TerminalName");
 var DeviceType = window.localStorage.getItem("DeviceType");
 var revUserId  = window.localStorage.getItem("UserId");
 
/**********************初始页面************************/
$(document).ready(function(event){
	//document.getElementById("SexStyle").style.display = "none";
	document.getElementById("AlertSex").style.display = "none";
	//document.getElementById("BirthStyle").style.display = "none";
	document.getElementById("AlertBirth").style.display = "none";
	//document.getElementById("IDStyle").style.display = "none";
	document.getElementById("AlertID").style.display = "none";
	//document.getElementById("PhoneStyle").style.display = "none";	//2015-5-22 ZCY增加
	document.getElementById("AlertPhone").style.display = "none";	//2015-5-22 ZCY增加
	document.getElementById("AlertHeight").style.display = "none";	//2015-6-3 ZCY增加
	document.getElementById("AlertWeight").style.display = "none";	//2015-6-3 ZCY增加
	document.getElementById("AlertEmergencyPhone").style.display = "none";//2015-6-3 ZCY增加
	document.getElementById("AlertBasicInfo").style.display = "none";
	document.getElementById("AlertVitalInfo").style.display = "none";
	document.getElementById("AlertIDInfo").style.display = "none";
	document.getElementById("AlertConnectInfo").style.display = "none";
		
	GetTypeList("SexType");
	GetTypeList("AboBloodType");
	GetInsuranceTypeList();

	GetDetailInfo(UserId);
 	GetBasicInfo(UserId);
	GetUserBasicInfo(UserId);
});

//获取下拉框内容
function GetTypeList (Category)
{
	$("#"+Category).append('<option value=0>--请选择--</option>');
	
	$.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetTypeList',
    async: false,
	data: 
	{
		Category: Category
	},
    beforeSend: function() {
    },
    success: function(result) {
		$(result).find('Table1').each(function() {
			var Type = $(this).find("Type").text();
			var Name = $(this).find("Name").text();
			$("#"+Category).append('<option value='+Type+'>'+Name+'</option>');
		})	  
    },
    error: function(msg) {
      alert("GetTypeList出错啦！");
    }
  });
}

//获取医保下拉框内容
function GetInsuranceTypeList() {
	$("#InsuranceType").append('<option value=0>--请选择--</option>');

	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetInsuranceType',
		async: false,
		data:
		{
		},
		beforeSend: function () {
		},
		success: function (result) {
			$(result).find('Table1').each(function () {
				var Code = $(this).find("Code").text();
				var Name = $(this).find("Name").text();
				//alert(Code);
				//alert(Name);
				$("#InsuranceType").append('<option value=' + Code + '>' + Name + '</option>');
			})
		},
		error: function (msg) {
			alert("GetInsuranceType出错啦！");
		}
	});
}

//获取病人基本信息
function GetBasicInfo (UserId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetPatBasicInfo',
    async: false,
	data: 
	{
		UserId: UserId
	},
    beforeSend: function() {
   },
    success: function(result) {      	  
		var UserId = $(result).find("PatientBasicInfo").find("UserId").text();
		var UserName = $(result).find("PatientBasicInfo").find("UserName").text();
        var Gender = $(result).find("PatientBasicInfo").find("Gender").text();
        var BloodType = $(result).find("PatientBasicInfo").find("BloodType").text();
        var InsuranceType = $(result).find("PatientBasicInfo").find("InsuranceType").text();
        var Birthday = $(result).find("PatientBasicInfo").find("Birthday").text();
        var BloodTypeText = $(result).find("PatientBasicInfo").find("BloodTypeText").text();
        var InsuranceTypeText = $(result).find("PatientBasicInfo").find("InsuranceTypeText").text();
        var Module = $(result).find("PatientBasicInfo").find("Module").text();

		document.getElementById('UserId').innerText = UserId;
		document.getElementById('UserName').innerText = UserName;
		var Birthday = Birthday.substring(0,4) + "-" + Birthday.substring(4,6) + "-" + Birthday.substring(6,8);
		$("#Birthday").val(Birthday);
		$("#SexType").val(Gender);
		$('#SexType').selectmenu('refresh');
		$("#AboBloodType").val(BloodType); 
		$('#AboBloodType').selectmenu('refresh');
		$("#InsuranceType").val(InsuranceType); 
		$('#InsuranceType').selectmenu('refresh');
    },
    error: function(msg) {
      alert("GetPatBasicInfo出错啦！");
    }
  });
}

//获取病人详细信息
function GetDetailInfo (UserId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetPatientDetailInfo',
    async: false,
	data: 
	{
		UserId: UserId
	},
    beforeSend: function() {
   },
    success: function(result) {          	  
		var UserId = $(result).find("PatientDetailInfo1").find("UserId").text();
		var PhoneNumber = $(result).find("PatientDetailInfo1").find("PhoneNumber").text();
        var HomeAddress = $(result).find("PatientDetailInfo1").find("HomeAddress").text();
        var Occupation = $(result).find("PatientDetailInfo1").find("Occupation").text();
        var Nationality = $(result).find("PatientDetailInfo1").find("Nationality").text();
        var EmergencyContact = $(result).find("PatientDetailInfo1").find("EmergencyContact").text();
        var EmergencyContactPhoneNumber = $(result).find("PatientDetailInfo1").find("EmergencyContactPhoneNumber").text();
        var PhotoAddress = $(result).find("PatientDetailInfo1").find("PhotoAddress").text();
        var Module = $(result).find("PatientDetailInfo1").find("Module").text();
        var IDNo = $(result).find("PatientDetailInfo1").find("IDNo").text();
		var Height = $(result).find("PatientDetailInfo1").find("Height").text();
		var Weight = $(result).find("PatientDetailInfo1").find("Weight").text();

		if (PhotoAddress == "")
		{
			PhotoAddress = ImageAddressIP + ImageAddressFile + '/add.jpg';
		}
		else PhotoAddress = ImageAddressIP + ImageAddressFile + '/'+PhotoAddress;
		$("#Photo").attr("src",PhotoAddress);
		$("#PhoneNumber").val(PhoneNumber);
		$("#HomeAddress").val(HomeAddress);
		$("#Occupation").val(Occupation);
		$("#Nationality").val(Nationality);
		$("#EmergencyContact").val(EmergencyContact);
		$("#EmergencyContactPhoneNumber").val(EmergencyContactPhoneNumber);
		$("#IDNo").val(IDNo);
		$("#Height").val(Height);
		$("#Weight").val(Weight);
		
    },
    error: function(msg) {
      alert("GetPatientDetailInfo出错啦！");
    }
  });
}

/**********************重置信息************************/
function ResetInfo()
{
	//var UserId = document.getElementById("UserId").innerText;
	document.getElementById("AlertSex").style.display = "none";
	document.getElementById("AlertBirth").style.display = "none";
	document.getElementById("AlertID").style.display = "none";
	document.getElementById("AlertPhone").style.display = "none";
	document.getElementById("AlertHeight").style.display = "none";
	document.getElementById("AlertWeight").style.display = "none";
	document.getElementById("AlertEmergencyPhone").style.display = "none";
	document.getElementById("AlertBasicInfo").style.display = "none";
	document.getElementById("AlertVitalInfo").style.display = "none";
	document.getElementById("AlertIDInfo").style.display = "none";
	document.getElementById("AlertConnectInfo").style.display = "none";
	
	GetDetailInfo(UserId);
 	GetBasicInfo(UserId);
	GetUserBasicInfo(UserId);
}

/**********************保存信息************************/
function SaveInfo()
{
	var UserName = document.getElementById("UserName").innerText;
	var Gender = document.getElementById("SexType").value;
	var Birthday = document.getElementById("Birthday").value;
	var Height = document.getElementById("Height").value;
	var Weight = document.getElementById("Weight").value;
	var PhoneNumber = document.getElementById("PhoneNumber").value;
	var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
	var lengthIDNo = $("#IDNo").val().length;
	var reg = /^\d+(?=\.{0,1}\d+$|$)/
	var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
	//var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
	var isMob = /^1[3|4|5|7|8][0-9]\d{8}$/;

	if (Gender == "0" || Gender == "" || Birthday == "")
	{
		document.getElementById("AlertBasicInfo").style.display = "block";
		if (Gender == "0" || Gender == "") {
			document.getElementById("AlertSex").style.display = "block";
		}
		else {
			document.getElementById("AlertSex").style.display = "none";
		}
		if (Birthday == "") {
			document.getElementById("AlertBirth").style.display = "block";
		}
		else {
			document.getElementById("AlertBirth").style.display = "none";
		}
	}
	else
	{
		document.getElementById("AlertBasicInfo").style.display = "none";
		document.getElementById("AlertSex").style.display = "none";
		document.getElementById("AlertBirth").style.display = "none";
	}
	
	if(!reg.test(Height) && Height != ""){ 
        //alert("身高格式不正确，请重新输入!");
		document.getElementById("AlertVitalInfo").style.display = "block";
		document.getElementById("AlertHeight").style.display = "block";
    } 
	else 
	{
		//document.getElementById("AlertVitalInfo").style.display = "none";
		document.getElementById("AlertHeight").style.display = "none";
	}
	
	if(!reg.test(Weight) && Weight != ""){
        //alert("体重格式不正确，请重新输入!");
		document.getElementById("AlertVitalInfo").style.display = "block";
		document.getElementById("AlertWeight").style.display = "block";
    } 
	else
	{
		//document.getElementById("AlertVitalInfo").style.display = "none";
		document.getElementById("AlertWeight").style.display = "none";
	}
	if((reg.test(Height) || Height == "") && (reg.test(Weight) || Weight == ""))
	{ 
		document.getElementById("AlertVitalInfo").style.display = "none";
	}
	if (lengthIDNo != 15 && lengthIDNo != 18 && lengthIDNo != 0)
	{
		//alert("证件号码格式不正确，请重新输入！");
		document.getElementById("AlertIDInfo").style.display = "block";
		document.getElementById("AlertID").style.display = "block";
	}
	else
	{
		document.getElementById("AlertIDInfo").style.display = "none";
		document.getElementById("AlertID").style.display = "none";
	}
	
	if (!isMob.test(PhoneNumber) && !isPhone.test(PhoneNumber) && PhoneNumber != "")
	{
		//alert("联系电话格式不正确，请重新输入！");
		document.getElementById("AlertConnectInfo").style.display = "block";
		document.getElementById("AlertPhone").style.display = "block";
	}
	else
	{
		//document.getElementById("AlertConnectInfo").style.display = "none";
		document.getElementById("AlertPhone").style.display = "none";
	}
	
	if (!isMob.test(EmergencyContactPhoneNumber) && !isPhone.test(EmergencyContactPhoneNumber) && EmergencyContactPhoneNumber != "")
	{
		//alert("紧急联系电话格式不正确，请重新输入！");
		document.getElementById("AlertConnectInfo").style.display = "block";
		document.getElementById("AlertEmergencyPhone").style.display = "block";
	}
	else
	{
		//document.getElementById("AlertConnectInfo").style.display = "none";
		document.getElementById("AlertEmergencyPhone").style.display = "none";
	}
	
	if ((isMob.test(PhoneNumber) || isPhone.test(PhoneNumber) || PhoneNumber == "") && (isMob.test(EmergencyContactPhoneNumber) || isPhone.test(EmergencyContactPhoneNumber) || EmergencyContactPhoneNumber == ""))
	{
		document.getElementById("AlertConnectInfo").style.display = "none";
	}
	
	if (Gender != "0" && Gender != "" && Birthday != "" && (reg.test(Height) || Height == "") && (reg.test(Weight) || Weight == "") && (lengthIDNo == 15 || lengthIDNo == 18 || lengthIDNo == 0) && (isMob.test(PhoneNumber) || isPhone.test(PhoneNumber) || PhoneNumber == "") && (isMob.test(EmergencyContactPhoneNumber) || isPhone.test(EmergencyContactPhoneNumber) || EmergencyContactPhoneNumber == ""))
	{
		var IDNo = document.getElementById("IDNo").value;
		var BloodType = document.getElementById("AboBloodType").value;
		//var Height = document.getElementById("Height").value;
		//var Weight = document.getElementById("Weight").value;
		var InsuranceType = document.getElementById("InsuranceType").value;
		//var InsuranceType = $("#InsuranceType").find("option:selected").text();
		if(InsuranceType == "")
		{
			InsuranceType = 0;
		}
		//var PhoneNumber = document.getElementById("PhoneNumber").value;
		var HomeAddress = document.getElementById("HomeAddress").value;
		var Nationality = document.getElementById("Nationality").value;
		var Occupation = document.getElementById("Occupation").value;
		var EmergencyContact = document.getElementById("EmergencyContact").value;
		//var EmergencyContactPhoneNumber = document.getElementById("EmergencyContactPhoneNumber").value;
		var DoctorId = document.getElementById("DoctorId").value;
		var InvalidFlag = document.getElementById("InvalidFlag").value;
		var TerminalIP = window.localStorage.getItem("TerminalIP");
		 var TerminalName = window.localStorage.getItem("TerminalName");
		 var DeviceType = window.localStorage.getItem("DeviceType");
		 var revUserId  = window.localStorage.getItem("UserId");
		var ItemSeq = "1";
		var Description = null;
		var SortNo = "1";
		var Birthday = Birthday.replace("-","");
		var Birthday = Birthday.replace("-","");
		
		SetBasicInfo(UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact001_1", ItemSeq, IDNo, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag1 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact001_2", ItemSeq, Occupation, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag2 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact001_3", ItemSeq, Nationality, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag3 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_1", ItemSeq, PhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag4 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_2", ItemSeq, HomeAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag5 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_3", ItemSeq, EmergencyContact, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag6 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "Contact", "Contact002_4", ItemSeq, EmergencyContactPhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag7 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "BodySigns", "Height", ItemSeq, Height, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag8 = document.getElementById("Flag").value;
		SetDetailInfo(UserId, "BodySigns", "Weight", ItemSeq, Weight, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
		var Flag9 = document.getElementById("Flag").value;

		/*if (Flag == "true" && Flag1 == "true" && Flag2 == "true" && Flag3 == "true" && Flag4 == "true" && Flag5 == "true" && Flag6 == "true" && Flag7 == "true" && Flag8 == "true" && Flag9 == "true")
		{
			//alert("基本信息保存成功！")
			history.back(-1);
		}
		else
		{
			alert("基本信息保存失败！")
		}*/
		$.ajax({
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,
		  url: 'http://' + serverIP + '/' + serviceName + '/GetAllRoleMatch',
		  async: false,
		  data:
		  {
			  UserId: UserId
		  },
		  beforeSend: function () {
		  },
		  success: function (result) {
			  $(result).find('Table1').each(function () {
				  var RoleClass = $(this).find("RoleClass").text();
				  if(RoleClass != 'Patient')
				  {
					  SetDoctorInfo(UserId, UserName, Birthday, Gender, IDNo, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact001_1", ItemSeq, IDNo, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact001_2", ItemSeq, Occupation, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact001_3", ItemSeq, Nationality, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact002_1", ItemSeq, PhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact002_2", ItemSeq, HomeAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact002_3", ItemSeq, EmergencyContact, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "Contact", "Contact002_4", ItemSeq, EmergencyContactPhoneNumber, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "BodySigns", "Height", ItemSeq, Height, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  SetDoctorInfoDetail(UserId, "BodySigns", "Weight", ItemSeq, Weight, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					  
				  }
			  })
		  },
		  error: function (msg) {
			  alert("GetAllRoleMatch出错啦！");
		  }
	  });
	}
}

//获取全部基本信息
function GetUserBasicInfo (UserId)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/GetUserBasicInfo',
    async: false,
	data: 
	{
		UserId: UserId
	},
    beforeSend: function() {
   },
    success: function(result) {      	  
		var DoctorId = $(result).find("PatientALLBasicInfo").find("DoctorId").text();
		var InvalidFlag = $(result).find("PatientALLBasicInfo").find("InvalidFlag").text();
		$("#DoctorId").val(DoctorId);
		$("#InvalidFlag").val(InvalidFlag);
    },
    error: function(msg) {
      alert("GetPatBasicInfo出错啦！");
    }
  });
}
//保存基本信息到Ps.BasicInfo
function SetBasicInfo (UserId, UserName, Birthday, Gender, BloodType, IDNo, DoctorId, InsuranceType, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetPatBasicInfo',
    async: false,
	data: 
	{
		UserId: UserId,
		UserName: UserName,
		Birthday: Birthday,
		Gender: Gender,
		BloodType: BloodType,
		IDNo: IDNo,
		DoctorId: DoctorId,
		InsuranceType: InsuranceType,
		InvalidFlag: InvalidFlag,
		revUserId: revUserId,
		TerminalName: TerminalName,
		TerminalIP: TerminalIP,
		DeviceType: DeviceType
	},
    beforeSend: function() {
   },
    success: function(result) {      	  
		var Flag = $(result).find("boolean ").text();
		$("#Flag").val(Flag);
    },
    error: function(msg) {
      alert("SetPatBasicInfo出错啦！");
    }
  });
}

//保存基本信息到Ps.DoctorInfo
function SetDoctorInfo(UserId, UserName, Birthday, Gender, IDNo, InvalidFlag, revUserId, TerminalName, TerminalIP, DeviceType) 
{
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetPsDoctor',
		async: false,
		data:
		{
			UserId: UserId,
			UserName: UserName,
			Birthday: Birthday,
			Gender: Gender,
			IDNo: IDNo,
			InvalidFlag: InvalidFlag,
			revUserId: revUserId,
			TerminalName: TerminalName,
			TerminalIP: TerminalIP,
			DeviceType: DeviceType
		},
		beforeSend: function () {
		},
		success: function (result) {
			var Flag = $(result).find("boolean ").text();
			$("#Flag").val(Flag);
		},
		error: function (msg) {
			alert("SetPsDoctor出错啦！");
		}
	});
}

//保存详细信息到PsDetailInfo
function SetDetailInfo(Patient, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType)
{
  $.ajax({
    type: "POST",
    dataType: "xml",
    timeout: 30000,
	url: 'http://'+ serverIP +'/'+serviceName+'/SetPatBasicInfoDetail',
    async: false,
	data: 
	{
		Patient: Patient,
		CategoryCode: CategoryCode,
		ItemCode: ItemCode,
		ItemSeq: ItemSeq,
		Value: Value,
		Description: Description,
		SortNo: SortNo,
		revUserId: revUserId,
		TerminalName: TerminalName,
		TerminalIP: TerminalIP,
		DeviceType: DeviceType
	},
    beforeSend: function() {
   },
    success: function(result) {
		Flag = $(result).find("boolean ").text();
		$("#Flag").val(Flag);
    },
    error: function(msg) {
      alert("SetPatBasicInfoDetail出错啦！");
    }
  });
}

//保存详细信息到PsDoctorInfoDetail
function SetDoctorInfoDetail(Doctor, CategoryCode, ItemCode, ItemSeq, Value, Description, SortNo, piUserId, piTerminalName, piTerminalIP, piDeviceType) {
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/SetDoctorInfoDetail',
		async: false,
		data:
		{
			Doctor: Doctor,
			CategoryCode: CategoryCode,
			ItemCode: ItemCode,
			ItemSeq: ItemSeq,
			Value: Value,
			Description: Description,
			SortNo: SortNo,
			piUserId: piUserId,
			piTerminalName: piTerminalName,
			piTerminalIP: piTerminalIP,
			piDeviceType: piDeviceType
		},
		beforeSend: function () {
		},
		success: function (result) {
			Flag = $(result).find("boolean ").text();
			$("#Flag").val(Flag);
		},
		error: function (msg) {
			alert("SetDoctorInfoDetail出错啦！");
		}
	});
}

/**********************更换头像************************/
// Wait for device API libraries to load
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
function onPhotoDataSuccess(imageData) {
  var Photo = document.getElementById('Photo');
  imageURI = "data:image/jpeg;base64," + imageData;
  
  window.location.href = "#MainPage";
 
  Photo.style.width = '100px';
  Photo.style.height = '100px';
  Photo.src = imageURI;
  
  uploadPhoto(imageURI);
}

// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {   
  var Photo = document.getElementById('Photo');
  
  window.location.href = "#MainPage";

  Photo.style.width = '100px';
  Photo.style.height = '100px';
  Photo.src = imageURI;
  
  uploadPhoto(imageURI);
}


// 调用相机
function capturePhoto() {
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
	saveToPhotoAlbum: true,
	destinationType: destinationType.DATA_URL });
}

// 调用相册
function getPhoto(source) {
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
	destinationType: destinationType.FILE_URI,
	sourceType: source });
}

// Called if something bad happens.
function onFail(message) {
  alert('Failed because: ' + message);
}

//上传头像
function uploadPhoto(imageURI) {
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = UserId + ".jpg";
	options.mimeType = "image/jpeg";

	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";
	options.params = params;
	var ft = new FileTransfer();
	var URI = ImageAddressIP + '/'+ "upload.php";
	ft.upload(imageURI, URI, win, fail, options);
}

function win(r) {
	var PhotoAddress = UserId+".jpg";
var TerminalIP = window.localStorage.getItem("TerminalIP");
 var TerminalName = window.localStorage.getItem("TerminalName");
 var DeviceType = window.localStorage.getItem("DeviceType");
 var revUserId  = window.localStorage.getItem("UserId");
	var ItemSeq = "1";
	var Description = null;
	var SortNo = "1";
	SetDetailInfo(UserId, "Contact", "Contact001_4", ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
	CheckMstRole(UserId, ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
	var Flag = document.getElementById("Flag").value;
	if (Flag == "true")
	{
	  history.back(-1);
	}
	else
	{
		alert("头像地址更新失败！");
	}
}

function fail(error) {
	alert("头像更新失败！");
}

//获取角色信息并保存相应医生角色基本信息
function CheckMstRole(UserId, ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType)
{
	$.ajax({
		type: "POST",
		dataType: "xml",
		timeout: 30000,
		url: 'http://' + serverIP + '/' + serviceName + '/GetAllRoleMatch',
		async: false,
		data:
		{
			UserId: UserId
		},
		beforeSend: function () {
		},
		success: function (result) {
			$(result).find('Table1').each(function () {
				var RoleClass = $(this).find("RoleClass").text();
				If (RoleClass = 'Patient')
				{
					SetDoctorInfo(UserId, "Contact", "Contact001_4", ItemSeq, PhotoAddress, Description, SortNo, revUserId, TerminalName, TerminalIP, DeviceType);
					var Flag = document.getElementById("Flag").value;
					if (Flag != "true")
					{
					  alert("医生头像地址更新失败！");
					}
				}
			})
		},
		error: function (msg) {
			alert("GetAllRoleMatch出错啦！");
		}
	});
}


