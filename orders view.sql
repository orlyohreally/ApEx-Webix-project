DROP VIEW orders_report;
CREATE VIEW orders_report AS
  SELECT o.id order_id, c.last_name || ' ' || c.first_name || ' ' || c.middle_name full_name, s.name status, o.completed_at completed_at, op.price, op.quantity, p.id product_id, p.name product, pt.name product_type, p.price current_price
  FROM orders o JOIN order_product op ON o.id = op.order_id JOIN customers c on c.id = o.customer_id JOIN order_statuses s ON o.status_id = s.id JOIN products p ON p.id = op.product_id JOIN product_types pt ON pt.id = p.product_type_id
  ORDER BY o.id









