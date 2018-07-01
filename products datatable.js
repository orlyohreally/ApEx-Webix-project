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
            onItemDblClick:function(){
                $$("editwin").show();
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
                                container:"chartDiv",
                                type:"line",
                                value:"#sales#",
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
                                    template:"'#year#"
                                },
                                offset:0,
                                yAxis:{
                                    start:0,
                                    end:100,
                                    step:10,
                                    template:function(obj){
                                        return (obj%20?"":obj)
                                    }
                                },
                                data: [
                                    { id:1, sales:20, year:"02"},
                                    { id:2, sales:55, year:"03"},
                                    { id:3, sales:40, year:"04"},
                                    { id:4, sales:78, year:"05"},
                                    { id:5, sales:61, year:"06"},
                                    { id:6, sales:35, year:"07"},
                                    { id:7, sales:80, year:"08"},
                                    { id:8, sales:50, year:"09"},
                                    { id:9, sales:65, year:"10"},
                                    { id:10, sales:59, year:"11"}
                                ]
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
*/