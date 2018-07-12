webix.ready(function(){
    apex.server.process("GET_ORDERS", null,
    {
        dataType: "json",
        success: function(data) {console.log(data, data.orders);
               
            var cells = [
                { 
                    header:"<span class='webix_icon fa-film'></span>List",
                    body: {
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
                    }
                },
                { 
                    header:"<span class='webix_icon fa-info'></span>List",
                    body: {
                        select: true,
                        view:"datatable",
                        id: "products_datatable",
                        autoheight:true,
                        columns: [
                            {id: "id", header: '', template: '<input type = "checkbox" oid="#id#"></input>'},
                            {id: "product", header: "Product", minWidth: 200, fillspace:true},
                            {id: "company", header:["Company", {content: "selectFilter"}], width: 100},
                            {id: "type", header:["Type", {content: "selectFilter"}], width: 100},
                            {id: "price", header:["Price", {content: "numberFilter"}], minWidth: 200}
                        ],
                        data: data.products
                    }
                }
            ];


            var grid = webix.ui({container: "orders_rep",
              cols:[
                {  
                    view:"tabview",
                    cells: cells
                }  
              ]
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
            console.log(grid);
        },
        error: function(res) {
            console.log(res.responseText);
        }
    });

});
/*

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
    OPEN l_cursor FOR
    SELECT p.id "id", p.name "product", p.company "company", p.price "price", t.name "type"
    FROM products p LEFT JOIN product_types t ON p.product_type_id = t.id
    ORDER BY  p.name;
    APEX_JSON.write('products', l_cursor);
    APEX_JSON.close_object;
    htp.p(APEX_JSON.get_clob_output);
    APEX_JSON.free_output;
END;

*/