$package('IQB.trafficQuery');
IQB.trafficQuery = function(){
	var _grid = null;
	var _tree = null;
	var _this = {
		cache :{
			
		},
		config: {
			action: {//页面请求参数
				exports: urls['cfm'] + '/trafficManage/exportTrafficManageInfoList'
  			},
			event: {//按钮绑定函数，不定义的话采用默认
				reset: function(){
					_grid.handler.reset();
					$('.merchantNo').val('');
					$(".merch").attr('merchantNo','');
					$(".merch").attr('orgCode','');
					$('select[name="carStatus"]').val(null).trigger('change');
					$('select[name="processStatus"]').val(null).trigger('change');
				},
				search:function(){
					var orgCode = $(".merch").attr('orgCode');
					_this.cache.orgCode = orgCode;
					var merchantNo = $(".merch").attr('merchantNo');
					_this.cache.merchantNo = merchantNo;
					$("#datagrid").datagrid2
							({
							 url: urls['cfm'] + '/trafficManage/selectTrafficManageInfoList',
							 singleCheck: true,
							 queryParams : 
								 $.extend({}, $("#searchForm").serializeObject(), 
										 {'orgCode': orgCode,'merchantNo':merchantNo}),
								 loadSuccess:function(date){
						   				//笔数
						   				$("#allTerms").val(date.iqbResult.resultTotal.count);
						   			}
							});
				}
			},
  			dataGrid: {//表格参数  				
	   			url: urls['cfm'] + '/trafficManage/selectTrafficManageInfoList',
	   			singleCheck: true,
	   			loadSuccess:function(date){
	   				//笔数
	   				$("#allTerms").val(date.iqbResult.resultTotal.count);
	   			}
			}
		},
		approveDetail : function(data){
			var url = window.location.pathname;
			var param = window.parent.IQB.main2.fetchCache(url);
			var rowIndex = data;
			var row = $("#datagrid").datagrid2('getRow', rowIndex);
			var orderId = row.orderId;
			window.parent.IQB.main2.openTab("traffic-detail", "详情", '/etep.web/view/trafficManage/trafficQueryDetail.html?orderId=' + orderId, true, true, {lastTab: param});
		},
		initSelect : function(){
			IQB.getDictListByDictType2('carStatus', 'carStatus');
			$('select[name="carStatus"]').select2({minimumResultsForSearch: 'Infinity', theme: 'bootstrap'});
			IQB.getDictListByDictType2('processStatus', 'CASEPROGRESS');
			$('select[name="processStatus"]').select2({minimumResultsForSearch: 'Infinity', theme: 'bootstrap'});
		},
		exports : function(){
			var merchNames = $('#merchNames').val();
			var merchantNo = $('.merchantNo').val();
			var orgCode = $(".merch").attr('orgCode');
			var orderId = $("input[name='orderId']").val();
			var realName = $("input[name='realName']").val();
			var regId = $("input[name='regId']").val();
			var checkStatus = $("select[name='checkStatus']").val();		
			var carStatus = $("select[name='carStatus']").val();
			var processStatus = $("select[name='processStatus']").val();
			var carInspectTime = $("input[name='carInspectTime']").val();
			var comInsOverTime = $("input[name='comInsOverTime']").val();
			var comTraAccOverTime = $("input[name='comTraAccOverTime']").val();
			var carNo = $("input[name='carNo']").val();
			var plate = $("input[name='plate']").val();
			var datas = "?merchNames= "+ merchNames +" &merchantNo=" + merchantNo +" &orgCode=" + orgCode + '&orderId=' + orderId + '&realName=' + realName + '&regId=' + regId +
			            '&checkStatus=' + checkStatus +'&carStatus=' + carStatus + '&processStatus=' + processStatus + '&carInspectTime=' + carInspectTime + '&comInsOverTime=' + comInsOverTime +
			            '&comTraAccOverTime=' + comTraAccOverTime +'&carNo=' + carNo +'&plate=' + plate;
			var urls = encodeURI(_this.config.action.exports + datas);
            $("#btn-export").attr("href",urls);
		},
		init: function(){ 
			_grid = new DataGrid2(_this.config); 
			_grid.init();//初始化按钮、表格
			_this.initSelect();
			//导出
			$('#btn-export').unbind('click').on('click',function(){
				_this.exports();
			});
		}
	}
	return _this;
}();

$(function(){
	//页面初始化
	IQB.trafficQuery.init();
	datepicker(comTraAccOverTime);
	datepicker(carInspectTime);
	datepicker(comInsOverTime);
});		
/*显示日历*/ 
function datepicker(id){
	var date_ipt = $(id)
	$(id).datetimepicker({
	    lang:'ch',
	    timepicker:false,
	    format:'Y-m-d',
		allowBlank: true
	});
};