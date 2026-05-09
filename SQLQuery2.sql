USE master;
GO

-- لو اليوزر موجود امسحه ونعمله من جديد
IF EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'food_user')
BEGIN
    DROP LOGIN food_user;
END
GO

CREATE LOGIN food_user 
WITH PASSWORD = 'Food@123456',
CHECK_POLICY = OFF,
CHECK_EXPIRATION = OFF;
GO

USE user_service_db;
GO

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'food_user')
BEGIN
    DROP USER food_user;
END
GO

CREATE USER food_user FOR LOGIN food_user;
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO



USE payment_service_db;
GO

IF NOT EXISTS (
    SELECT * 
    FROM sys.database_principals 
    WHERE name = 'food_user'
)
BEGIN
    CREATE USER food_user FOR LOGIN food_user;
END
GO

ALTER ROLE db_owner ADD MEMBER food_user;

GO

USE master;
GO

CREATE LOGIN food_user 
WITH PASSWORD = 'Food@12345',
CHECK_POLICY = OFF,
CHECK_EXPIRATION = OFF;
GO

USE user_service_db;
GO

CREATE USER food_user FOR LOGIN food_user;
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO





USE user_service_db;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.database_principals
    WHERE name = 'food_user'
)
BEGIN
    CREATE USER food_user FOR LOGIN food_user;
END
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO
////////////////
USE master;
GO

IF EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'food_user')
BEGIN
    ALTER LOGIN food_user 
    WITH PASSWORD = 'Food@12345',
    CHECK_POLICY = OFF,
    CHECK_EXPIRATION = OFF;

    ALTER LOGIN food_user ENABLE;
END
ELSE
BEGIN
    CREATE LOGIN food_user 
    WITH PASSWORD = 'Food@12345',
    CHECK_POLICY = OFF,
    CHECK_EXPIRATION = OFF;
END
GO

///////////////////////////
USE user_service_db;
GO

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'food_user')
BEGIN
    DROP USER food_user;
END
GO

CREATE USER food_user FOR LOGIN food_user;
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO
////////////////////////////////////////////////
USE master;
GO

IF DB_ID('restaurant_service_db') IS NULL
BEGIN
    CREATE DATABASE restaurant_service_db;
END
GO

USE restaurant_service_db;
GO

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'food_user')
BEGIN
    DROP USER food_user;
END
GO

CREATE USER food_user FOR LOGIN food_user;
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO
////////////////////////////
USE order_service_db;
GO

IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'food_user')
BEGIN
    DROP USER food_user;
END
GO

CREATE USER food_user FOR LOGIN food_user;
GO

ALTER ROLE db_owner ADD MEMBER food_user;
GO

CREATE DATABASE delivery_service_db;
USE delivery_service_db;

CREATE USER food_user FOR LOGIN food_user;

ALTER ROLE db_owner ADD MEMBER food_user;