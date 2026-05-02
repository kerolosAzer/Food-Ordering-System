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
