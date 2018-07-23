webix.ready(function(){
    apex.server.process("GET_ORDERS", null,
    {
        dataType: "json",
        success: function(data) {console.log(data, data.orders);
            if($v("P3_ACTION") != 'edit_order') {
                 var orders = webix.ui({
                    container: "orders_rep",
                    select: true,
                    view:"datatable",
                    id: "orders_datatable",
                    autoheight:true,
                    columns: [
                        {id: "order_id", hidden: true},
                        {id: "full_name", header: "Customer", minWidth: 200, fillspace:true},
                        {id: "status", header:["Status", {content: "selectFilter"}], width: 100},
                        {id: "status_id", hidden: true},
                        {id: "total price", header:"Total price", minWidth: 200, fillspace:true}
                    ],
                    data: data.orders,
                    on:{
                        onItemDblClick:function(item){
                            console.log(item);
                            console.log(this.getItem(item.row));
                            $$("order_product_datatable").filter(function(obj){
                                if(obj.order_id == $$("orders_datatable").getItem(item.row).order_id) {
                                    return true;
                                }
                                return false;
                            });
                            if($$("orders_datatable").getItem(item.row).status_id == 4) {
                                $$("print_order").show();
                                $$("edit_order").hide();
                            }
                            else {
                                $$("print_order").hide();
                                $$("edit_order").show();
                            }
                            
                            $$("editWin").show();


                        }
                    }
                });
                 var order_product_datatable = webix.ui({
                    view:"window",
                    id:"editWin",
                    head:"Product info",
                    modal:true,
                    width: 0.9 * $(window).width(),
                    position:"center",
                    head: {
                        view:"toolbar",
                        cols:[
                            {
                                view:"label",
                                label: "Products in the order"
                            },
                            {
                                view:"button",
                                label: 'Edit',
                                id: "edit_order",
                                width: 100,
                                align: 'right',
                                click: function() {
                                    console.log($$("orders_datatable").getSelectedItem());
                                    const item = $$("orders_datatable").getSelectedItem();
                                    console.log(item.order_id);
                                    $s("P3_ORDER_ID", item.order_id);
                                    console.log($v("P3_ORDER_ID"));
                                    this.getTopParentView().hide(); 
                                    apex.event.trigger("#P3_ORDER_DRAFT", 'click');
                                }
                            },
                            {
                                view:"button",
                                id: "print_order",
                                label: 'Print',
                                width: 100,
                                align: 'right',
                                click: function() {
                                    const item = $$("orders_datatable").getSelectedItem();
                                    window.open('f?p=&APP_ID.:0:&SESSION.:PRINT_REPORT=order:::P3_ORDER_ID:' + item.order_id, "blanc_");
                                }
                            },
                            {
                                view:"button",
                                label: 'X',
                                width: 100,
                                align: 'right',
                                click: function() {
                                    this.getTopParentView().hide(); 
                                }
                            }
                        ]
                    },
                    body: {
                            select: true,
                            view:"datatable",
                            id: "order_product_datatable",
                            autoheight:true,
                            columns: [
                                {id: "order_id", hidden: true},
                                {id: "product_id", hidden: true},
                                {id: "name", header: "Product", minWidth: 200, fillspace:true},
                                {id: "type", header: "Type", width: 200},
                                {id: "quantity", header:"Quantity", width: 100},
                                {id: "price", header:"Price", minWidth: 200, fillspace:true}
                            ],
                            data: data.order_product
                        }
                });
            }
        },
        error: function(res) {
            console.log(res);
        }
    });

});


/*
GET ORDERS
DECLARE
    l_cursor sys_refcursor;
BEGIN
    OPEN l_cursor FOR
    SELECT order_id "order_id", full_name "full_name", status "status", completed_at "completed_at", SUM(price * quantity) "total price", status_id "status_id"
    FROM orders_report
    GROUP BY order_id, full_name, status, status_id, completed_at;
    APEX_JSON.initialize_clob_output;
    APEX_JSON.open_object;
    APEX_JSON.write('orders', l_cursor);
    OPEN l_cursor FOR
    SELECT order_id "order_id", product_id "product_id", product "name", product_type "type", quantity "quantity", price "price"
    FROM orders_report
    ORDER BY order_id, product;
    APEX_JSON.write('order_product', l_cursor);
    APEX_JSON.close_object;
    htp.p(APEX_JSON.get_clob_output);
    APEX_JSON.free_output;
END;
*/

/*create order draft (if only customer selected)*/
$.ajax({
    type: "GET",
    url: "wwv_flow.show",
    data: {
        p_flow_id      : $v('pFlowId'),
        p_instance     : $v('pInstance'),
        p_flow_step_id : $v('pFlowStepId'),
        p_request      : "GET",
        p_arg_names    : ['P3_ACTION', 'P3_ORDER_ID', 'P3_CUSTOMERS'],
        p_arg_values   : ['edit_order', $v("P3_ORDER_ID"), $v("P3_CUSTOMERS")]
    },
    dataType: "html",
    success: function(data){
        $("#orders_rep").hide();
        $("#hldr").html($(data).find("#order_form").html());
        apex.server.process("GET_ORDER_INFO", null,
        {
            dataType: "json",
            success: function(data) {console.log(data);
                var order_form = webix.ui({
                    container: "hldr",
                    select: true,
                    view:"datatable",
                    id: "products_datatable",
                    autoheight:true,
                    columns: [
                        {id: "id", header: '', hidden: true},
                        {id: "product", header: "Product", minWidth: 200, fillspace:true},
                        {id: "company", header:["Company", {content: "selectFilter"}], minWidth: 200, fillspace:true},
                        {id: "type", header:["Type", {content: "selectFilter"}], width: 100},
                        {id: "price", header:["Price", {content: "numberFilter"}], width: 200},
                        {id: "quantity", header: "Quantity", editor: "text", width: 300}
                    ],
                    editable: true,
                    data: data.products
                });
            },
            error: function(res) {
                console.log(res.responseText);
            }
        });
    }
});
/*
GET ORDER INFO
DECLARE
    l_cursor SYS_REFCURSOR;
    full_name VARCHAR2(300);
    status VARCHAR2(20);
    completed_at VARCHAR(20);
BEGIN
    OPEN l_cursor FOR
    SELECT p.id "product_id", p.company "company", p.name "name", pt.name "type", NVL(o.quantity, 0) "quantity", p.price "price"
    FROM products p LEFT JOIN orders_report o ON p.id = o.product_id JOIN product_types pt ON pt.id = p.product_type_id
    WHERE order_id = 1 OR order_id IS NULL
    ORDER BY product;
    APEX_JSON.initialize_clob_output;
    APEX_JSON.open_object;
    APEX_JSON.write('products', l_cursor);
    
    
    APEX_JSON.close_object;
    htp.p(APEX_JSON.get_clob_output);
    APEX_JSON.free_output;
    EXCEPTION WHEN OTHERS THEN htp.p('{"status: error", "msg":"' || SQLCODE || ' : ' || SQLERRM || '"}');
END;


*/

/* create new order */
var products = [];
var quantities = [];
$$("products_datatable").eachRow(function(id) {
    this.editStop();
    const item = this.getItem(id);
    if(item['quantity'] > 0) {
        products.push(item.product_id);
        quantities.push(item.quantity);
    }
});
console.log(products);
/*$.ajax({
    type: "GET",
    url: "wwv_flow.show",
    data: {
        p_flow_id      : $v('pFlowId'),
        p_instance     : $v('pInstance'),
        p_flow_step_id : $v('pFlowStepId'),
        p_request      : "APPLICATION_PROCESS=CREATE_ORDER",
        p_arg_names    : ['P3_ORDER_CUSTOMER', 'P3_ORDER_STATUS'],
        p_arg_values   : [$v("P3_ORDER_CUSTOMER"), $v("P3_ORDER_STATUS")]
    },
    dataType: "json",
    success: function(data){
        console.log(data);
    },
    error: function(res){
        console.log(res);
    }
});*/
apex.server.process("CREATE_ORDER", 
{
    f01: products,
},
{
    dataType: "json",
    success: function(data) {
        console.log(data);
    },
    error: function(res) {
        console.log(res);
    }
});



/*
FILL ORDER
BEGIN
    SELECT customer_id, status_id, completed_at INTO :P3_ORDER_CUSTOMER, :P3_ORDER_STATUS, :P3_ORDER_COMPLETED_AT
    FROM orders
    WHERE id = :P3_ORDER_ID;
EXCEPTION
    WHEN NO_DATA_FOUND THEN 
        :P3_ORDER_CUSTOMER := :P3_CUSTOMERS;
        :P3_ORDER_STATUS := NULL;
        :P3_ORDER_COMPLETED_AT := NULL;
END;
*/


/* cancel order editing */
$("#hldr").html('');
$("#orders_rep").show();