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
                        {id: "total price", header:"Total price", minWidth: 200, fillspace:true}
                    ],
                    data: data.orders,
                    on:{
                        onItemDblClick:function(item){
                            console.log(item);
                            console.log(this.getItem(item.row));
                            $$("order_product_datatable").filter(function(obj){
                                console.log('obj', obj);
                                if(obj.order_id == $$("orders_datatable").getItem(item.row).order_id) {
                                    console.log('obj.order', obj.order_id);
                                    return true;
                                }
                                return false;
                            });
                            console.log($$("order_product_datatable").serialize());
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
                                label: 'Edit this order',
                                width: 100,
                                align: 'right',
                                click: function() {
                                    console.log($$("orders_datatable").getSelectedItem());
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
            console.log(res.responseText);
        }
    });

});


/*
GET ORDERS
DECLARE
    l_cursor sys_refcursor;
BEGIN
    OPEN l_cursor FOR
    SELECT order_id "order_id", full_name "full_name", status "status", completed_at "completed_at", SUM(price * quantity) "total price"
    FROM orders_report
    GROUP BY order_id, full_name, status, completed_at;
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

/*create order draft*/
$.ajax({
      type: "GET",
      url: "wwv_flow.show",
      data: {
        p_flow_id      : $v('pFlowId'),
        p_instance     : $v('pInstance'),
        p_flow_step_id : $v('pFlowStepId'),
        p_request      : "GET",
        p_arg_names    : 'P3_ACTION',
        p_arg_values   : 'edit_order'
    },
     dataType: "html",
    success: function(data){
        console.log(data, $(data).find("#order_form").html());
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
$$("products_datatable").eachRow(function(id) {
   this.editStop();
   const item = this.getItem(id);
   if(item['quantity'] > 0) 
       console.log(item);
});
