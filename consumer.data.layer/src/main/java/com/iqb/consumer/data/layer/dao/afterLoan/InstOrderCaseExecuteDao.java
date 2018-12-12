package com.iqb.consumer.data.layer.dao.afterLoan;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.iqb.consumer.data.layer.bean.afterLoan.InstOrderCaseExecuteBean;

/**
 * Description:
 * 
 * @author chenyong
 * @version 1.0
 * 
 * <pre>
 * Modification History: 
 * Date         			Author      	Version     Description 
------------------------------------------------------------------
 * 2018年7月18日 11:03:40 	chenyong   	1.0        	1.0 Version 
 * </pre>
 */
public interface InstOrderCaseExecuteDao {
    /**
     * 
     * 保存案件庭审结果
     * 
     * @author chenyong
     * @param lawResult
     * @return 2018年7月18日
     */
    int saveInstOrderCaseExecute(InstOrderCaseExecuteBean lawResult);

    /**
     * 
     * 更新案件庭审结果
     * 
     * @author chenyong
     * @param lawResult
     * @return 2018年7月18日
     */
    int updateInstOrderCaseExecute(InstOrderCaseExecuteBean lawResult);

    /**
     * 
     * 根据订单号查询案件庭审结果
     * 
     * @author chenyong
     * @param orderId
     * @return 2018年7月18日
     */
    InstOrderCaseExecuteBean getInstOrderCaseExecuteByOrderId(@Param("orderId") String orderId);

    /**
     * 
     * 根据订单号查询案件庭审结果列表
     * 
     * @author chenyong
     * @param orderId
     * @return 2018年7月18日
     */
    List<InstOrderCaseExecuteBean> selectInstOrderCaseExecuteByCaseId(String caseId);
}
