CREATE OR REPLACE PACKAGE pk_order_manager AS
    FUNCTION set_order_number(p_order_id IN NUMBER) RETURN VARCHAR2;
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
END pk_order_manager;


/*declare
ret varchar2(10);
begin
ret:=pk_order_manager.set_order_number(2);
end;*/


/*update orders set order_number =  CASE WHEN id < 10 THEN '0' || id ELSE TO_CHAR(id) END  || '-' || EXTRACT(YEAR FROM sysdate)*/