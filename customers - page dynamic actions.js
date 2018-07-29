//fill customer information when dialogue comes up
/*
IF :P2_CUSTOMER_ID IS NOT NULL THEN
    SELECT last_name, first_name,  middle_name into :P2_CUSTOMER_LASTNAME, :P2_CUSTOMER_FIRSTNAME, :P2_CUSTOMER_MIDDLENAME
    FROM customers
    WHERE id = :P2_CUSTOMER_ID;
ELSE
    :P2_CUSTOMER_LASTNAME := NULL;
    :P2_CUSTOMER_FIRSTNAME := NULL;
    :P2_CUSTOMER_MIDDLENAME := NULL;
END IF;
*/


//update customer
$.ajax({
    type: "GET",
    url: "wwv_flow.show",
    data: {
        p_flow_id: $v('pFlowId'),
        p_flow_step_id: $('#pFlowStepId').val(), 
        p_instance: $('#pInstance').val(), 
        p_request: "APPLICATION_PROCESS=CUSTOMER_UPDATE",
        p_arg_names: ['P2_CUSTOMER_ID', 'P2_CUSTOMER_LASTNAME', 'P2_CUSTOMER_FIRSTNAME',  'P2_CUSTOMER_MIDDLENAME'],
        p_arg_values: [$v('P2_CUSTOMER_ID'), $v('P2_CUSTOMER_LASTNAME'), $v('P2_CUSTOMER_FIRSTNAME'),  $v('P2_CUSTOMER_MIDDLENAME')]
    },
    dataType: "json",
    success: function(res){
        if(res.status == 'success') {
            apex.message.showPageSuccess('Customer was successfully updated!');
        }
        else {
            apex.message.showErrors({
                type: "error",
                location: ["page"],
                message: res.msg,
                unsafe: false
            });
        }
        //apex.navigation.dialog.close(true, null);
    },
    error: function(res) {
        apex.message.showErrors({
            type: "error",
            location: ["page"],
            message: res.responseText,
            unsafe: false
        });
    }
});
/*
BEGIN
    UPDATE customers SET last_name = :P2_CUSTOMER_LASTNAME, first_name = :P2_CUSTOMER_FIRSTNAME,  middle_name = :P2_CUSTOMER_MIDDLENAME
    WHERE id = :P2_CUSTOMER_ID;
    HTP.P('{"status": "success", "id": "' || :P2_CUSTOMER_ID || '"}');
EXCEPTION WHEN OTHERS THEN
    HTP.P('{"status": "error", "msg": "' || SQLCODE || ' : ' || REPLACE(SQLERRM, '"', '\"') || '"}');
END;
*/
//insert customer
$.ajax({
    type: "GET",
    url: "wwv_flow.show",
    data: {
        p_flow_id: $v('pFlowId'),
        p_flow_step_id: $('#pFlowStepId').val(), 
        p_instance: $('#pInstance').val(), 
        p_request: "APPLICATION_PROCESS=CUSTOMER_INSERT",
        p_arg_names: ['P2_CUSTOMER_LASTNAME', 'P2_CUSTOMER_FIRSTNAME',  'P2_CUSTOMER_MIDDLENAME'],
        p_arg_values: [$v('P2_CUSTOMER_LASTNAME'), $v('P2_CUSTOMER_FIRSTNAME'),  $v('P2_CUSTOMER_MIDDLENAME')]
    },
    dataType: "json",
    success: function(res){console.log(res);
        if(res.status == 'success') {
            apex.message.showPageSuccess('Customer was successfully updated!');
        }
        else {
            apex.message.showErrors({
                type: "error",
                location: ["page"],
                message: res.msg,
                unsafe: false
            });
        }
        //apex.navigation.dialog.close(true, null);
    },
    error: function(res) {console.log(res);
        apex.message.showErrors({
            type: "error",
            location: ["page"],
            message: res.responseText,
            unsafe: false
        });
    }
});
/*
BEGIN
    INSERT INTO customers (last_name, first_name,  middle_name) values (:P2_CUSTOMER_LASTNAME, :P2_CUSTOMER_FIRSTNAME, :P2_CUSTOMER_MIDDLENAME) RETURNING id INTO :P2_CUSTOMER_ID;
    HTP.P('{"status": "success", "id": "' || :P2_CUSTOMER_ID || '"}');
EXCEPTION WHEN OTHERS THEN
    HTP.P('{"status": "error", "msg": "' || SQLCODE || ' : ' || REPLACE(SQLERRM, '"', '\"') || '"}');
END;
*/