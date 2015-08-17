/**********************全局变量************************/
 //var serverIP = '10.12.43.94:8089';
 //var serverIP = '10.12.43.101:8088';
 //var serverIP = '10.12.43.103:8085';
  //var serverIP = '10.12.43.63:8088';
 //var serverIP = '10.12.43.66:8088';
 //var serverIP = '10.13.22.66:8088';
 var IP = "10.12.43.67";
 var Port = "8088";
 var serverIP = IP + ":" + Port;
 var serviceName = 'Services.asmx';


/**********************连接webservice************************/
  function ConnectWebserivce()
{
	var ret = false;
  $.ajax({
    type: "POST",
    //contentType: "text/xml; charset=utf-8",
    dataType: "xml",
    timeout: 30000,
    //url: 'http://10.12.43.29:8012/Service1.asmx/TestGetCacheConnection',
    //url: 'http://'+ serverIP +'/Service1.asmx/TestGetCacheConnection',
	url: 'http://'+ serverIP +'/'+serviceName+'/TestGetCacheConnection',

    async: false,
    beforeSend: function() {
},
    success: function(result) {
      if ($(result).text())
        console.log('Connection is Done!');
        ret= true;
    },
    error: function(msg) {
      console.log('Connection is failed!');
      ret =  false;
    }
  });
  return ret;
}

/**********************GetServerTime to check ajaxrefresh************************/

function ajaxrefresh()
	{ 
	var ret = "";
	  $.ajax({
		type: "POST",
		contentType: "text/xml; charset=utf-8",
		dataType: "xml",
		timeout: 30000,
		//url: 'http://10.12.43.29:8012/Service1.asmx/TestGetCacheConnection',
		//url: 'http://10.12.43.29:8085/Services.asmx/GetServerTime',
		url: 'http://'+ serverIP +'/'+serviceName+'/GetServerTime',

		async: true,
		beforeSend: function() {
	},
		success: function(result) {
		  if ($(result).text())
			$('#partialrefresh').text($(result).text());
			ret = $(result).text();
			//console.log(ret);
			console.log('GetServerTime is '+$(result).text());     
		},
		error: function(msg) {
		  console.log('GetServerTime is failed!');
		}
	  });
	  return ret;
	}

	
/*******************pull to refresh **********************/
	var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

/**
 * 下拉刷新 （自定义实现此方法）
 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
 */
function pullDownAction () {
	onDeviceReady();
	myScroll.refresh();	// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion) 
}

/**
 * 滚动翻页 （自定义实现此方法）
 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
 */
function pullUpAction () {
	
	//myScroll.refresh();
}

/**
 * 初始化iScroll控件
 */
function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll('wrapper', {
		scrollbarClass: 'myScrollbar', /* 重要样式 */
		useTransition: true, /* 此属性不知用意，本人从true改为false */
		topOffset: pullDownOffset,
		vScrollbar:false,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			} else if (pullUpEl.className.match('loading')) {
				//pullUpEl.className = '';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				//pullUpEl.className = 'flip';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				//pullUpEl.className = '';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				//this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				//pullUpEl.className = 'loading';
				//pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
				//pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}