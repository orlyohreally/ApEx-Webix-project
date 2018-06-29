CREATE TABLE order_statuses (
  id number(9) NOT NULL PRIMARY KEY,
  name varchar2(50) NOT NULL, 
  created_at date NOT NULL, 
  created_by varchar2(50), 
  updated_at date DEFAULT sysdate, 
  updated_by varchar2(50) DEFAULT user 
);

CREATE SEQUENCE order_status_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER order_status_bef_ins
BEFORE INSERT
ON order_statuses FOR EACH ROW
BEGIN
  :new.id := order_status_seq.nextval;
  :new.created_at := sysdate;
  :new.created_by := user;
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

CREATE OR REPLACE TRIGGER order_satus_bef_upd
BEFORE UPDATE
ON order_statuses FOR EACH ROW
BEGIN
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;


INSERT INTO order_statuses (name)
SELECT 'draft'
FROM DUAL
UNION ALL
SELECT 'locked'
FROM DUAL
UNION ALL
SELECT 'shipped'
FROM DUAL
UNION ALL
SELECT 'prepaid'
FROM DUAL
UNION ALL
SELECT 'paid'
FROM DUAL
UNION ALL
SELECT 'delivered'
FROM DUAL;
