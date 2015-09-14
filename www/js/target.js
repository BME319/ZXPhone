// JavaScript Document

//前一页面传递参数的接收函数GetQueryString
/*	function GetQueryString(name){
     	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     	var r = window.location.search.substr(1).match(reg);
     	if(r!=null)return  unescape(r[2]); return null;
	}*/

 function GetImplementationForPhone(PatientId, Module){
	 chart="";
     document.getElementById("chartdiv").innerHTML="";
	 
	$.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetImplementationForPhone',
		async:false,
        data: {PatientId:PatientId, 
		        Module:Module,
			  },
		beforeSend: function(){
			$("#alertTextDiv").css("display","none");
			$("#yEPlan").css("visibility","hidden");
			$("#graph_loading").css("display","block");
			
			},
        success: function(data) {
			if((data.NowPlanNo== null) || (data.NowPlanNo== ""))  //当前无计划
			{
				
				$("#alertText").text("当前没有正在执行的计划");
				$("#graph_loading").css("display","none");
			    $("#alertTextDiv").css("display","block");
			}
			else
			{  	
			  if((data.ChartData.GraphList.length>0) && (data.ChartData.GraphList!=null))                  //图表有数据
			  {	
			  	   //计划起止日期   	 
				   NowPlanNo=data.NowPlanNo; 
	               StartDate=data.StartDate;
                   EndDate=data.EndDate;
				
                   //进度、依从率
			       //animate(data.ProgressRate, data.RemainingDays);
				   
				     var proText="计划进度："+data.ProgressRate+"%";
		          // $(".last").find("span").text(proText);
				   $("#planRate").text(proText);
				   
			       var RemainingDays="，离结束还有"+data.RemainingDays+"天";
			       $("#RemainingDays").text(RemainingDays);
	
	               //体征切换下拉框
				  var str_option='';
				  for(var i=0;i<data.SignList.length;i++)
				  {
					  var signid="signList_"+(i+1);
					  str_option+='<option value="'+data.SignList[i].SignCode+'" id="'+signid+'">'+data.SignList[i].SignName+'</option>';
				  }
		 
				  str_option+='';
				  $('#sign_switch').append(str_option); 
				  $("#sign_switch").selectmenu('refresh', true);
	
	              //收缩压的起始值，目标值必须有！
				if(((data.ChartData.GraphGuide.original==null)||(data.ChartData.GraphGuide.original=="")) && ((data.ChartData.GraphGuide.target==null)||(data.ChartData.GraphGuide.target=="")))
				{
					$("#ori_tarDiv").css("display","none");
				}
				else
				{
			        $("#BPoriginal").text(data.ChartData.GraphGuide.original);
	                $("#BPtarget").text(data.ChartData.GraphGuide.target);
					$("#ori_tarDiv").css("display","block");
				}

			        //✔ ✘ ' 处理 
				   for(var m=0;m<data.ChartData.GraphList.length;m++)
				   {	
				       var regS = new RegExp("noncomplete","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS, "✘");
		               var regS1 = new RegExp("complete","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS1, "✔");
				       var regS2 = new RegExp("###","g");
			           data.ChartData.GraphList[m].DrugDescription=data.ChartData.GraphList[m].DrugDescription.toString().replace(regS2, "'");
				   }
				   
				   
			       if(data.ChartData.OtherTasks=="1")  //除体征测量外，有无其他任务
				   {
			          createStockChart(data.ChartData);
					  //监听下部图的bullet点 的点击事件
					  //chart.panels[1].addListener("clickGraphItem",showDetailInfo); 
					  setTimeout(function(){chart.panels[1].addListener("clickGraphItem",showDetailInfo); },1000);
					  //监听下部图的横坐标lable 的点击事件
					 //chart.panels[1].categoryAxis.addListener("clickItem",showDetailInfo);
				   }
				   else  //没有其他任务
				   {
					  createStockChartNoOther(data.ChartData);
				   }

				$("#graph_loading").css("display","none");
				$("#yEPlan").css("visibility","visible");
				//$("#yEPlan").css("display","block");
			  }
			  else //无图表数据
			  {
				$("#alertText").text("暂时无数据");
				$("#graph_loading").css("display","none");
			  	$("#alertTextDiv").css("display","block");
			  }
		 }
		                  }, 
       error: function(msg) { alert("Error: GetImplementationForPhone!");
	   },
	   complete: function() {     
                //$("#graph_loading").css("display","none");	    
        } 
     });
  }

	
function showDetailInfo(event)
{
	//alert(event.item.category);
	
	//清空弹框内内容
	//$("#ul_targetDetial li").remove();
	$('#ul_targetDetial').find("li").remove();
	document.getElementById("ul_targetDetial").innerHTML="";
	$('#ul_targetDetial').empty();
	//获取被点击的bullet的时间值，事件格式，许处理成string"20150618"格式传到webservice
	var dateSelected=event.item.category;
	var theyear=dateSelected.getFullYear();
	var themonth=dateSelected.getMonth()+1;  
	if(themonth<10)
	{
		var themonth="0"+themonth.toString();
	}
	var theday=dateSelected.getDate();
	if(theday<10)
	{
		var theday="0"+theday.toString();
	}
	var theDate=theyear.toString()+themonth.toString()+theday.toString();
	
	//alert(PatientId);
	//alert(NowPlanNo);
	//alert(theDate);
	/*
	  //alert(event.item.category);
	  //alert(event.index);  获取点的序号 0~
     var dateSelected= chart.panels[1].categoryAxis.coordinateToDate(2); 
	 //获取X值，再调method获取date 只能在没有缩放的时候使用
	*/
	
	 $.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
	url: 'http://'+ serverIP +'/'+serviceName+'/GetImplementationByDate',
		async:false,
        data: {PatientId:PatientId, 
		        PlanNo:NowPlanNo,
				DateSelected:theDate
			  },
		beforeSend: function(){//alert(dateSelected);
			},
        success: function(data) {
			
		var str="";
		str+='<li data-role="list-divider" style="text-align:center;"> <span>'+data.Date+'</span><span style="margin-left:20px;">'+data.WeekDay+'</span></li>';
		
		//体征
		if(data.VitalTaskComList.length>0)
		{
			str+=' <li ><h3 style="margin-top:-5px;margin-left:-5px;">体征测量</h3>';
		for(var j=0;j<data.VitalTaskComList.length;j++)
		{
			if(data.VitalTaskComList[j].Status=="1"){
			str+='<p style="margin-left:10px;font-size:14px;white-space:pre-wrap;">✔ '+data.VitalTaskComList[j].SignName+'<span style="margin-left:10px;"> '+data.VitalTaskComList[j].Value+''+data.VitalTaskComList[j].Unit+'</span> <span style="margin-left:10px;">'+data.VitalTaskComList[j].Time+'</span></p>';
			}
			else
			{
				str+='<p style="margin-left:10px;font-size:14px;color:red;white-space:pre-wrap;"><b>✘ '+data.VitalTaskComList[j].SignName+'</b></p>';
			}
		}
		str+='</li>'; 
		}
		
		
		//其他任务:生活方式和用药情况
		if(data.TaskComByTypeList.length>0)
		{			
			for(var i=0;i<data.TaskComByTypeList.length;i++)
		    {
				if(data.TaskComByTypeList[i].TaskType =="生活方式aa")  //手机屏幕较小，还是不同行吧 加aa废弃
				{
				  str+=' <li ><h3 style="margin-top:-5px;margin-left:-5px;">'+data.TaskComByTypeList[i].TaskType+'</h3><p style="font-size:14px;white-space:pre-wrap;">';
			  
			 
				 for(var j=0;j<data.TaskComByTypeList[i].TaskComList.length;j++)
				 {
					 
					 if(data.TaskComByTypeList[i].TaskComList[j].TaskStatus=="1")
					{
				  str+='<span style="margin-left:10px;"> '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'✔</span>';
				  
					}
					else
				   {
				  str+='<span style="margin-left:10px;"> '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'✘</span>';
				   }
				}
				str+='</p></li>'; 
			  }
			
			else //用药 药名过长在不同行 与生活方式在同一行样式不一样
			{
				str+=' <li ><h3 style="margin-top:-5px;margin-left:-5px;">'+data.TaskComByTypeList[i].TaskType+'</h3>';
			
				for(var j=0;j<data.TaskComByTypeList[i].TaskComList.length;j++)
				{
					if(data.TaskComByTypeList[i].TaskComList[j].TaskStatus=="1")
					{
						str+='<p style="font-size:14px;white-space:pre-wrap;"><span style="margin-left:10px;">✔ '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'</span></p>';
						
					}
					else
					{
						str+='<p style="font-size:14px;white-space:pre-wrap;"><b><span style="margin-left:10px;color:red;">✘ '+data.TaskComByTypeList[i].TaskComList[j].TaskName+'</span></b></p>';
					}
				}
				str+='</li>'; 
		    }
		}
	 }
     $("#ul_targetDetial").append(str);
    $('#ul_targetDetial').listview('refresh');  
	$("#popupDetail").popup("open");	
		
			}, 
       error: function(msg) {alert("Error: showDetailInfo!");},
	   complete: function() {      
  
        } 
     });

}

      //进度条动态
function animate(a,b){

    var barcolor="barblue";
	$(".charts").each(function(i,item){
		var addStyle=barcolor;
		$(item).addClass(addStyle);
		//var a=$(item).attr("w");
		$(item).animate({
			width: a+"%"
		},1000);
		
	});
		var proText="计划进度：";
		proText+=a+"%";
		//proText+=",距离计划结束还有"+b+"天";
		$(".last").find("span").text(proText);
}


 function createStockChart(ChartData) {
	 $("#chartdiv").height(400);
	   //var minimum=50;
       //图上说明
       //$("#BPoriginal").text(ChartData.GraphGuide.original);
	  // $("#BPtarget").text(ChartData.GraphGuide.target);
       //图
	   chart=AmCharts.makeChart("chartdiv", {
				type: "stock",
				pathToImages: "amcharts-images/",
				dataDateFormat:"YYYYMMDD",
                categoryAxesSettings: {
						//minPeriod: "mm"
						parseDates: true,
						minPeriod:"DD",
						dateFormats:[{
                    period: 'DD',
                    format: 'MM/DD'
                }, {
                    period: 'WW',
                    format: 'MM DD'
                }, {
                    period: 'MM',
                    format: 'MM/DD'
                }, {
                    period: 'YYYY',
                    format: 'YYYY'
                }]
					},
					
				dataSets: [{
					fieldMappings: [{
					fromField: "SignValue",
					toField: "SignValue"
				},{
					fromField: "DrugValue",
					toField: "DrugValue"
				}],
					//color: "#fac314",
					dataProvider: ChartData.GraphList, //数据集   
					//title: "体征和任务依从情况",
					categoryField: "Date"
				}],
              valueAxesSettings:{
					inside:true,
					reversed:false
					//labelsEnabled:true				
				},
				
               PanelsSettings:{   
				   //marginTop:90,
				   //marginRight:90,
				   //panelSpacing:400,
				  // plotAreaBorderAlpha:1,
				  // plotAreaBorderColor:"#000000"
				   //usePrefixes: true,
				   autoMargins:false
			   },
				//autoMargins:false,
				panels: [{
						title: "血压 （单位：mmHg）",
						showCategoryAxis: false,
						percentHeight: 65,
						autoMargins:false,
						//marginTop:300,
						//marginLeft:90,
						//marginRight:90,
						valueAxes: [{
							id:"v1",
							//strictMinMax:true,
							//logarithmic : true,
							//baseValue:115,     //起始值，Y线
							//dashLength: 5,   //虚线
							//title:"血压",
							//axisThickness:4,
							showFirstLabel:true,
							showLastLabel:true,
							//inside:false,
							gridAlpha : 0,
							//labelOffset:0,
							labelsEnabled : false,
							minimum: ChartData.GraphGuide.minimum,  
							maximum: ChartData.GraphGuide.maximum,   
                            //显示上下限不对  解决办法parseFloat(guides[0].minimum
							guides: ChartData.GraphGuide.GuideList  //区域划分
							
						}
						//,{id:"v2",minimum:10}
						],
                       
						categoryAxis: {
							//dashLength: 5	
						},
						stockGraphs: [{
							//type: "line",
							id: "graph1",
                            valueField: "SignValue",
							lineColor: "#EA7500",
							//lineColorField:"SignColor",
							lineThickness : 3,
							lineAlpha:1,
							//connect:false,
							bullet: "round",
							bulletField:"SignShape",
							bulletSize:12,
							//bulletSizeField:"bulletSize",
                            //customBulletField : "customBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 1,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[SignDescription]]",
							//要不要显示时间？[[category]]<br>
				            //labelText:"[[nowDay]][[SBPvalue]]",
							ValueAxis:{
								id:"v1",
								strictMinMax:true,
							//maximum: 190,   //guide的第三和最后
                            //minimum: 65,
							}

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none"
								//autoMargins:false
							}
					},
					{
						title: "任务依从情况",
						showCategoryAxis: true,
						//backgroundColor:"#CC0000",
						percentHeight: 35,
						valueAxes: [{
							id:"v2",
							gridAlpha : 0,
                            axisAlpha : 0,
							labelsEnabled : false
							//minimum: 10,
						}],
                        //dateFormats: "YYYYMMDD",
						categoryAxis: {		
							//dashLength: 5
						},
						stockGraphs: [{
							//type: "line",
							id: "graph2",
                            valueField: "DrugValue",
							lineColor: "#FFFFFF",
							lineColorField:"DrugColor",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletSize:20,
							//bulletSizeField:"bulletSize",
                            customBulletField : "DrugBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 2,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[DrugDescription]]",
				            //labelText:"[[drugDescription]]"

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none",				
							}
					}
				],
                balloon:{
					fadeOutDuration:3,   //3秒之后自动消失
					animationDuration:0.1,
					maxWidth:500,  //必须有，不然自排版是乱的
				    textAlign:"left",
					horizontalPadding:12,
					verticalPadding:4,
					fillAlpha:0.8
				},
				chartCursorSettings:{
					usePeriod: "7DD",
					zoomable:false,
					 pan:true,
					//pan:false,
				    //zoomable:true,
					//leaveCursor:"false",
					//cursorPosition:"middle",
					categoryBalloonEnabled:false,
					categoryBalloonAlpha:1,
					categoryBalloonColor:"#ffff",
					categoryBalloonDateFormats:[{period:"YYYY", format:"YYYY"}, {period:"MM", format:"YYYY/MM"}, {period:"WW", format:"YYYY/MM/DD"}, {period:"DD", format:"YYYY/MM/DD"}],
					valueLineEnabled:false,  //水平线
					valueLineBalloonEnabled:false,
					valueBalloonsEnabled: true,  //上下值同时显现
					//graphBulletSize: 1,
					},
			chartScrollbarSettings: {  //时间缩放面板
			            zoomable:false,
					    pan:true,				    
						enabled:true,
						position: "top",
					    autoGridCount: true, //默认
						graph: "graph1",
						graphType:"line",
						graphLineAlpha:1,
						graphFillAlpha:0,
						height:30,
						dragIconHeight:28,
						dragIconWidth:20,
						//usePeriod: "10mm",
						
			  },
				responsive: {   //手机屏幕自适应
                    enabled: true
                   },

			});
		
		//alert(chart.panels[0].valueAxes[0].reversed);
		//chart.addListener("clickStockEvent",objet);				
        // chart.panels[0].valueAxes[0].inside=false;
	    //chart.validateNow();
}
  
  //体征切换
  function selectDataset(ItemCode) {
	  
	  //方案 重新画图 清空chart再赋值
  	  //$("#chartdiv").empty();  //清空子元素
	  //获取当前计划编号
	  $.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetSignInfoByCode',
		async:false,
        data: {PatientId:PatientId, 
		        PlanNo:NowPlanNo,
				ItemCode:ItemCode, 
		        StartDate:StartDate,
				EndDate:EndDate,
			  },
		beforeSend: function(){

			$("#alertTextDiv").css("display","none");
			$("#original_target").css("visibility","hidden");
			//$("#yEPlan").css("visibility","hidden");
			document.getElementById("chartdiv").innerHTML="";
			$("#graph_loading").css("display","block");
			
			},
        success: function(data) {

			chart="";
			
			    //画图
			    if((data.GraphList.length>0) && (data.GraphList!=null))          //图表有数据
			   {
				   //✔ ✘ ' 处理 
				   for(var m=0;m<data.GraphList.length;m++)
				   {	
				       var regS = new RegExp("noncomplete","g");
			           data.GraphList[m].DrugDescription=data.GraphList[m].DrugDescription.toString().replace(regS, "✘");
		               var regS1 = new RegExp("complete","g");
			           data.GraphList[m].DrugDescription=data.GraphList[m].DrugDescription.toString().replace(regS1, "✔");
				       var regS2 = new RegExp("###","g");
			           data.GraphList[m].DrugDescription=data.GraphList[m].DrugDescription.toString().replace(regS2, "'");
				   }
				   
				//输入画图数据和分级规则
				  if(data.OtherTasks=="1")  //除体征测量外，有其他任务
				  {
			          createStockChart(data);
					  chart.panels[1].addListener("clickGraphItem",showDetailInfo); 
				  }
				  else  //没有其他任务
				  {
					  createStockChartNoOther(data);
				  }  
				  
				  //切换上部图title
                if((ItemCode=="Bloodpressure|Bloodpressure_1")||(ItemCode=="Bloodpressure|Bloodpressure_2"))
				  {
					  chart.panels[0].title="血压 （单位：mmHg）";
				  }
				  else if(ItemCode=="Pulserate|Pulserate_1")
				  {
					  chart.panels[0].title="脉率 （单位：次/分）";
				  }
				  chart.validateNow();

			}


           $("#graph_loading").css("display","none");
		   $("#yEPlan").css("visibility","visible");
		    
			 //图上说明	  放在后面 因为yEPlan包含了它 yEPlan也在隐藏和显示操作
		     //类似脉率没有初始值和目标值，则隐藏
				  if(((data.GraphGuide.original==null)||(data.GraphGuide.original=="")) && ((data.GraphGuide.target==null)||(data.GraphGuide.target=="")))
				{
					$("#ori_tarDiv").css("display","none");
				}
				else
				{
					//$("#originalDiv").css("visibility","visible");
				    //$("#targetDiv").css("visibility","visible");
			        $("#BPoriginal").text(data.GraphGuide.original);
	                $("#BPtarget").text(data.GraphGuide.target);
					$("#ori_tarDiv").css("display","block");
				}
				  
			   
			 }, 
       error: function(msg) {
		   $("#load_after").css("visibility","hidden");
		   alert("Error: selectDataset !");
		   },
	   complete: function() {      
    
        } 
     });
  }


 //没有其他任务
  function createStockChartNoOther(ChartData) {
	   $("#chartdiv").height(300);
	   //var minimum=50;
       //图上说明
       //$("#BPoriginal").text(ChartData.GraphGuide.original);
	   //$("#BPtarget").text(ChartData.GraphGuide.target);
       //图
	   chart=AmCharts.makeChart("chartdiv", {
				type: "stock",
				pathToImages: "amcharts-images/",
				dataDateFormat:"YYYYMMDD",
                categoryAxesSettings: {
						//minPeriod: "mm"
						parseDates: true,
						minPeriod:"DD",
						dateFormats:[{
                    period: 'DD',
                    format: 'MM/DD'
                }, {
                    period: 'WW',
                    format: 'MM DD'
                }, {
                    period: 'MM',
                    format: 'MM/DD'
                }, {
                    period: 'YYYY',
                    format: 'YYYY'
                }]
					},
					
				dataSets: [{
					fieldMappings: [{
					fromField: "SignValue",
					toField: "SignValue"
				},{
					fromField: "DrugValue",
					toField: "DrugValue"
				}],
					//color: "#fac314",
					dataProvider: ChartData.GraphList, //数据集   
					//title: "体征和任务依从情况",
					categoryField: "Date"
				}],
              valueAxesSettings:{
					inside:true,
					reversed:false
					//labelsEnabled:true				
				},
				
               PanelsSettings:{   
				   //marginTop:90,
				   //marginRight:90,
				   //panelSpacing:400,
				  // plotAreaBorderAlpha:1,
				  // plotAreaBorderColor:"#000000"
				   //usePrefixes: true,
				   autoMargins:false
			   },
				//autoMargins:false,
				panels: [{
						title: "血压 （单位：mmHg）",
						showCategoryAxis: true,
						percentHeight: 70,
						autoMargins:false,
						//marginTop:300,
						//marginLeft:90,
						//marginRight:90,
						valueAxes: [{
							id:"v1",
							//strictMinMax:true,
							//logarithmic : true,
							//baseValue:115,     //起始值，Y线
							//dashLength: 5,   //虚线
							//title:"血压",
							//axisThickness:4,
							showFirstLabel:true,
							showLastLabel:true,
							//inside:false,
							gridAlpha : 0,
							//labelOffset:0,
							labelsEnabled : false,
							minimum: ChartData.GraphGuide.minimum,  
							maximum: ChartData.GraphGuide.maximum,   
                            //显示上下限不对  解决办法parseFloat(guides[0].minimum
							guides: ChartData.GraphGuide.GuideList  //区域划分
							
						}
						//,{id:"v2",minimum:10}
						],
                       
						categoryAxis: {
							//dashLength: 5	
						},
						stockGraphs: [{
							//type: "line",
							id: "graph1",
                            valueField: "SignValue",
							//lineColor: "#7f8da9",
							lineColor: "#EA7500",
							//lineColorField:"SignColor",
							lineThickness : 3,
							lineAlpha:1,
							//connect:false,
							bullet: "round",
							bulletField:"SignShape",
							bulletSize:12,
							//bulletSizeField:"bulletSize",
                            //customBulletField : "customBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 1,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[SignDescription]]",
							//要不要显示时间？[[category]]<br>
				            //labelText:"[[nowDay]][[SBPvalue]]",
							ValueAxis:{
								id:"v1",
								strictMinMax:true,
							//maximum: 190,   //guide的第三和最后
                            //minimum: 65,
							}

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none"
								//autoMargins:false
							}
					}	
				],
                balloon:{
					fadeOutDuration:3,
					animationDuration:0.1,
					maxWidth:400,
				    textAlign:"left",
					horizontalPadding:12,
					verticalPadding:4,
					fillAlpha:0.8
				},
				chartCursorSettings:{
					zoomable:false,
					pan:true,
					usePeriod: "7DD",
					//pan:false,
				    //zoomable:true,
					//leaveCursor:"false",
					//cursorPosition:"middle",
					categoryBalloonEnabled:false,
					categoryBalloonAlpha:1,
					categoryBalloonColor:"#ffff",
					categoryBalloonDateFormats:[{period:"YYYY", format:"YYYY"}, {period:"MM", format:"YYYY/MM"}, {period:"WW", format:"YYYY/MM/DD"}, {period:"DD", format:"YYYY/MM/DD"}],
					valueLineEnabled:false,  //水平线
					valueLineBalloonEnabled:false,
					valueBalloonsEnabled: true,  //上下值同时显现
					//graphBulletSize: 1,
					},
			chartScrollbarSettings: {  //时间缩放面板				    
						enabled:true,
						position: "top",
					    autoGridCount: true, //默认
						graph: "graph1",
						graphType:"line",
						graphLineAlpha:1,
						graphFillAlpha:0,
						height:30,
						dragIconHeight:28,
						dragIconWidth:20,
						//usePeriod: "10mm",
						
			  },
				responsive: {   //手机屏幕自适应
                    enabled: true
                   },

			});
		
		//alert(chart.panels[0].valueAxes[0].reversed);
		//chart.addListener("clickStockEvent",objet);				
        // chart.panels[0].valueAxes[0].inside=false;
	    //chart.validateNow();
}

/*BPdetail 函数*/
function GetDetailsReload()
{
	$("#noDetail").css("display","none");
	$("#detail_content").css("display","none");
	$("#detail_loading").css("display","block");
	
	$("#ul_target li").remove(); 
	
	StartDate_detail=0; 
   GetSignsDetailByPeriod();
}


function GetDetails()
{
	if(StartDate_detail==0)
	{
	$("#noDetail").css("display","none");
	$("#detail_content").css("display","none");
	$("#detail_loading").css("display","block");
	
	$("#ul_target li").remove(); 
	
	StartDate_detail=0; 
   GetSignsDetailByPeriod();
	}
}

function GetSignsDetailByPeriod(){
	
	 var Start_mark=0;
	 if(StartDate_detail==0)
	 {
		 var Start_mark=1;
	 }
	$.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetSignsDetailByPeriod',
		async:false,
        data: {PatientId:PatientId, 
		        Module:Module,
				StartDate:StartDate_detail, 
		        Num:7,
			  },
		beforeSend: function(){
			$("#detail_loading").css("display","block");
			},
        success: function(data) {
			
			if(data.SignDetailByDs.length>0)
			{
			     var str='';
				  for(var i=0;i<data.SignDetailByDs.length;i++)
			     {
				     str+='<li data-role="list-divider" >'+data.SignDetailByDs[i].Date+'<span style="margin-left:20px;">'+data.SignDetailByDs[i].WeekDay+' </span><span class="ui-li-count">'+data.SignDetailByDs[i].SignDetailList.length+'</span></li>';
					for(var j=0;j<data.SignDetailByDs[i].SignDetailList.length;j++)
			        {
						if((data.SignDetailByDs[i].SignDetailList[j].SBPValue!="") && (data.SignDetailByDs[i].SignDetailList[j].DBPValue!="") &&(data.SignDetailByDs[i].SignDetailList[j].PulseValue!="") )
						{
							str+='<li style="height:45px;"><p style="margin-top:-10px;"><h3><span style="margin-left:15px;">'+data.SignDetailByDs[i].SignDetailList[j].DetailTime+'</span>  <img alt="血压" src="images/bloodpressure.png" style="width:18px;height:18px;margin-left:18px;" /> <span style="margin-left:10px;">'+data.SignDetailByDs[i].SignDetailList[j].SBPValue+'/'+data.SignDetailByDs[i].SignDetailList[j].DBPValue+'</span><span style="margin-left:10px;">mmHg</span></h3><h3><img alt="脉率" src="images/pulse.png" style="width:18px;height:18px;margin-left:90px;" /> <span style="margin-left:27px;">'+data.SignDetailByDs[i].SignDetailList[j].PulseValue+'</span><span style="margin-left:20px;">次/分</span></h3></p></li>';
						}
						else if(((data.SignDetailByDs[i].SignDetailList[j].SDBPValue!="") || (data.SignDetailByDs[i].SignDetailList[j].DBPValue!="") )&& (data.SignDetailByDs[i].SignDetailList[j].PulseValue=="") )
						{
							str+='<li style="height:20px;"><p style="margin-top:-10px;"><h3><span style="margin-left:15px;">'+data.SignDetailByDs[i].SignDetailList[j].DetailTime+'</span>  <img alt="血压" src="images/bloodpressure.png" style="width:18px;height:18px;margin-left:18px;" /> <span style="margin-left:10px;">'+data.SignDetailByDs[i].SignDetailList[j].SBPValue+'/'+data.SignDetailByDs[i].SignDetailList[j].DBPValue+'</span><span style="margin-left:10px;">mmHg</span></h3></p></li>';
						}
						else if((data.SignDetailByDs[i].SignDetailList[j].SBPValue=="") && (data.SignDetailByDs[i].SignDetailList[j].DBPValue=="") &&(data.SignDetailByDs[i].SignDetailList[j].PulseValue!="") )
						{
							 str+='<li style="height:20px;"><p style="margin-top:-10px;"><h3><span style="margin-left:15px;">'+data.SignDetailByDs[i].SignDetailList[j].DetailTime+'</span><img alt="脉率" src="images/pulse.png" style="width:18px;height:18px;margin-left:23px;" /> <span style="margin-left:25px;">'+data.SignDetailByDs[i].SignDetailList[j].PulseValue+'</span><span style="margin-left:15px;">次/分</span></h3></p></li>';
						}
			        }
				 }
			     $("#ul_target").append(str);
			    //$("#ul_target").trigger('create');
			     //$('#ul_target').listview('refresh');
				 setTimeout(function(){$('#ul_target').listview('refresh');},500);
				 
				  StartDate_detail=data.NextStartDate; 
				    
				  $("#detail_loading").css("display","none"); 
				 $("#detail_content").css("display","block");
				 
				  if(data.NextStartDate == -1)
				 {
					//$("#btn_getmore").css("visibility","hidden");
					$("#btn_getmore").css("display","none"); 
				}
				else
				{
					//$("#btn_getmore").css("visilibity","visible");
				 $("#btn_getmore").css("display","block");
				}
				  
			    
			}
			else
			{
				if(Start_mark== 1)
				{
					
					//$("#btn_getmore").css("visibility","hidden");
					$("#btn_getmore").css("display","none");
					$("#detail_loading").css("display","none"); 
				    $("#noDetail").css("display","block");
				}
				else
				{
					//$("#btn_getmore").css("visibility","hidden");
					$("#detail_loading").css("display","none"); 
				    $("#btn_getmore").css("display","none");
				}
			}
		                  }, 
       error: function(msg) {alert("Error: GetSignsDetailByPeriod!");},
	   complete: function() {      
             // $("div[data-role=content] ul").listview();    
			  //$("div[data-role=content] ul li").listview("refresh");    
        } 
     });
  }
  


  
  function BacktoLogOn(){
		window.localStorage.clear();
		window.location.href='LogOn-Phone.html';
	}
	
	



	
	
	