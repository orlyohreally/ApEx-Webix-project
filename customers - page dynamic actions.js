//show customer information on click
const id = $(this.triggeringElement).find('.customer').attr('oid');
console.log('id', id, $v('pFlowId'),$v('pInstance'));
$.ajax({
      type: "GET",
      url: "wwv_flow.show",
      data: {
        p_flow_id      : $v('pFlowId'),
        p_flow_step_id:$('#pFlowStepId').val(), 
        p_instance:$('#pInstance').val(), 
    },
     dataType: "html",
    success: function(data){
        console.log(data);
        $($(data).find("#customer_form")).modal('show');
console.log($($(data).find("#customer_form")).html());
    }
  });