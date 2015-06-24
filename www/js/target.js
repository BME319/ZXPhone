// JavaScript Document

//前一页面传递参数的接收函数GetQueryString
	function GetQueryString(name){
     	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     	var r = window.location.search.substr(1).match(reg);
     	if(r!=null)return  unescape(r[2]); return null;
	}

 function GetImplementationForPhone(PatientId, Module){
	 //需要重新画图，改变chart、guide	 
	$.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetImplementationForPhone',
		//async:false,
        data: {PatientId:PatientId, 
		        Module:Module,
			  },
		beforeSend: function(){
			$("#alertTextDiv").css("display","none");
			$("#yEPlan").css("visibility","hidden");
			$("#graph_loading").css("display","block");
			
			},
        success: function(data) {
			if((data.chartData== null) ||  (data.chartData.length== 0))  //当前无计划
			{
				
				$("#alertText").text("当前没有正在执行的计划");
				$("#graph_loading").css("display","none");
			    $("#alertTextDiv").css("display","block");
			}
			else
			{  	
			  if((data.chartData.graphList.length>0) && (data.chartData.graphList!=null))//有图表数据
			  {		     	  
	            StartDate=data.StartDate;
                EndDate=data.EndDate;


				// ✘处理 
				for(var m=0;m<data.chartData.graphList.length;m++)
				{
					
				var regS = new RegExp("noncomplete","g");
			    data.chartData.graphList[m].drugDescription=data.chartData.graphList[m].drugDescription.toString().replace(regS, "✘");
		        var regS1 = new RegExp("complete","g");
			    data.chartData.graphList[m].drugDescription=data.chartData.graphList[m].drugDescription.toString().replace(regS1, "");
				 var regS2 = new RegExp("###","g");
			    data.chartData.graphList[m].drugDescription=data.chartData.graphList[m].drugDescription.toString().replace(regS2, "'");
				
				}
			     //进度、依从率
			    animate(data.ProgressRate, data.RemainingDays);
			    var RemainingDays="距离计划结束还有"+data.RemainingDays+"天";
			     $("#RemainingDays").text(RemainingDays);
			    //var CompliacneValue="最近一周依从率为："+data.CompliacneValue;
			    //$("#CompliacneValue").text(CompliacneValue);
			
			    //画图
			    guides=data.chartData.BPGuide; //guide需要传出
				createStockChart(data.chartData.graphList, 0);
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
       error: function(msg) {//alert("Error!");
	   },
	   complete: function() {   
	      
                //$("#graph_loading").css("display","none");
			    
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
		var proText="进度：";
		proText+=a+"%";
		//proText+=",距离计划结束还有"+b+"天";
		$(".last").find("span").text(proText);
}


function createStockChart(chartData,d) {
     //alert(1);
	 $("#BPoriginal").text(guides[0].original);
	   $("#BPtarget").text(guides[0].target);
	   
	   chart=AmCharts.makeChart("chartdiv", {
				type: "stock",
				pathToImages: "amcharts-images/",
				dataDateFormat:"YYYYMMDD",
				//mouseWheelScrollEnabled:true,
				//extendToFullPeriod:false,
                categoryAxesSettings: {
						//minPeriod: "mm"
						markPeriodChange:false,
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
					fromField: "SBPvalue",
					toField: "SBPvalue"
				}, {
					fromField: "DBPvalue",
					toField: "DBPvalue"
				},{
					fromField: "drugValue",
					toField: "drugValue"
				}],
					//color: "#fac314",
					dataProvider: chartData,   //输入的变量
					//title: "血压和用药",
					categoryField: "date"
				}],
              valueAxesSettings:{
					inside:true,
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
						percentHeight: 60,
						autoMargins:false,
						//marginTop:300,
						//marginLeft:90,
						//marginRight:90,
						valueAxes: [{
							id:"v1",
							strictMinMax:true,
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
							maximum: guides[0].maximum,   
                            minimum: 60,    //显示下限
							guides: guides[0].Guides   //区域划分！
							
						}],
                       
						categoryAxis: {
							
							//dashLength: 5	
						},
						stockGraphs: [{
							//type: "line",
							id: "graph1",
                            valueField: "SBPvalue",
							//lineColor: "#7f8da9",
							lineColorField:"SBPlineColor",
							//bulletColor:"#7f8da9",
							lineThickness : 0,
							lineAlpha:0,
							bullet: "round",
							bulletField:"SBPbulletShape",
							bulletSize:12,
							//bulletSizeField:"bulletSize",
                            //customBulletField : "customBullet", //客制化
                            bulletBorderColor:"#777777",
                            bulletBorderThickness : 1,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "<b><span style='font-size:14px;'>[[SBPvalue]] </span></b>/[[DBPvalue]]<br>[[category]]",
				            //labelText:"[[nowDay]][[SBPvalue]]",
							
							//ValueAxis:{
								//id:"v1",
							//maximum: 190,   //guide的第三和最后
                            //minimum: 65,}

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none"
								//autoMargins:false
							}
					},
					{
						title: "用药情况",
						showCategoryAxis: true,
						//backgroundColor:"#CC0000",
						percentHeight: 20,
						valueAxes: [{
							id:"v2",
							gridAlpha : 0,
                            axisAlpha : 0,
							labelsEnabled : false
						}],
                        //dateFormats: "YYYYMMDD",
						categoryAxis: {		
							//dashLength: 5
						},
						stockGraphs: [{
							//type: "line",
							id: "graph2",
                            valueField: "drugValue",
							lineColor: "#7f8da9",
							lineColorField:"drugColor",
							lineThickness : 0,
						    lineAlpha:0,					
							bullet: "round",
							bulletSize:20,
							//bulletSizeField:"bulletSize",
                            customBulletField : "drugBullet", //客制化
                            bulletBorderColor : "#FFFFFF",
                            bulletBorderThickness : 2,
                            bulletBorderAlpha : 1,		
							showBalloon: true,		
                            balloonText: "[[category]]<br>[[drugDescription]]",
				            //labelText:"[[drugDescription]]"

						}],
							stockLegend: {     //有这个才能显示title
								valueTextRegular: " ",
								markerType: "none",				
							}
					}
				],
                balloon:{
					fadeOutDuration:3,
					animationDuration:0.1,
					//fixedPosition:true, //
				},
				chartCursorSettings:{
					zoomable:false,
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
						enabled:false,
						//position: "top",
					    //autoGridCount: true, //默认
						//graph: "graph1",
						//graphType:"line",
						//graphLineAlpha:1,
						//graphFillAlpha:0,
						//height:30,
						//dragIconHeight:28,
						//dragIconWidth:20
						//usePeriod: "10mm",
						
			  },
				responsive: {   //手机屏幕自适应
                    enabled: true
                   },

			});
			
		//chart.addListener("clickStockEvent",objet);				
          // chart.panels[0].valueAxes[0].inside=false;
	      //chart.validateNow();
}



  //切换血压
  function selectDataset(d) {
	  
	   $("#BPoriginal").text(guides[d].original);
	   $("#BPtarget").text(guides[d].target);
	 if(d=="1")
	 { 
	chart.panels[0].valueAxes[0].guides=guides[d].Guides;
	chart.panels[0].valueAxes[0].maximum=guides[d].maximum;
	chart.panels[0].valueAxes[0].minimum=guides[d].minimum;
	chart.panels[0].stockGraphs[0].valueField="DBPvalue";
	chart.panels[0].stockGraphs[0].lineColorField="DBPlineColor";
	chart.panels[0].stockGraphs[0].bulletField="DBPbulletShape";
	chart.panels[0].stockGraphs[0].balloonText= "<b><span style='font-size:14px;'>[[DBPvalue]] </span></b>/[[SBPvalue]]<br>[[category]]";
	//chart.panels[0].stockGraphs[0].labelText="[[nowDay]][[DBPvalue]]";
	}
	else
	{
	chart.panels[0].valueAxes[0].guides=guides[d].Guides;
	chart.panels[0].valueAxes[0].maximum=guides[d].maximum;
	chart.panels[0].valueAxes[0].minimum=guides[d].minimum;
	chart.panels[0].stockGraphs[0].valueField="SBPvalue";
	chart.panels[0].stockGraphs[0].lineColorField="SBPlineColor";
	chart.panels[0].stockGraphs[0].bulletField="SBPbulletShape";
	chart.panels[0].stockGraphs[0].balloonText= "<b><span style='font-size:14px;'>[[DBPvalue]] </span></b>/[[DBPvalue]]<br>[[category]]";
	//chart.panels[0].stockGraphs[0].labelText="[[nowDay]][[DBPvalue]]";
		}
	chart.validateNow();

}

/*BPdetail 函数*/

function GetBPdetail()
{
	$("#noDetail").css("display","none");
	$("#detail_content").css("display","none");
	$("#detail_loading").css("display","block");
		
	if((StartDate==0) && (EndDate==0))
	{	
	   $("#detail_loading").css("display","none");	
		$("#noDetail").css("display","block");
	}
	else
	{
		
	    $("#ul_target li").remove(); 
		//setTimeout(function(){},5000);
	    GetBPDetailByPeriod(PatientId, "Bloodpressure", StartDate, EndDate);
	    
	}
	
	
	
}




 function GetBPDetailByPeriod(PatientId, ItemType, StartDate, EndDate){
	$.ajax({  
        type: "POST",
        dataType: "json",
		//timeout: 30000,  
		url: 'http://'+ serverIP +'/'+serviceName+'/GetBPDetailByPeriod',
		//async:false,
        data: {PatientId:PatientId, 
		        ItemType:ItemType,
				StartDate:StartDate, 
		        EndDate:EndDate,
			  },
		beforeSend: function(){
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
				       str+='<li><h2><span style="margin-left:20px;">'+data.SignDetailByDs[i].SignDetailList[j].DetailTime+'</span>   <span style="margin-left:30px;">'+data.SignDetailByDs[i].SignDetailList[j].Value+'</span></h2></li>';
			        }
			     }
			     $("#ul_target").append(str);
			    //$("#ul_target").trigger('create');
			     $('#ul_target').listview('refresh');   
			     $("#detail_loading").css("display","none"); 
				 $("#detail_content").css("display","block");
			}
			else
			{
				$("#detail_loading").css("display","none"); 
				$("#noDetail").css("display","block");
			}
		                  }, 
       error: function(msg) {alert("Error!");},
	   complete: function() {      
             // $("div[data-role=content] ul").listview();    
			 //alert("1");
			  //$("div[data-role=content] ul li").listview("refresh");    
			  
        } 
     });
  }
  
  function BacktoLogOn(){
		window.localStorage.clear();
		window.location.href='LogOn-Phone.html';
	}