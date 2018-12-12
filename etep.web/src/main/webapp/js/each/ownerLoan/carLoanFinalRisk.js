function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
var procTaskId = getQueryString('procTaskId');
var procBizId = getQueryString('procBizid');
var procInstId = getQueryString('procInstId');

$package('IQB.carLoanDeptRisk');
IQB.carLoanDeptRisk = function() {
    var _this = {
        cache: {
        	viewer: {}
        }, 
        approve: function() {
			var approveForm = $('#approveForm').serializeObject();
			
			if (approveForm.approveStatus) {
				if (approveForm.approveStatus == "1") {
					if($.trim(approveForm.approveOpinion) == '') {
						approveForm.approveOpinion = "同意";
					}
				} else {
					if($.trim(approveForm.approveOpinion) == '') {
						IQB.alert('审批意见必填');
						exit;
					}
				}
				
				var authData= {}
				authData.procAuthType = "2";
				var variableData = {}
				variableData.procApprStatus = approveForm.approveStatus;
				variableData.procApprOpinion = approveForm.approveOpinion;
				var bizData = {}
				bizData.procBizId=procBizId;
				var procData = {}
				procData.procTaskId = procTaskId;
				var option = {};
				option.authData=authData;
				option.variableData = variableData;
				option.bizData = bizData;
				option.procData = procData;
				
				IQB.post(urls['rootUrl'] + '/WfTask/completeProcess', option, function(result){
					if(result.success=="1") {
						$('#approve-win').modal('hide');
						var url = window.location.pathname;
						var param = window.parent.IQB.main2.fetchCache(url);
						var callback = '_this.clickCloseTab(\'' + param.tabId + '\')';
						var callback2 = '_this.openTab(\'' + param.lastTab.tabId + '\', \'' + param.lastTab.tabTitle + '\', \'' + param.lastTab.tabUrl + '\',' + false + ',' + false + ',' + null + ')';
						window.parent.IQB.main2.call(callback, callback2);
					} else {
						IQB.alert(result.retUserInfo);
					}
				});
				
			} else {
				IQB.alert("请选择审批结果.");
			}
		},
		unassign: function() {
			var authData= {}
			authData.procAuthType = "2";
			var variableData={}
			var bizData={}
			var procData={}
			procData.procTaskId = procTaskId;
			var option = {};
			option.authData=authData;
			option.variableData=variableData;
			option.bizData=bizData;
			option.procData=procData;
			IQB.getById(urls['rootUrl'] + '/WfTask/unclaimProcess', option, function(result) {
				if(result.success=="1") {
					var url = window.location.pathname;
					var param = window.parent.IQB.main2.fetchCache(url);
					var callback = '_this.clickCloseTab(\'' + param.tabId + '\')';
					var callback2 = '_this.openTab(\'' + param.lastTab.tabId + '\', \'' + param.lastTab.tabTitle + '\', \'' + param.lastTab.tabUrl + '\',' + false + ',' + false + ',' + null + ')';
					window.parent.IQB.main2.call(callback, callback2);
				} else {
					IQB.alert(result.retUserInfo);
				}
			});
		},
		uploadFile: function(){
			var files = $('#file').get(0).files;
			var mark = false;
			$.each(files, function(i, n){
				var extensionName = Formatter.getExtensionName(n.name);
				if(Formatter.extensionName.doc.contain(extensionName)){
					mark = true;				
					return false;
				}else if(Formatter.extensionName.pic.contain(extensionName)){
					
				}else{
					mark = true;						
					return false;
				}
			});			
			if(mark){
				$('#file').val('');
				IQB.alert('格式不支持');
				return false;
			}
			
			$('#btn-upload').prop('disabled', true);
			$('#btn-upload').find('span').first().removeClass('fa fa-folder-open-o').addClass('fa fa-spinner fa-pulse');
			$('#uploadForm').prop('action', urls['cfm'] + '/fileUpload/multiUpload/pic/guaranty');
			IQB.postForm($('#uploadForm'), function(result){
				var fileType = $('#file').attr('fileType');	
				var arr = [];
				var html = '';
				$.each(files, function(i, n){
					var option = {};
					option.orderId = window.procBizId;
					option.imgType = fileType;
					option.imgName = n.name;
					option.imgPath = result.iqbResult.result[i];
					arr.push(option);
					html += '<div class="thumbnail float-left" style="width: 145px;">' + 
					      		'<a href="javascript:void(0)"><img src="' + urls['imgUrl'] + option.imgPath + '" alt="' + option.imgName + '" style="width: 135px; height: 135px;" /></a>' +
					      		 '<div class="caption">' +
					      		 	'<h5>' + option.imgName + '</h5><h6 style="float: right;margin-top:-21px"><a filePath="' + option.imgPath + '" onclick="IQB.carLoanDeptRisk.removeFile(event);"><span class="glyphicon glyphicon-trash"></span></a></h6>' +
					      		 '</div>' + 
					      	 '</div>';
				});
				IQB.post(urls['cfm'] + '/image/multiUploadImage', {imgs: arr}, function(resultInfo){
					$('#file').val('');
					$('#btn-upload').prop('disabled', false);
					$('#btn-upload').find('span').first().removeClass('fa fa-spinner fa-pulse').addClass('fa fa-folder-open-o');
					$('#td-' + fileType).append(html);
					if(_this.cache.viewer.viewerFour){
						_this.cache.viewer.viewerFour.update();
					}else{
						_this.cache.viewer.viewerFour = new Viewer(document.getElementById('viewerFour'), {});
					}
				});
			});	
		},
		showFile: function(){
			IQB.post(urls['cfm'] + '/image/getImageList', {orderId: window.procBizId, imgType: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}, function(result){
				var is = false;
				$.each(result.iqbResult.result, function(i, n){
					var extensionName = Formatter.getExtensionName(n.imgName);
					if(Formatter.extensionName.doc.contain(extensionName)){
						
					}else{
						var html = '<div class="thumbnail float-left" style="width: 145px;">' + 
						      			'<a href="javascript:void(0)"><img src="' + urls['imgUrl'] + n.imgPath + '" alt="' + n.imgName + '" style="width: 135px; height: 135px;" /></a>' +
						      			'<div class="caption">' +
						      				'<h5>' + n.imgName + '</h5><h6 style="float: right;margin-top:-21px"></h6>' +
						      			'</div>' + 
						      		'</div>';
						$('#td-' + n.imgType).append(html);
						is = true;
					}
				});
				if(is){
					_this.cache.viewer.viewerOne = new Viewer(document.getElementById('viewerOne'), {});
				}
			});
		},
		showFile1: function(){
			IQB.post(urls['cfm'] + '/image/getImageList', {orderId: window.procBizId, imgType: [17,18,19,20,21,22,23]}, function(result){
				var is = false;
				$.each(result.iqbResult.result, function(i, n){
					var extensionName = Formatter.getExtensionName(n.imgName);
					if(Formatter.extensionName.doc.contain(extensionName)){
						
					}else{
						var html = '<div class="thumbnail float-left" style="width: 145px;">' + 
						      			'<a href="javascript:void(0)"><img src="' + urls['imgUrl'] + n.imgPath + '" alt="' + n.imgName + '" style="width: 135px; height: 135px;" /></a>' +
						      			'<div class="caption">' +
						      				'<h5>' + n.imgName + '</h5><h6 style="float: right;margin-top:-21px"></h6>' +
						      			'</div>' + 
						      		'</div>';
						$('#td-' + n.imgType).append(html);
						is = true;
					}
				});
				if(is){
					_this.cache.viewer.viewerTwo = new Viewer(document.getElementById('viewerTwo'), {});
				}
			});
		},
		showFile2: function(){
			IQB.post(urls['cfm'] + '/image/getImageList', {orderId: window.procBizId, imgType: [24,25,26,27,28,29,30]}, function(result){
				var is = false;
				$.each(result.iqbResult.result, function(i, n){
					var extensionName = Formatter.getExtensionName(n.imgName);
					if(Formatter.extensionName.doc.contain(extensionName)){
						
					}else{
						var html = '<div class="thumbnail float-left" style="width: 145px;">' + 
						      			'<a href="javascript:void(0)"><img src="' + urls['imgUrl'] + n.imgPath + '" alt="' + n.imgName + '" style="width: 135px; height: 135px;" /></a>' +
						      			'<div class="caption">' +
						      				'<h5>' + n.imgName + '</h5><h6 style="float: right;margin-top:-21px"></h6>' +
						      			'</div>' + 
						      		'</div>';
						$('#td-' + n.imgType).append(html);
						is = true;
					}
				});
				if(is){
					_this.cache.viewer.viewerThree = new Viewer(document.getElementById('viewerThree'), {});
				}
			});
		},
		showFile3: function(){
			IQB.post(urls['cfm'] + '/image/getImageList', {orderId: window.procBizId, imgType: [39]}, function(result){
				var is = false;
				$.each(result.iqbResult.result, function(i, n){
					var extensionName = Formatter.getExtensionName(n.imgName);
					if(Formatter.extensionName.doc.contain(extensionName)){
						
					}else{
						var html = '<div class="thumbnail float-left" style="width: 145px;">' + 
						      			'<a href="javascript:void(0)"><img src="' + urls['imgUrl'] + n.imgPath + '" alt="' + n.imgName + '" style="width: 135px; height: 135px;" /></a>' +
						      			'<div class="caption">' +
						      			'<h5>' + n.imgName + '</h5><h6 style="float: right;margin-top:-21px"><a filePath="' + n.imgPath + '" onclick="IQB.carLoanDeptRisk.removeFile(event);"><span class="glyphicon glyphicon-trash"></span></a></h6>' +
						      			'</div>' + 
						      		'</div>';
						$('#td-' + n.imgType).append(html);
						is = true;
					}
				});
				if(is){
					_this.cache.viewer.viewerFour = new Viewer(document.getElementById('viewerFour'), {});
				}
			});
		},
        // 回显赋值
        showHtml: function() {
        	_this.formatterMoney()
        	var data = {
					"orderId": procBizId,
			}
        	IQB.post(urls['cfm'] + '/ownerloan/getBaseInfo' , data,function(result){
        		var result = result.iqbResult.result;
        		$('#orderId').text(Formatter.isNull(procBizId)); 
            	$('#status').text(Formatter.orderStatus(result.status));
        		$('#merchantName').text(result.merchantName);
        		$('#bizType').text(result.bizTypeName);
        		$('#realName').text(result.realName);
        		$('#regId').text(result.regId);
        		$('#idNo').text(result.idNo);
        		if (parseInt(result.idNo.substr(16, 1)) % 2 == 1) {
        			$('#sex').text('男');
        		    } else {
        		    $('#sex').text('女');
        		    }
        			//获取年龄
        			var myDate = new Date();
        			var month = myDate.getMonth() + 1;
        			var day = myDate.getDate();
        			var age = myDate.getFullYear() - result.idNo.substring(6, 10) - 1;
        			if (result.idNo.substring(10, 12) < month || result.idNo.substring(10, 12) == month && result.idNo.substring(12, 14) <= day) {
        			age++;
        			}
        		$('#age').text(age);
        		$('#applyAmt').text(Formatter.money(result.orderAmt));
        		$('#applyItems').text(result.orderItems);
        		$('#bankName').text(result.bankName);
        		$('#bankNo').text(result.bankCardNo);
        		var orderName = result.orderName.split('-');
        		$('#carbrand').text(orderName[0]);
        		$('#carDetail').text(orderName[1]);
        		var checkInfoBean = result.checkInfoBean;
        		$('#address').text(checkInfoBean.address);
        		$('#job').text(checkInfoBean.companyName);
        		$('#userName1').text(checkInfoBean.rName1);
        		$('#mobile1').text(checkInfoBean.phone1);
        		$('#relation1').text(checkInfoBean.relation1);
        		$('#userName2').text(checkInfoBean.rName2);
        		$('#mobile2').text(checkInfoBean.phone2);
        		$('#relation2').text(checkInfoBean.relation2);
        		$('#userName3').text(checkInfoBean.rName3);
        		$('#mobile3').text(checkInfoBean.phone3);
        		$('#relation3').text(checkInfoBean.relation3);
        		$('#userName4').text(checkInfoBean.rName4);
        		$('#mobile4').text(checkInfoBean.phone4);
        		$('#relation4').text(checkInfoBean.relation4);
        		$('#plate').text(Formatter.isNull(result.plate)); 
            	$('#carAge').text(Formatter.isNull(result.carAge)); 
            	$('#carBrand').text(Formatter.isNull(result.carBrand)); 
            	$('#carDetail').text(Formatter.isNull(result.carDetail)); 
            	$('#riskStatus').text(Formatter.isNull(result.riskStatus)); 
            	$('#riskMessage').text(Formatter.isNull(result.riskMessage));
            	merchantNo= result.merchantNo;
            	bizType=result.bizType;
            	IQB.post(urls['cfm'] + '/credit_pro/plan_details_by_criteria', {merchantNo: result.merchantNo,bizType:result.bizType}, function(resultPlan){
    				var arry = [];
    				$.each(resultPlan.iqbResult.result, function(i, n){
    					var obj = {};
    					obj.id = n.id;
    					obj.text = n.installPeriods+"+"+n.remark;
    					arry.push(obj);
    				});
    				$('#planId').prepend("<option value='1'>请选择</option>");
    				$('#planId').select2({theme: 'bootstrap', data: arry});
    			}); 
            });
        	IQB.post(urls['cfm'] + '/ownerloan/getCarinfo' , data,function(result){
        		var result = result.iqbResult.result;
        		$('#carConfig').text(Formatter.isNull(result.carConfig)); 
            	$('#carColor').text(Formatter.isNull(result.carColor)); 
            	$('#carNo').text(Formatter.isNull(result.carNo)); 
            	$('#carEmissions').text(Formatter.isNull(result.carEmissions)); 
            	$('#passengerNum').text(Formatter.isNull(result.passengerNum)); 
            	$('#mileage').text(Formatter.isNull(result.mileage)); 
            	$('#firstBuyAmt').text(Formatter.money(result.firstBuyAmt)); 
            	$('#regOrg').text(Formatter.isNull(result.regOrg)); 
            	$('#firstRegDate').text(Formatter.isNull(result.firstRegDate)); 
            	$('#transferNum').text(Formatter.isNull(result.transferNum)); 
            	$('#mortgageType').text(Formatter.isNull(result.mortgageType)); 
            	$('#mortgageCompany').text(Formatter.isNull(result.mortgageCompany)); 
            	$('#instAmt').text(Formatter.money(result.instAmt)); 
            	$('#instMonthInterest').text(Formatter.moneyTs(result.instMonthInterest)); 
            	$('#instItems').text(Formatter.isNull(result.instItems)); 
            	$('#instRepayedItems').text(Formatter.isNull(result.instRepayedItems)); 
            	$('#assessPrice').text(Formatter.money(result.assessPrice)); 
            	$('#mortgageFlag').text(Formatter.yOrn(result.mortgageFlag)); 
            	$('#assessSuggest').text(Formatter.isNull(result.assessSuggest));
            	var key = result.mortgageFlag;
				if (key==1){
					$(".inst").show();
				}else if (key==2){
					$(".inst").hide();
				}else{
					$(".inst").hide();
				}
            });
        	IQB.post(urls['cfm'] + '/ownerloan/getMortgageInfo' , data,function(result){
        		var result = result.iqbResult.result;
        		$('#suggestAmt').text(Formatter.isNull(Formatter.moneyTs(result.suggestAmt))); 
            	$('#suggestItems').text(Formatter.isNull(result.suggestItems)); 
            	$('#storeRiskAdvice').text(Formatter.isNull(result.storeRiskAdvice));  
            	$('#trialRiskAdvice').text(Formatter.isNull(result.trialRiskAdvice));  
            });
        	IQB.post(urls['cfm'] + '/ownerloan/getDeptSignInfo' , data,function(result){
        		var result = result.iqbResult.result;
        		$('#orderAmt2').text(Formatter.isNull(Formatter.money(result.orderAmt)));
				$('#gpsAmt').text(Formatter.money(result.gpsAmt));
				$('#planId').text(Formatter.isNull(result.planName));
        		$('#gpsTrafficFee').text(Formatter.money(result.gpsTrafficFee));
				$('#preAmt').text(Formatter.money(result.preAmt));
				$('#margin').text(Formatter.money(result.margin));
				$('#serviceFee').text(Formatter.money(result.serviceFee));
				$('#sbAmt').text(Formatter.money(result.sbAmt));
				$('#monthMake').text(Formatter.money(result.monthInterest));
				$('#contractAmt').text(Formatter.money(result.contractAmt));
				$('#finalRiskAdvice').text(Formatter.isNull(result.finalRiskAdvice));
            });
        },
        openApproveWin: function(){
        	if($('#updateForm1').form('validate')){
        		if($('#td-39').find('div').length == 0){
					IQB.alert('批贷函未上传图片，无法审核');
					return false;
				};
				var data = {
					'orderId':procBizId,	
					'orderAmt':Formatter.removeMoneyFormatter($('#orderAmt2').val()),
					// 保存上标金额==借款金额==合同金额 FINANCE-2561 车主贷：1订单查询中借款金额取上标金额
					'borrowAmt':Formatter.removeMoneyFormatter($('#sbAmt').text()),
					'planId':$("#planId").val(),
					'margin':Formatter.removeMoneyFormatter($('#margin').text()),
					'serviceFee':Formatter.removeMoneyFormatter($('#serviceFee').text()),
					'monthInterest':Formatter.removeMoneyFormatter($('#monthMake').text()),
					'gpsAmt':Formatter.removeMoneyFormatter($('#gpsAmt').val()),
					'gpsTrafficFee':Formatter.removeMoneyFormatter($('#gpsTrafficFee').text()),
					'preAmt':Formatter.removeMoneyFormatter($('#preAmt').text()),
					'finalRiskAdvice':$("#finalRiskAdvice").val()
				}
				IQB.post(urls['cfm'] + '/ownerloan/updateOrderInfo', data, function(result){
					if(result.success == 1){
						$('#approve-win').modal({backdrop: 'static', keyboard: false, show: true});
					}
				})
			}
		},
		closeApproveWin: function(){
			$('#approve-win').modal('hide');
		},
		selectEvent:function(){
			$("#planId").change(function(){
				if(Number(Formatter.removeMoneyFormatter($('#orderAmt2').val()))>Number(Formatter.removeMoneyFormatter($('#suggestAmt').text()))){
					alert("核准额度小于等于建议审批额度")
					$("#orderAmt2").val("").focus(); 
					$("#planId").children().remove(); 
					IQB.post(urls['cfm'] + '/credit_pro/plan_details_by_criteria', {merchantNo: merchantNo,bizType:bizType}, function(resultPlan){
	    				var arry = [];
	    				$.each(resultPlan.iqbResult.result, function(i, n){
	    					var obj = {};
	    					obj.id = n.id;
	    					obj.text = n.planFullName;
	    					arry.push(obj);
	    				});
	    				$('#planId').prepend("<option value='1'>请选择</option>");
	    				$('#planId').select2({theme: 'bootstrap', data: arry});
	    			}); 
					return false;
				}
				if(Number(Formatter.removeMoneyFormatter($('#orderAmt2').val())==0)){
					alert("请输入核准额度")
					$("#orderAmt2").val("").focus(); 
					$("#planId").children().remove(); 
					IQB.post(urls['cfm'] + '/credit_pro/plan_details_by_criteria', {merchantNo: merchantNo,bizType:bizType}, function(resultPlan){
	    				var arry = [];
	    				$.each(resultPlan.iqbResult.result, function(i, n){
	    					var obj = {};
	    					obj.id = n.id;
	    					obj.text = n.planFullName;
	    					arry.push(obj);
	    				});
	    				$('#planId').prepend("<option value='1'>请选择</option>");
	    				$('#planId').select2({theme: 'bootstrap', data: arry});
	    			}); 
					return false;
				}
				var option  = {}
				option.orderAmt = Formatter.removeMoneyFormatter($('#orderAmt2').val()),
				option.gpsAmt = Formatter.removeMoneyFormatter($('#gpsAmt').val()),
				option.id = $(this).children('option:selected').val();
				IQB.post(urls['cfm'] + '/ownerloan/recalAmt', option, function(result){
					$('#gpsTrafficFee').text(Formatter.moneyTs(result.iqbResult.result.gpsTrafficFee));
					$('#preAmt').text(Formatter.moneyTs(result.iqbResult.result.preAmt));
					$('#margin').text(Formatter.moneyTs(result.iqbResult.result.margin));
					$('#serviceFee').text(Formatter.moneyTs(result.iqbResult.result.serviceFee));
					$('#sbAmt').text(Formatter.moneyTs(result.iqbResult.result.sbAmt));
					$('#monthMake').text(Formatter.moneyTs(result.iqbResult.result.monthMake));
					$('#contractAmt').text(Formatter.moneyTs(result.iqbResult.result.contractAmt));
				});
			});
		},
		initApprovalHistory: function(){//初始化订单历史
			$('#datagrid').datagrid2({
				url: urls['rootUrl'] + '/WfTask/procApproveHistory',
				pagination: false,
				queryParams: {
					procInstId: window.procInstId,
				}
			});
		},
		removeFile: function(event){
			if(event.stopPropagation){//W3C阻止冒泡方法  
				event.stopPropagation();  
			}else{//IE阻止冒泡方法   
				event.cancelBubble = true;
			}  	
			var tarent = event.currentTarget;
			$(tarent).prop('disabled', true);
			$(tarent).find('span').first().removeClass('glyphicon glyphicon-trash').addClass('fa fa-spinner fa-pulse');
			var filePath = $(tarent).attr('filePath');		
			IQB.post(urls['cfm'] + '/fileUpload/remove', {filePath: filePath}, function(result){
				IQB.post(urls['cfm'] + '/image/deleteImage', {imgPath: filePath}, function(resultInfo){
					$(tarent).parent().parent().parent().remove();
		 		});
			});		
		},
		formatterMoney : function(){
		    var orderAmt2 = $('#orderAmt2').val();
		    var gpsAmt = $('#gpsAmt').val();
		    $('#orderAmt2').val(Formatter.moneyTs(orderAmt2));
		    $('#gpsAmt').val(Formatter.moneyTs(gpsAmt));
		},
        init: function(){ 
        	_this.selectEvent();
        	_this.showHtml(); 
        	_this.showFile();
        	_this.showFile1();
        	_this.showFile2();
        	_this.showFile3();
        	$('#orderAmt2').on('blur',function(){_this.formatterMoney()});
        	$('#gpsAmt').on('blur',function(){_this.formatterMoney()});
        	$('#btn-approve').on('click', function(){_this.openApproveWin()});
			$('#btn-unassign').on('click', function(){_this.unassign()});
			$('#btn-approve-save').on('click', function(){_this.approve()});
			$('#btn-approve-close').on('click', function(){_this.closeApproveWin()});
        	$('#btn-uploadType39').on('click', function(){$('#file').attr('fileType', 39);$('#file').click();});	
			$('#file').on('change', function(){var fileName = $('#file').val();if(fileName){_this.uploadFile();}});	
            _this.initApprovalHistory();
        }
    }
    return _this;
}();
$(function() {
	//页面初始化
    IQB.carLoanDeptRisk.init();
});