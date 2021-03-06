CREATE OR REPLACE PACKAGE pk_order_manager AS
    FUNCTION set_order_number(p_order_id IN NUMBER) RETURN VARCHAR2;
    FUNCTION add_product_to_order(p_order_id IN NUMBER, p_product_id IN NUMBER, p_quantity IN NUMBER) RETURN BOOLEAN;
END pk_order_manager;

CREATE OR REPLACE PACKAGE BODY pk_order_manager AS
    FUNCTION set_order_number(p_order_id IN NUMBER) RETURN VARCHAR2 IS
    v_order_number VARCHAR2(10);
    BEGIN
        SELECT (MAX(TO_NUMBER(SUBSTR(order_number, 0, INSTR(order_number, '-') - 1))) + 1) INTO v_order_number
        FROM orders
        WHERE order_number like '%-' || EXTRACT(YEAR FROM sysdate);
        IF v_order_number IS NULL THEN
            v_order_number := '01';
        END IF;
        IF v_order_number < 10 THEN
            v_order_number := '0' || v_order_number;
        END IF;
        v_order_number := v_order_number || '-' || EXTRACT(YEAR FROM sysdate);
        UPDATE orders SET order_number = v_order_number WHERE id = p_order_id;
        RETURN v_order_number;
    END;
    
    FUNCTION add_product_to_order(p_order_id IN NUMBER, p_product_id IN NUMBER, p_quantity IN NUMBER) RETURN BOOLEAN IS
    v_price NUMBER;
    v_tmp_num NUMBER;
    v_order_id NUMBER;
    BEGIN
        SELECT price INTO v_price
        FROM products
        WHERE id = p_product_id;
        SELECT COUNT(*) INTO v_tmp_num
        FROM order_product
        WHERE order_id = p_order_id AND product_id = p_product_id;
        IF v_tmp_num = 0 THEN -- a new product in the order
            INSERT INTO order_product (order_id, product_id, price, quantity) VALUES (p_order_id, p_product_id, v_price, p_quantity);
            RETURN TRUE;
        ELSE --product is already in the order
            UPDATE order_product SET quantity = quantity + p_quantity
            WHERE order_id = p_order_id AND product_id = p_product_id;
            RETURN TRUE;
        END IF;
        EXCEPTION WHEN OTHERS THEN
            RETURN FALSE;
    END;
END pk_order_manager;


/*declare
ret varchar2(10);
begin
ret:=pk_order_manager.set_order_number(2);
end;*/


/*update orders set order_number =  CASE WHEN id < 10 THEN '0' || id ELSE TO_CHAR(id) END  || '-' || EXTRACT(YEAR FROM sysdate)*/