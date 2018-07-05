//show customer information on click
const id = $(this.triggeringElement).find('.customer').attr('oid');
$.ajax({
    type: "GET",
    url: "wwv_flow.show",
    data: {
        p_flow_id      : $v('pFlowId'),
        p_flow_step_id:$('#pFlowStepId').val(), 
        p_instance:$('#pInstance').val(), 
        p_arg_names: ['P3_ACTION', 'P3_CUSTOMER_ID'],
        p_arg_values: ['edit_customer', id]
    },
     dataType: "html",
    success: function(data){
        const html = $(data).find("#modal_hldr").html();
        $("#modal_hldr").html(html);
        $("#customer_form").dialog();
    }
});
/*
IF :P3_CUSTOMER_ID IS NOT NULL THEN
    SELECT last_name, first_name,  middle_name into :P3_CUSTOMER_LASTNAME, :P3_CUSTOMER_FIRSTNAME, :P3_CUSTOMER_MIDDLENAME
    FROM customers
    WHERE id = :P3_CUSTOMER_ID;
ELSE
    :P3_CUSTOMER_LASTNAME := NULL;
    :P3_CUSTOMER_FIRSTNAME := NULL;
    :P3_CUSTOMER_MIDDLENAME := NULL;
END IF;
*/