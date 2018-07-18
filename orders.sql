CREATE TABLE orders (
  id number(9) NOT NULL PRIMARY KEY,
  order_number varchar2(10),
  customer_id number(9) NOT NULL,
  status_id number(9) NOT NULL,
  completed_at date,
  created_at date,
  created_by varchar2(50),
  updated_at date default sysdate,
  updated_by varchar2(50) default user,
  CONSTRAINT orders_customer_fk FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT orders_status_fk FOREIGN KEY (status_id) REFERENCES order_statuses(id)
);

CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1;

CREATE INDEX orders_customer_ind ON orders (customer_id);
CREATE INDEX orders_status_ind ON orders (status_id);

CREATE OR REPLACE TRIGGER order_bef_ins
BEFORE INSERT
ON orders FOR EACH ROW
BEGIN
  :new.id := order_seq.nextval;
  :new.created_at := sysdate;
  :new.created_by := user;
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

CREATE OR REPLACE TRIGGER order_bef_upd
BEFORE UPDATE
ON orders FOR EACH ROW
BEGIN
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;
