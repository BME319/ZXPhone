var SBP = "";
var DBP = "";
var Hyper1 = "";
var Harvard1 = "";
var Framingham1 = "";
var Stroke1 = "";
var Heart1 = "";
var PatientId=localStorage.getItem('PatientId');

$(document).ready(function () {
	  GetCurrentSBP();
	  GetCurrentDBP();
	  GetRiskResult(PatientId);
	  PresentRiskResult(Hyper1, "Hyper");
	  PresentRiskResult(Harvard1, "Harvard");
	  PresentRiskResult(Framingham1, "Framingham");
	  PresentRiskResult(Stroke1, "Strokee");
	  PresentRiskResult(Heart1, "Heart");
  });
  
  
   //获取创建计划中最新一次的评估结果
   function GetRiskResult(PatientId)
   {
	  var option;
		  $.ajax({  
			  type: "POST",
			  dataType: "xml",
			  timeout: 30000,  
			  url: 'http://'+ serverIP +'/'+serviceName+'/GetRiskResult',
			  async:false,
			  data: {UserId:PatientId},//输入变量
			  beforeSend: function(){},
			  success: function(result) { 
				  option=$(result).text();
    			  Hyper1 =  option.slice(0,6);
				  Harvard1 = option.slice(8,14);
				  Framingham1 =  option.slice(16,22);
				  Stroke1 = option.slice(24,30);
				  Heart1 =  option.slice(32,38);
			  }, 
			  error: function(msg) {alert("GetRiskResult Error");}
		  });
		  return option;	 
   } 
   
  //从数据库中读取用户当前收缩压值
  function GetCurrentSBP(){
      var option = "";
	  $.ajax({  
		type: "POST",
		dataType: "xml",
		timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestSbpByPatientId',
		async:false,
		data: {PatientId:PatientId},//输入变量
		beforeSend: function(){},
		success: function(result) { 
			 //存在收缩压的值，则直接读取
			option=$(result).text();
			if (option != "")
			{
				SBP = parseInt(option);
			}				    
	    }, 
	    error: function(msg) {alert("Get Current Sbp Error!");}
	  });
      return option;	
  }	 
  
  //从数据库中读取用户当前舒张压值
  function GetCurrentDBP(){
	  var option;
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetLatestDbpByPatientId',
		  async:false,
		  data: {PatientId:PatientId},//输入变量
		  beforeSend: function(){},
		  success: function(result) { 
			  option=$(result).text();
			  if (option != "")
			  {
				  DBP = parseInt(option);
			  }	    
		  }, 
		  error: function(msg) {alert("Get Current Dbp Error!");}
	  });
	  return option;	
  } 
  
  //将风险评估计算结果显示在界面上
function PresentRiskResult(No, id)
{
	if (isNaN(No))
	{
		$('#' + id).parent().css("background-color", "white");
	}
	if (!(isNaN(No)))
	{
		var NewNo = (No*100).toFixed(2);
		var color;
		if (NewNo <= 5)
		{
			color = "#2ACA58";
		}
		else if (NewNo <= 15)
		{
			color = "#D4CC11";
			
		}
		else if (NewNo <= 25)
		{
			color = "#ECA319";
		}
		else if (NewNo <= 35)
		{
			color = "#FF7F50";
		}
		else
		{
			color = "#EC4319";
		}
		$('#' + id).parent().css("background-color", color);
		var Str = NewNo.toString() + "%";
		$('#' + id).html(Str);
	}
}
   
/* 
//页面加载后生成风险评估图
function Risk()
{
	  var Hyper="";
	  var Harvard="";
	  var Framingham="";
	  var Stroke="";
	  var Heart="";	
	  //创建计划时的评估结果 
	  var Hyper1="";
	  var Harvard1="";
	  var Framingham1="";
	  var Stroke1="";
	  var Heart1="";
	  	 
	  var Age = ""; 	
	  $.ajax
	 	 ({  	 	
          	type: "POST",
          	dataType: "xml",
		  	timeout: 30000,  
		  	url: 'http://'+ serverIP +'/'+serviceName+'/GetRiskInput',
		  	async:false,
          	data: {UserId:PatientId},//输入变量
		  	beforeSend: function(){},
          	success: function(result) 
		 	{ 			
			   $(result).find('Table1').each(function(){		
					Age = parseInt($(this).find("Age").text());
					Gender = parseInt($(this).find("Gender").text());
					Height = parseInt($(this).find("Height").text());
					Weight = parseInt($(this).find("Weight").text());
					Heartrate = parseInt($(this).find("Heartrate").text());
					Parent = parseInt($(this).find("Parent").text());
					Smoke = parseInt($(this).find("Smoke").text());
					Stroke = parseInt($(this).find("Stroke").text());
					Lvh = parseInt($(this).find("Lvh").text());
					Diabetes = parseInt($(this).find("Diabetes").text());
					Treat = parseInt($(this).find("Treat").text());
					Heartattack = parseInt($(this).find("Heartattack").text());
					Af = parseInt($(this).find("Af").text());
					Chd = parseInt($(this).find("Chd").text());
					Valve = parseInt($(this).find("Valve").text());
					Tcho = parseInt($(this).find("Tcho").text());
					Creatinine = parseFloat($(this).find("Creatinine").text());
					Hdlc = parseFloat($(this).find("Hdlc").text());
					Hyperother = parseFloat($(this).find("Hyperother").text());
					HarvardRiskInfactor = parseInt($(this).find("HarvardRiskInfactor").text());
					FraminghamRiskInfactor = parseFloat($(this).find("FraminghamRiskInfactor").text());
					StrokeRiskInfactor = parseInt($(this).find("StrokeRiskInfactor").text());
					HeartFailureRiskInfactor = parseInt($(this).find("HeartFailureRiskInfactor").text());
			});	
				//从数据库中获取除血压外所有输入，并进行初步计算，一次性取出
				//alert(Gender);
			   //alert(Hyperother);
			   //alert(StrokeRiskInfactor)
			   Hyperother=Hyperother- 0.05933 * SBP - 0.12847 * DBP+ 0.00162 * Age*DBP;
			   Hyper = 1-Math.exp(-Math.exp(((Math.log(4))- (22.94954+ Hyperother))/0.87692));
			   //计算高血压风险评估发病率

			   if (Gender==1)
			 {
				     if (SBP <= 119)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 5;
                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 8;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 9;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 10;
                     }
                     else
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 11;
                     }	
			 }
			 
			 else
			 {

				     if (SBP <= 119)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 0;
                     }
                     else if (SBP >= 120 && SBP <= 129)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 1;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 130 && SBP <= 139)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 2;
                     }
                     else if (SBP >= 140 && SBP <= 149)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 3;
                     }
                     else if (SBP >= 150 && SBP <= 159)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 4;
                     }
                     else if (SBP >= 160 && SBP <= 169)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 5;

                     }
                     else if (SBP >= 170 && SBP <= 179)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 6;
                     }
                     else if (SBP >= 180 && SBP <= 189)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 7;
                     }
                     else if (SBP >= 190 && SBP <= 199)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 8;
                     }
                     else if (SBP >= 200 && SBP <= 209)
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 9;
                     }
                     else
                     {
                         HarvardRiskInfactor = HarvardRiskInfactor + 10;
                     }	 
 
			 } 
			Harvard = 6.304 * Math.pow(10, -8) * Math.pow(HarvardRiskInfactor, 5) - 5.027 * Math.pow(10, -6) * Math.pow(HarvardRiskInfactor, 4) + 0.0001768 * Math.pow(HarvardRiskInfactor, 3) - 0.001998 * Math.pow(HarvardRiskInfactor, 2) + 0.01294 * HarvardRiskInfactor + 0.0409;
			Harvard=Harvard/100;
			//alert(Harvard);
			   //计算Harvard五年死亡率

			   if(Gender == 1)
			   {
					if(Treat==1)
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+1.99881*Math.log10(SBP);	
					}
					else
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+1.93303*Math.log10(SBP);	
					}   
					Framingham =  1-Math.pow(0.88936,Math.exp(FraminghamRiskInfactor - 23.9802));
			   }
			   else
			   {
					if(Treat==1)
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+2.82263*Math.log10(SBP);	
					}
					else
					{
						FraminghamRiskInfactor = FraminghamRiskInfactor+2.76157*Math.log10(SBP);	
					}  
					Framingham = 1-Math.pow(0.95012,Math.exp(FraminghamRiskInfactor - 26.1931));	   
			   }
			   //计算十年心血管疾病发生率
			   
			    if (Gender==1)//male
			    {
					if (Treat != 1) //没有治疗过高血压的情况
					{
							 if (SBP <= 105)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 0;
							 }
							 else if (SBP >= 106 && SBP <= 115)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 1;
							 }
							 else if (SBP >= 116 && SBP <= 125)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 2;
							 }
							 else if (SBP >= 126 && SBP <= 135)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 3;
							 }
							 else if (SBP >= 136 && SBP <= 145)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 4;
							 }
							 else if (SBP >= 146 && SBP <= 155)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 5;
							 }
							 else if (SBP >= 156 && SBP <= 165)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 6;
							 }
							 else if (SBP >= 166 && SBP <= 175)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 7;
							 }
							 else if (SBP >= 176 && SBP <= 185)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 8;
							 }
							 else if (SBP >= 186 && SBP <= 195)
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 9;
							 }
							 else
							 {
								 StrokeRiskInfactor = StrokeRiskInfactor + 10;
							 }
                 	}
                	else//治疗过高血压的情况
                    {
                         if (SBP <= 105)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 0;
                         }
                         else if (SBP >= 106 && SBP <= 112)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 1;
                         }
                         else if (SBP >= 113 && SBP <= 117)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 2;
                         }
                         else if (SBP >= 118 && SBP <= 123)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 3;
                         }
                         else if (SBP >= 124 && SBP <= 129)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 4;
                         }
                         else if (SBP >= 130 && SBP <= 135)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 5;
                         }
                         else if (SBP >= 136 && SBP <= 142)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 6;
                         }
                         else if (SBP >= 143 && SBP <= 150)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 7;
                         }
                         else if (SBP >= 151 && SBP <= 161)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 8;
                         }
                         else if (SBP >= 162 && SBP <= 176)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 9;
                         }
                         else
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 10;
                         }
                     }	 
				var Risk = new Array(3, 3, 4, 4, 5, 5, 6, 7, 8, 10, 11, 13, 15, 17, 20, 22, 26, 29, 33, 37, 42, 47, 52, 57, 63, 68, 74, 79, 84, 88);
				//alert(Risk[1]-1)
				 Stroke = Risk[StrokeRiskInfactor-1] / 100;
			 }
			 //女性SBP加成
			 else
			 {
			 	 if (Treat != 1) //没有治疗过高血压的情况
                 {
                         if (SBP <= 94)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 118)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 2;
                         }
                         else if (SBP >= 119 && SBP <= 130)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 3;
                         }
                         else if (SBP >= 131 && SBP <= 143)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 4;
                         }
                         else if (SBP >= 144 && SBP <= 155)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 5;
                         }
                         else if (SBP >= 156 && SBP <= 167)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 6;
                         }
                         else if (SBP >= 168 && SBP <= 180)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 7;
                         }
                         else if (SBP >= 181 && SBP <= 192)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 8;
                         }
                         else if (SBP >= 193 && SBP <= 204)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 9;
                         }
                         else
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 10;
                         }
                 }
                 else//治疗过高血压的情况
                 {
                         if (SBP <= 94)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 0;
                         }
                         else if (SBP >= 95 && SBP <= 106)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 1;
                         }
                         else if (SBP >= 107 && SBP <= 113)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 2;
                         }
                         else if (SBP >= 114 && SBP <= 119)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 3;
                         }
                         else if (SBP >= 120 && SBP <= 125)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 4;
                         }
                         else if (SBP >= 126 && SBP <= 131)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 5;
                         }
                         else if (SBP >= 132 && SBP <= 139)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 6;
                         }
                         else if (SBP >= 140 && SBP <= 148)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 7;
                         }
                         else if (SBP >= 149 && SBP <= 160)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 8;
                         }
                         else if (SBP >= 161 && SBP <= 204)
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 9;
                         }
                         else
                         {
                             StrokeRiskInfactor = StrokeRiskInfactor + 10;
                         }
                 }
			     var Risk = new Array(1, 1, 2, 2, 2, 3, 4, 4, 5, 6, 8, 9, 11, 13, 16, 19, 23, 27, 32, 37, 43, 50, 57, 64, 71, 78, 84);
				 Stroke = Risk[StrokeRiskInfactor-1] / 100;         
			 }
			   //中风发生率
			   
			   if (Gender==1)//男性
			   {
				        if (SBP <= 119)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 0;
                         }
                         else if (SBP >= 120 && SBP <= 139)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 1;
                         }
                         else if (SBP >= 140 && SBP <= 169)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 2;
                         }
                         else if (SBP >= 170 && SBP <= 189)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 3;
                         }
                         else if (SBP >= 190 && SBP <= 219)
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 4;
                         }
                         else
                         {
                             HeartFailureRiskInfactor = HeartFailureRiskInfactor + 5;
                         }
						 
				         if (HeartFailureRiskInfactor <= 5)
						 {
							 HeartFailureRisk = 1;
						 }
						 else if (HeartFailureRiskInfactor > 5 && HeartFailureRiskInfactor < 14)
						 {
							 HeartFailureRisk = 3;
						 }
						 else if (HeartFailureRiskInfactor >= 14 && HeartFailureRiskInfactor < 16)
						 {
							 HeartFailureRisk = 5;
						 }
						 else if (HeartFailureRiskInfactor >= 16 && HeartFailureRiskInfactor < 18)
						 {
							 HeartFailureRisk = 8;
						 }
						 else if (HeartFailureRiskInfactor >= 18 && HeartFailureRiskInfactor < 20)
						 {
							 HeartFailureRisk = 11;
						 }
						 else if (HeartFailureRiskInfactor >= 20 && HeartFailureRiskInfactor < 22)
						 {
							 HeartFailureRisk = 11;
						 }
						 else if (HeartFailureRiskInfactor >= 22 && HeartFailureRiskInfactor < 24)
						 {
							 HeartFailureRisk = 22;
						 }
						 else if (HeartFailureRiskInfactor >= 24 && HeartFailureRiskInfactor < 25)
						 {
							 HeartFailureRisk = 30;
						 }
						 else if (HeartFailureRiskInfactor >= 25 && HeartFailureRiskInfactor < 26)
						 {
							 HeartFailureRisk = 34;
						 }
						 else if (HeartFailureRiskInfactor >= 26 && HeartFailureRiskInfactor < 27)
						 {
							 HeartFailureRisk = 39;
						 }
						 else if (HeartFailureRiskInfactor >= 27 && HeartFailureRiskInfactor < 28)
						 {
							 HeartFailureRisk = 44;
						 }
						 else if (HeartFailureRiskInfactor >= 28 && HeartFailureRiskInfactor < 29)
						 {
							 HeartFailureRisk = 49;
						 }
						 else if (HeartFailureRiskInfactor >= 29 && HeartFailureRiskInfactor < 30)
						 {
							 HeartFailureRisk = 54;
						 }
						 else 
						 {
							 HeartFailureRisk = 59;
						 }
						 
				         Heart=HeartFailureRisk/100;
			 }
			 else
			 {
				     if (SBP < 140)
                     {
                         HeartFailureRiskInfactor = HeartFailureRiskInfactor + 0;
                     }
                     else if (SBP >= 140 && SBP <= 209)
                     {
                         HeartFailureRiskInfactor = HeartFailureRiskInfactor + 1;
                     }
                     else
                     {
                         HeartFailureRiskInfactor = HeartFailureRiskInfactor + 2;
                     }	
					  
				     if (HeartFailureRiskInfactor < 10)
                     {
                         HeartFailureRisk = 1;
                     }
                     else if (HeartFailureRiskInfactor <= 28)
                     {
                         var Risk = new Array(2,2,3, 3, 4, 5, 7, 9, 11, 14, 17, 21, 25, 30, 36, 42, 48, 54, 60 );
                         HeartFailureRisk = Risk[HeartFailureRiskInfactor - 10];
                     }
                     else 
                     {
                         HeartFailureRisk = 60;
                     }
				     Heart=HeartFailureRisk/100;
			 } 
			   //心衰发病率
              // SetRiskResult(Hyper,Harvard,Framingham,Stroke,Heart);无需插入评估结果
			   GetRiskResult(PatientId);
			   RiskBar(Hyper,Harvard,Framingham,Stroke,Heart, Hyper1,Harvard1,Framingham1,Stroke1,Heart1);
          	}, 
            error: function(msg) {alert("RiskInput");}
   });*/
   
  
	  

   