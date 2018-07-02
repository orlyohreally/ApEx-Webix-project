CREATE TABLE product_types (
  id number(9) NOT NULL PRIMARY KEY,
  name varchar2(50) NOT NULL, 
  created_at date NOT NULL, 
  created_by varchar2(50), 
  updated_at date DEFAULT sysdate, 
  updated_by varchar2(50) DEFAULT user 
);

CREATE SEQUENCE product_type_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER product_type_bef_ins
BEFORE INSERT
ON product_types FOR EACH ROW
BEGIN
  :new.id := product_type_seq.nextval;
  :new.created_at := sysdate;
  :new.created_by := user;
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

CREATE OR REPLACE TRIGGER product_type_bef_upd
BEFORE UPDATE
ON product_types FOR EACH ROW
BEGIN
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;


INSERT INTO product_types (name)
SELECT 'dairy'
FROM DUAL
UNION ALL
SELECT 'fruits'
FROM DUAL
UNION ALL
SELECT 'grains'
FROM DUAL
UNION ALL
SELECT 'meat'
FROM DUAL
UNION ALL
SELECT 'confections'
FROM DUAL
UNION ALL
SELECT 'vegetables'
FROM DUAL;
