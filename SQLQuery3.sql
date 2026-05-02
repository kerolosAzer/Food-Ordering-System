USE master;
GO

IF DB_ID('order_service_db') IS NULL
BEGIN
    CREATE DATABASE order_service_db;
END
GO

IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'food_user')
BEGIN
    CREATE LOGIN food_user 
    WITH PASSWORD = 'Food@123456',
    CHECK_POLICY = OFF,
    CHECK_EXPIRATION = OFF;
END
GO

USE order_service_db;
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'food_user')
BEGIN
    CREATE USER food_user FOR LOGIN food_user;
END
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO

USE order_service_db;
GO

DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
GO
 
USE order_service_db;
GO
SELECT * 
FROM orders;

SELECT 
    o.id AS order_id,
    o.customer_id,
    o.order_date,
    o.order_status,
    o.payment_method,
    o.payment_status,
    o.total_price,
    i.id AS item_id,
    i.menu_item_id,
    i.quantity,
    i.price
FROM orders o
LEFT JOIN order_items i
    ON o.id = i.order_id
ORDER BY o.id;

USE order_service_db;
GO

SELECT * FROM orders;

//////////////////////
SELECT 
    o.id AS order_id,
    o.customer_id,
    o.restaurant_id,
    o.order_date,
    o.order_status,
    o.payment_method,
    o.payment_status,
    o.total_price,
    i.id AS item_id,
    i.menu_item_id,
    i.quantity,
    i.price
FROM orders o
LEFT JOIN order_items i
    ON o.id = i.order_id
ORDER BY o.id DESC;

////////////////////
USE order_service_db;
GO

SELECT id, order_date, created_at, updated_at, order_status
FROM orders
ORDER BY id DESC;