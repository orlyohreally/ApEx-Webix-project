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
            onItemDblClick:function(id){
                console.log(id);
                console.log(this.getItem(id.row));
                apex.server.process("GET_PRODUCT_LINE_CHART_DATA", 
                {
                    x01: this.getItem(id.row).id,
                },
                {
                    dataType: "json",
                    success: function(data) {
                        console.log(data);
                        $$("product_chart").parse(data.product_stats);
                        $$("editwin").show();
                    },
                    error: function(res) {
                        console.log(res);
                    }
                });
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
                    { id:"id", hidden: true},
                    { id:"name", header:"Product", fillspace:true},
                    { id:"price", header:"Price", width: 200},
                    { id:"company", header:"Company", fillspace:true}
                ];
                
                var products_grid = getDataTableGrid("products_rep", data.products, columns);
                var product_form = webix.ui({
                    view:"window",
                    id:"editwin",
                    head:"Product info",
                    modal:true,
                    width: 0.9 * $(window).width(),
                    position:"center",
                    body: {
                        view:"form",
                        top: 70,
                        height: $(window).height() - 2 * 70,
                        scroll: true,
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
                            },
                            {
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
                        ],
                        elementsConfig: {
                            labelPosition: "top",
                        }
                    }
                });
                $$("product_form").bind($$("products_datatable"));
                webix.event(window, "resize", function(){
                    products_grid.adjust();
                    product_form.define("width", 0.9 * $(window).width());
                    product_form.define("height", $(window).height() - 2 * 70);
                    product_form.adjust();
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
    SELECT id "id", name "name", company "company", price "price"
    FROM products;
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
    WHERE o.status_id = 5 AND op.product_id = 1
    GROUP BY TO_CHAR(completed_at, 'MM/YYYY');
    APEX_JSON.initialize_clob_output;
    APEX_JSON.open_object;
    APEX_JSON.write('product_stats', l_cursor);
    APEX_JSON.close_object;
    htp.p(APEX_JSON.get_clob_output);
    APEX_JSON.free_output;
END;


*/