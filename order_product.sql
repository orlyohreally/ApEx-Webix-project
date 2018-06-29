CREATE TABLE order_product (
  id number(9) NOT NULL PRIMARY KEY,
  order_id number(9) NOT NULL,
  product_id number(9) NOT NULL,
  price number NOT NULL,
  quantity number(3) NOT NULL,
  created_at date,
  created_by varchar2(50),
  updated_at date default sysdate,
  updated_by varchar2(50) default user,
  CONSTRAINT order_pr_pr_fk FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT order_pr_order_fk FOREIGN KEY (order_id) REFERENCES orders(id)
);


CREATE SEQUENCE order_product_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER order_product_bef_ins
BEFORE INSERT
ON order_product FOR EACH ROW
BEGIN
  :new.id := order_product_seq.nextval;
  :new.created_at := sysdate;
  :new.created_by := user;
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

CREATE OR REPLACE TRIGGER order_product_bef_upd
BEFORE UPDATE
ON order_product FOR EACH ROW
BEGIN
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;