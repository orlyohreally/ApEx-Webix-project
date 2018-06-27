CREATE TABLE products
(
  id number(9) NOT NULL,
  name varchar2(50) NOT NULL,
  company varchar2(50) NOT NULL,
  price number,
  created_at date NOT NULL,
  created_by varchar2(50),
  updated_at date default sysdate,
  updated_by varchar2(50) default user
);

CREATE SEQUENCE products_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER product_bef_ins
BEFORE INSERT
ON products FOR EACH ROW
BEGIN
  :new.id := products_seq.nextval;
  :new.created_at := sysdate;
  :new.created_by := user;
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

CREATE OR REPLACE TRIGGER product_bef_upd
BEFORE UPDATE
ON products FOR EACH ROW
BEGIN
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;