<!--画日历部分-->
var blank =0;
var hehe = function (id)
{
    return "string" == typeof id ? document.getElementById(id) : id;
};
var Class = 
{
  create: function() 
  {
    return function() 
	{
      this.initialize.apply(this, arguments);
    }
  }
}
Object.extend = function(destination, source) 
{
    for (var property in source) 
	{
        destination[property] = source[property];
    }
    return destination;
}
var Calendar = Class.create();
Date.prototype.Format = function (fmt)
{ 
    var o = {
        		"M+": this.getMonth() + 1, //月份 
        		"d+": this.getDate(), //日 
        		"h+": this.getHours(), //小时 
        		"m+": this.getMinutes(), //分 
       		    "s+": this.getSeconds(), //秒 
        		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        		"S": this.getMilliseconds() //毫秒 
    		};
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Calendar.prototype = 
{
  initialize: function(container, options) 
  {
	this.Container = hehe(container);//容器(table结构)
	this.Days = [];//日期对象列表
	this.SetOptions(options);
	this.Year = this.options.Year;
	this.Month = this.options.Month;
	//this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
	this.onSelectDay = this.options.onSelectDay;
	this.onToday = this.options.onToday;
	this.onFinish = this.options.onFinish;	
	this.Draw();
	Read();//用于调用数据库读取整体依从率
	
  },
  //设置默认属性，
  SetOptions: function(options)
  {
	this.options = 
	{//默认值
		Year:			new Date().getFullYear(),//显示年
		Month:			new Date().getMonth() + 1,//显示月
		//SelectDay:		null,//选择日期
		onSelectDay:	function(){},//在选择日期触发
		onToday:		function(){},//在当天日期触发
		onFinish:		function(){}//日历画完后触发
	};
	Object.extend(this.options, options || {});
  },
  //上一个月
  PreMonth: function() 
  {
	//先取得上一个月的日期对象
	var d = new Date(this.Year, this.Month - 2, 1);
	//再设置属性
	this.Year = d.getFullYear();
	this.Month = d.getMonth() + 1;
	//重新画日历
	this.Draw();
  },  
  //下一个月
  NextMonth: function() 
  {
	var d = new Date(this.Year, this.Month, 1);
	this.Year = d.getFullYear();
	this.Month = d.getMonth() + 1;
	this.Draw();
  },  
  //画日历
  Draw: function() 
  {
	//用来保存日期列表
	var arr = [];
	for(var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++){ arr.push("&nbsp;"); }
	blank=arr.length;
	for(var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++){ arr.push(i); }
	var frag = document.createDocumentFragment();	
	this.Days = [];
	while(arr.length > 0)
	{
		var row = document.createElement("tr");//新建一行
		//每个星期有7天
		for(var i = 1; i <= 7; i++)
		{
			var cell = document.createElement("td");//一行中每一列
			cell.innerHTML = "&nbsp;";
			
			if(arr.length > 0)
			{
				var d = arr.shift();
				cell.innerHTML = d;
				if(d > 0)
				{					
					this.Days[d] = cell;
					//判断是否今日
					if(this.IsSame(new Date(this.Year, this.Month - 1, d), new Date())){ this.onToday(cell); }											
					//if(this.IsSame(new Date(this.Year, this.Month - 1, d), new Date(this.Year, this.Month - 1, 15))){ this.onSelectDay(cell)}//如果当前这一天日期等于15号，就调用onSelectDay函数，传入参数为cell
				}
			}
			row.appendChild(cell);
		}
		frag.appendChild(row);
	}
	
	//先清空内容再插入(ie的table不能用innerHTML)
	while(this.Container.hasChildNodes()){ this.Container.removeChild(this.Container.firstChild); }
	this.Container.appendChild(frag);
	this.onFinish();
},
  //判断是否同一日
  IsSame: function(d1, d2) 
  {
	return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
  } 
};



// JavaScript Document
// JavaScript Document
//点击换月后清空文本框
function clear()
{
	$ ("#tasktext").val('');
}
//点击获取某天依从情况
function oneday(event){
//alert("clear")
clear();
var obj=document.elementFromPoint(event.clientX,event.clientY);
var clickday=obj.innerText;

if(clickday<10)
{
	clickday=clickday.toString();
	clickday="0"+clickday;	
}
var year=document.getElementById("idCalendarYear");
year=year.innerText;
var month=document.getElementById("idCalendarMonth");
month=month.innerText;
if(month<10)
{
	month=month.toString();
	month="0"+month;
}
clickday = year+month+clickday;
//根据点击的日期获取当天所在的PlanNo
for(var m=0;m<=PlanNumber.length;m++)
{
	if (clickday<=End[m] && clickday>=Start[m])
	{break;}	
}
PlanNo=PlanNumber[m];
//
GetTasksByDate(PatientId, clickday, PlanNo);
}

function GetTasksByDate(PatientId, clickday, PlanNo){
	  var option;
	  $.ajax({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetTasksByIndate',
		  async:false,
		  data: {PatientId:PatientId,
				 Indate:clickday,
				 PlanNo:PlanNo},//输入变量
		  beforeSend: function(){},
		  success: function(result)
		  { 
    		var TaskID = [];
			var TaskName = [];
			var Status = [];
			var sum = new Array();
			var i = 0;
			var result;
	        option = $(result).find("Table1").each(function()
			{
			    TaskID[i] = $(this).find("TaskID").text();
				TaskName[i] = $(this).find("TaskName").text();
				Status[i] = $(this).find("Status").text();
				if(Status[i]==0)

				{
					Status[i]="×"	
				}
				else
				{
					Status[i]="√"	
				}
				sum[i]="  "+ Status[i] + " " + TaskName[i] + "\r\n";
				i++;
			});	
		 var summary=new Array();
		 for(i=0;i<sum.length;i++)
		 {
			 summary=summary+sum[i];	 
		 }	 
		 $("#tasktext").val(summary);

		}, 
		  error: function(msg) {/*alert("Oneday Error!");*/}
	  });
	  return option;	
  }
  
//显示当月依从情况，今天取的是系统时间，
function Read()
{
	//alert(PatientId);
	var d = parseInt(new Date().Format("yyyyMMdd"));//获取今天日期的整型20150314
	var year=document.getElementById("idCalendarYear");
	year=year.innerText;
	var month=document.getElementById("idCalendarMonth");
	month=month.innerText;
	var first=year*10000+month*100+1;
	//alert(d);alert(first)
	GetCompliance(PatientId, Module, d, first);
}
//可以查看该病人所有计划的依从率
function GetCompliance(PatientId, Module, d, first)
{
	  //d="20150430";
	 // first="20150401";
      var option;
	  var date = new Array();
	  var Compliance = new Array();
	  $.ajax
	  ({  
		  type: "POST",
		  dataType: "xml",
		  timeout: 30000,  
		  url: 'http://'+ serverIP +'/'+serviceName+'/GetPlanList34ByM',//获取该病人所有的计划
		  async:false,
		  data: {PatientId:PatientId,
				 Module:"M1"},//输入变量
		  beforeSend: function(){},
		  success: function(result)
		  { 
				var i = 0;
				option = $(result).find("PlanDeatil").each(function()
				{
					PlanNumber[i] = $(this).find("PlanNo").text();
					Start[i] = $(this).find("StartDate").text();
					End[i] = $(this).find("EndDate").text();
					i++;
				}); 
				//alert(PlanNumber);
				if(d>=Start[0] && d<=End[0])//今天在某计划的开始和结束之间，说明有正在执行的计划,把PlanNumber[0]到PlanNumber[a]这些本月的计划取出其依从率及对应的日期
				{							//默认如果有正在执行的计划，则后面无计划	
					//alert("有正在执行的计划")
					for(var a=0 ; a<=PlanNumber.length; a++)	
					{
						if(Start[a]<=first)
						{break;}//一直找到覆盖该月第一天的计划	0-a
					}
					for(var x=0;a>=0;a--)
					{
							$.ajax
							({  
								type: "POST",
								dataType: "xml",
								timeout: 30000,  
								url: 'http://'+ serverIP +'/'+serviceName+'/GetAllComplianceListByPeriod',
								async:false,
								data: {PatientId:PatientId,
									   PlanNo:PlanNumber[a],
									   StartDate:Start[a],
									   EndDate:End[a]},//输入变量
								beforeSend: function(){},
								success: function(result)
								{ 
								   
									option = $(result).find("Table1").each(function()
									{
										date[x] = $(this).find("Date").text();
										Compliance[x] = $(this).find("Compliance").text();
										x++;
									});
									
								}
							})
					}
				}				
				else//没有正在执行的计划把PlanNumber[a]到PlanNumber[b]这些本月的计划取出其依从率及对应的日期
				{
					aaa:
					for(var a=0 ; a<=PlanNumber.length; a++)	
					{
						if(End[a]>=first && End[a]<=d)
						{
							for(var b=a;b<=PlanNumber.length;b++)
							{
								if((Start[b]<=first && End[b]>=first) ||(Start[b]>=first && End[b+1]<=first) || (b+1>=PlanNumber.length))
								{break aaa;}	//一直找到覆盖该月第一天的计划	a-b
							}		
						}	
					}
					//alert(a);
					//alert(b);
					for(var x=0;b>=a;b--)
					{
							$.ajax
							({  
								type: "POST",
								dataType: "xml",
								timeout: 30000,  
								url: 'http://'+ serverIP +'/'+serviceName+'/GetAllComplianceListByPeriod',
								async:false,
								data: {PatientId:PatientId,
									   PlanNo:PlanNumber[b],
									   StartDate:Start[b],
									   EndDate:End[b]},//输入变量
								beforeSend: function(){},
								success: function(result)
								{ 
									option = $(result).find("Table1").each(function()
									{
										date[x] = $(this).find("Date").text();
										Compliance[x] = $(this).find("Compliance").text();
										x++;
									});
									
								}
							})
					}	
					//alert(date);
				}
				//alert(date);
				//alert(Compliance);
				
				//经过上面的if else之后，该月的依从率情况都在Compliance和Date数组中按序排好了				
				if(first<=date[0])//计划没有跨月，可在当前月全部显示
				{				
					for(var a=0;a<=i;a++)
				{
					if(date[a]<=first+31)//不让五月一号的显示在四月1号
					{
						if(Compliance[a]==0)
						{
							var d3 = date[a]%100;
							var hang = Math.ceil(((d3+blank)/7)-1);
							var lie = (d3+blank)%7;
							if(lie==0)
							{lie=6}
							else
							{lie=lie-1}
							var tab=document.getElementById("idCalendar"); 
							tab.rows[hang].cells[lie].className = "notatall";
						}
						else if(Compliance[a]==1)
						{
							var d3 = date[a]%100;
							var hang = Math.ceil(((d3+blank)/7)-1);
							var lie = (d3+blank)%7;
							if(lie==0)
							{lie=6}
							else
							{lie=lie-1}
							var tab=document.getElementById("idCalendar"); 
							tab.rows[hang].cells[lie].className = "perfect";
						}
						else
						{
							var d3 = date[a]%100;
							var hang = Math.ceil(((d3+blank)/7)-1);
							var lie = (d3+blank)%7;
							if(lie==0)
							{lie=6}
							else
							{lie=lie-1}
							var tab=document.getElementById("idCalendar"); 
							tab.rows[hang].cells[lie].className = "part";
						}
					}
			    }
				}
				else
				{
					for(var k=0;k<=i;k++)
				{
					if(date[k]==first){break;}
				}
				for(;k<i;k++)
				{
					if(Compliance[k]==0)
					{
						var d3 = date[k]%100;
						var hang = Math.ceil(((d3+blank)/7)-1);
						var lie = (d3+blank)%7;
						if(lie==0)
						{lie=6}
						else
						{lie=lie-1}
					    var tab=document.getElementById("idCalendar"); 
						tab.rows[hang].cells[lie].className = "notatall";
					}
					else if(Compliance[k]==1)
					{
						var d3 = date[k]%100;
						var hang = Math.ceil(((d3+blank)/7)-1);
						var lie = (d3+blank)%7;
						if(lie==0)
						{lie=6}
						else
						{lie=lie-1}
					    var tab=document.getElementById("idCalendar"); 
						tab.rows[hang].cells[lie].className = "perfect";
					}
					else
					{
						var d3 = date[k]%100;
						var hang = Math.ceil(((d3+blank)/7)-1);
						var lie = (d3+blank)%7;
						if(lie==0)
						{lie=6}
						else
						{lie=lie-1}
					    var tab=document.getElementById("idCalendar"); 
						tab.rows[hang].cells[lie].className = "part";
					}
			    }
				
				}
		  }, 
		  error: function(msg) {alert("GetCompliance有误");}
	  });
	  return option;	
}

//点击往前箭头加载上个月
function LastNextMonth()
{
	var year=document.getElementById("idCalendarYear");
	year=year.innerText;
	var month=document.getElementById("idCalendarMonth");
	month=month.innerText;
	var first=year*10000+month*100+1;
	var day = new Date(year,month,0);
	//alert(day);
	day=day.getDate();
    var d = year*10000+month*100+day;//获取当月最后一天日期
	GetCompliance(PatientId, Module, d, first);
} 
