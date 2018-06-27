CREATE TABLE customers
(
  id number(9) NOT NULL,
  last_name varchar2(50) NOT NULL,
  first_name varchar2(50) NOT NULL,
  middle_name varchar2(50),
  email varchar2(50) NOT NULL,
  address varchar2(200),
  created_at date NOT NULL,
  created_by varchar2(50),
  updated_at date default sysdate,
  updated_by varchar2(50) default user
);

CREATE SEQUENCE customers_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER customer_bef_ins
BEFORE INSERT
ON customers FOR EACH ROW
BEGIN
  :new.id := customers_seq.nextval;
  :new.created_at := sysdate;
  :new.created_by := user;
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

CREATE OR REPLACE TRIGGER customer_bef_upd
BEFORE UPDATE
ON customers FOR EACH ROW
BEGIN
  :new.updated_at := sysdate;
  :new.updated_by := user;
END;

