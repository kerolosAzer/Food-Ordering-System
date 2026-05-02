USE master;
GO

-- تأكد إن قاعدة restaurant موجودة
IF DB_ID('restaurant_service_db') IS NULL
BEGIN
    CREATE DATABASE restaurant_service_db;
END
GO

-- تأكد إن Login موجود
IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'food_user')
BEGIN
    CREATE LOGIN food_user 
    WITH PASSWORD = 'Food@123456',
    CHECK_POLICY = OFF,
    CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN food_user 
    WITH PASSWORD = 'Food@123456',
    CHECK_POLICY = OFF,
    CHECK_EXPIRATION = OFF,
    DEFAULT_DATABASE = master;
END
GO

USE restaurant_service_db;
GO

-- لو User موجود جوه الداتابيز امسحه ونعمله تاني
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'food_user')
BEGIN
    DROP USER food_user;
END
GO

CREATE USER food_user FOR LOGIN food_user;
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO