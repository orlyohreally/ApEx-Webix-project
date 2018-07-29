function getDataTableGrid(container, data, columns) {
    console.log(data);
    return webix.ui({
        container: container,
        select: true,
        view:"datatable",
        id: "products_datatable",
        autoheight:true,
        columns: columns,
        data: data,
        on:{
            onItemDblClick:function(item){
                console.log(item);
                console.log(this.getItem(item.row));
                if(item.column == 'name' || item.column == 'price' || item.column == 'company') {
                    $$("editWin").show();
                }
                else {
                    $$("product_chart").clearAll();
                    $$("chartWin").show();
                    
                    apex.server.process("GET_PRODUCT_LINE_CHART_DATA", 
                    {
                        x01: this.getItem(item.row).id,
                    },
                    {
                        dataType: "json",
                        success: function(data) {
                            console.log(data);
                            
                            console.log('before', $$("product_chart").serialize());
                            $$("product_chart").parse(data.product_stats);
                            console.log('after', $$("product_chart").serialize());
                            
                        },
                        error: function(res) {
                            console.log(res);
                        }
                    });
                }
                
            }
        }
    });
}

webix.ready(function(){
    apex.server.process("GET_PRODUCTS", null,
        {
            dataType: "json",
            success: function(data) {
                columns = [
                    {id: "id", hidden: true},
                    {id: "name", header:"Product <span class='fa fa-edit'></span>", minWidth: 200, fillspace:true},
                    {id: "price", header:"Price <span class='fa fa-edit'></span>", width: 100},
                    {id: "company", header:"Company <span class='fa fa-edit'></span>", minWidth: 200, fillspace:true},
                    {id: "total_count", header:"Sold <span class='fa fa-line-chart'></span>", width: 100},
                    {id: "total_sum", header:"Money <span class='fa fa-line-chart'></span>", width: 100}
                ];
                
                var products_grid = getDataTableGrid("products_rep", data.products, columns);
                var product_form = webix.ui({
                    view:"window",
                    id:"editWin",
                    head:"Product info",
                    modal:true,
                    width: 0.9 * $(window).width(),
                    position:"center",
                    body: {
                        view:"form",
                        //scroll: true,
                        id:"product_form",
                        elements:[
                            {
                                view:"text",
                                name:"id",
                                hidden: true
                            },
                            {
                                view:"text",
                                label:"Name",
                                name:"name"
                            },
                            {
                                view:"text",
                                label:"Price",
                                name:"price"
                            },
                            {
                                view:"text",
                                label:"Company",
                                name:"company"
                            },
                            {
                                cols: [
                                    {
                                        view: "button",
                                        value: "Cancel",
                                        click: function() {
                                            this.getTopParentView().hide(); 
                                        }
                                    },
                                    {
                                        view: "button",
                                        type: "form",
                                        value: "Save",
                                        click: function() {
                                            this.getFormView().save();
                                            this.getTopParentView().hide(); 
                                        }
                                    }
                                ]
                            }
                        ],
                        elementsConfig: {
                            labelPosition: "top",
                        }
                    }
                });
                var product_stats = webix.ui({
                    view:"window",
                    id:"chartWin",
                    head: {
                        view:"toolbar",
                        cols:[
                            {
                                view:"label",
                                label: "Product sales"
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
                    modal:true,
                    width: 0.9 * $(window).width(),
                    position:"center",
                    body: {
                            view:"chart",
                            type:"line",
                            id: "product_chart",
                            value:"#total#",
                            height: 300,
                            item:{
                                borderColor: "#1293f8",
                                color: "#ffffff"
                            },
                            line:{
                                color:"#1293f8",
                                width:3
                            },
                            xAxis:{
                                template:"'#month_year#"
                            },
                            offset:0,
                            yAxis:{
                                start:0,
                                end:20,
                                step:10,
                                template:function(obj){
                                    return (obj%20?"":obj)
                                }
                            },
                            data: []
                        }
                });
                $$("product_form").bind($$("products_datatable"));
                webix.event(window, "resize", function(){
                    products_grid.adjust();
                    product_stats.define("width", 0.9 * $(window).width());
                    product_stats.define("height", $(window).height() - 2 * 70);
                    product_stats.adjust();
                });
            },
            error: function(res) {
                console.log(res);
            }
        }
    );
});



/*
-------------------PROCESS GET_PRODUCTS--------------
DECLARE
    l_cursor sys_refcursor;
BEGIN
    OPEN l_cursor FOR
    SELECT p.id "id", p.name "name", p.company "company", p.price "price", SUM(CASE WHEN TO_CHAR(o.completed_at, 'MM.YYYY') = TO_CHAR(CURRENT_DATE, 'MM.YYYY') THEN op.quantity ELSE 0 END) "total_count", SUM(CASE WHEN TO_CHAR(o.completed_at, 'MM.YYYY') = TO_CHAR(CURRENT_DATE, 'MM.YYYY') THEN op.quantity * op.price ELSE 0 END) "total_sum"
    FROM products p LEFT JOIN order_product op ON op.product_id = p.id LEFT JOIN orders o ON o.id = op.order_id
    GROUP BY p.id, p.name, p.company, p.price
    ORDER BY p.id;
    APEX_JSON.initialize_clob_output;
    APEX_JSON.open_object;
    APEX_JSON.write('products', l_cursor);
    APEX_JSON.close_object;
    htp.p(APEX_JSON.get_clob_output);
    APEX_JSON.free_output;
END;

-------------------PROCESS GET_PRODUCT_LINE_CHART_DATA--------------
DECLARE
    l_cursor sys_refcursor;
BEGIN
    OPEN l_cursor FOR
    SELECT sum(quantity) "total", TO_CHAR(completed_at, 'MM/YYYY') "month_year"
    FROM orders o LEFT JOIN order_product op ON o.id = op.order_id
    WHERE o.status_id IN (4, 5) AND op.product_id = apex_application.g_x01
    GROUP BY TO_CHAR(completed_at, 'MM/YYYY');
    APEX_JSON.initialize_clob_output;
    APEX_JSON.open_object;
    APEX_JSON.write('product_stats', l_cursor);
    APEX_JSON.close_object;
    htp.p(APEX_JSON.get_clob_output);
    APEX_JSON.free_output;
END;


*/