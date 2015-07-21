
document.addEventListener('deviceready', function () {
	
	var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
	
	var Myselection = document.getElementById("switch").childNodes;
	
	var i = 0;

	
		extraInfo.isBTEnabled(null,
		function(r){
			while(r=="")
			{
				//alert(1);
				i++;
				if (i == 1000)
				{
					r == "error";
					i = 0;
					break;	
				}
			}
			if (r == "true")
			{
				//alert("true");
				Myselection[1].selected = false;
				Myselection[3].selected = true;
				//alert($("#switch").val());
				$("#switch").slider("refresh");
				
				document.getElementById("divider1").style.display = "block";
				document.getElementById("loading1").style.display = "block";
				document.getElementById("Devicelist1").style.display = "block";
				document.getElementById("loading2").style.display = "none";
				document.getElementById("Devicelist2").style.display = "block";
				document.getElementById("ListDevice").style.display = "block";
				$("#ListDevice").removeAttr("disabled");
				ListBoundDevice();
				
			}
			else if (r == "false")
			{
				//alert("false");
				Myselection[1].selected = true;
				Myselection[3].selected = false;
				//alert($("#switch").val());
				$("#switch").slider("refresh");
			}
			else if (r == "error")
			{
				alert("状态获取失败");	
			}
			//printResult2(r);
			
			//alert($(".selector").val());
		},
		function(e){log(e)}
		);
		//alert(i);

		
	//};
			
//	});
	
	$("#switch").change(function () {
		var test = $(this).children('option:selected').val();
		//alert(test);
		if (test == "on")
		{
			//document.getElementById("labelBT").style.color = "black";
			document.getElementById("divider1").style.display = "block";
			document.getElementById("loading1").style.display = "block";
			document.getElementById("img1").style.display = "block";
			setTimeout(function() {
			extraInfo.enableBT(null,
			function(r){
				setTimeout(function(){
					if (r == "true")
						{
							//alert(r);
							
								ListBoundDevice();
								document.getElementById("Devicelist1").style.display = "block";
								document.getElementById("Devicelist2").style.display = "block";
								document.getElementById("ListDevice").style.display = "block";
								$("#ListDevice").removeAttr("disabled");
							
						}
						else
						{
							alert("打开蓝牙失败");	
						}
				},5000);
				//while(r=="")
//				{
//					alert("1");
//					i++;
//					if (i == 1000)
//					{
//						r = "error";
//						i = 0;
//						//alert(r);
//						break;	
//					}
//				}

			//	for(i=0;i<=1000;i++){
//					//alert("1");
//					//i++;
//					if (i == 1000)
//					{
//						r == "error";
//						i = 0;
//						//alert(r);
//						break;	
//					}
//				}
				
				//alert(r);
				
			},
			function(e){log(e)}
			);	
			},100);

			
		}
		if (test == "off")
		{
			//document.getElementById("labelBT").style.color = "gray";
			extraInfo.disableBT(null,
			function(r){
				while(r=="")
				{
					i++;
					if (i == 1000)
					{
						r == "error";
						i = 0;
						break;	
					}
				}
				if (r == "true")
				{
					document.getElementById("divider1").style.display = "none";
					document.getElementById("loading1").style.display = "none";
					document.getElementById("Devicelist1").style.display = "none";
					document.getElementById("divider2").style.display = "none";
					document.getElementById("loading2").style.display = "none";
					document.getElementById("Devicelist2").style.display = "none";
					document.getElementById("ListDevice").style.display = "none";
					$("#ListDevice").attr("disabled","disabled");
					$("#Devicelist2").empty();
				}
				else
				{
					alert("关闭蓝牙失败");	
				}
			},
			function(e){log(e)}
			);
		}
		
	});
	
	function ListBoundDevice() {
		var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
		document.getElementById("divider1").style.display = "block";
	document.getElementById("loading1").style.display = "block";
	document.getElementById("img1").style.display = "block";
							$("#Devicelist1").empty();
							//alert(2);
							extraInfo.listBoundDevices(null,
								function(r){
									//alert(r);
									while (r == "[ ] ")
									{
										i++;
										if (i == 1000)
										{
											r == "error";
											i = 0;
											break;	
										}
									}
									//alert(3);
									//alert(r);
							setTimeout(function() {
								document.getElementById("loading1").style.display = "none";
								document.getElementById("img1").style.display = "none";
								//document.getElementById("alert3").innerHTML = "设备名称";
								var ss = r.split('"');
								var No = r.split('name');
								var DeviceNo = No.length - 1; 
								//alert(r);
								//alert(DeviceNo);
								if (DeviceNo <= 0)
								{

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
										$("#Devicelist1").append("<p id='"  + add + "' class = 'devicelist' style = 'text-align: left'>" + name + "</p>");	
										
									}
									
									//$(".devicelist").click(function ()
//									{
//										console.log(this);
//										var Add = $(this).attr("id");
//																
//							
//										connect(Add);	 
//									 });
									$("#DeviceList1").trigger("create");
								}
								},
								function(e){log(e)}
							);	
								},3000);
				}
	
	


});

function ListDevice() {
	var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
	document.getElementById("divider2").style.display = "block";
	document.getElementById("loading2").style.display = "block";
	document.getElementById("img2").style.display = "block";
	$("#Devicelist2").empty();
	setTimeout(function() {
		var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
		extraInfo.listDevices(null,
		function(r){
//			while(r == "[ ] ")
//			{
//				i++;
//				if (i == 1000)
//				{
//					r == "error";
//					i = 0;
//					break;	
//				}
//			}
			//alert(r);
			setTimeout(function() {
				document.getElementById("loading2").style.display = "none";
				document.getElementById("img2").style.display = "none";
				//document.getElementById("alert3").innerHTML = "设备名称";
				var ss = r.split('"');
				var No = r.split('name');
				var DeviceNo = No.length - 1; 
				//alert(r);
				//alert(DeviceNo);
				if (DeviceNo <= 0)
				{
					//document.getElementById("alert3").innerHTML = "未能搜索到设备";
	//					$("#DeviceList").append('<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-a" data-rel="back" style="vertical-align:middle">确定</a>');
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
						$("#Devicelist2").append("<a id='"  + add + "' class = 'devicelist'  data-role = 'button' style = 'text-align: left' value = " +name+ ">" + name + "</a>");	
						
					}
					
					$(".devicelist").click(function ()
					{
						console.log(this);
						var Add = $(this).attr("id");
						var Name = 	$(this).attr("value")					
						//alert(Name);
						pair(Add);	 
						setTimeout(function(){
							//alert(1);
							$("#Devicelist1").append("<p id='"  + Add + "' class = 'devicelist' style = 'text-align: left'>" + Name + "</p>");
							$("#DeviceList1").trigger("create");
							//alert(r);	
						},1500);
					 });
					$("#DeviceList2").trigger("create");
				}
			},3000);
		},
		function(e){log(e)}
		);
	},100);
	}
	
	function pair(add) {
		var extraInfo = cordova.require('cn.edu.zju.bme319.cordova.ExtraInfo');
		extraInfo.pairBT(add,
		function(r){
				//alert(r);
			//setTimeout(function() {
//				if (r == "true")
//				{
//					alert("配对成功");	
//				}
//				else
//				{
//					alert("配对失败");	
//				}
//			},3000);
		},
		function(e){log(e)}
		);
	}