-- PostgreSQL initialization script
-- This script creates the necessary databases for all Food Ordering System services

-- Create user_service database
CREATE DATABASE user_service_db;

-- Create restaurant_service database
CREATE DATABASE restaurant_service_db;

-- Create order_service database
CREATE DATABASE order_service_db;

-- Create payment_service database
CREATE DATABASE payment_service_db;

-- Create delivery_service database
CREATE DATABASE delivery_service_db;

\c user_service_db
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;

\c restaurant_service_db
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;

\c order_service_db
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;

\c payment_service_db
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;

\c delivery_service_db
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO postgres;
