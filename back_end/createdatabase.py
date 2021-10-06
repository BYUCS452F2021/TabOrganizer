import mysql.connector
from getpass import getpass
from mysql.connector import connect, Error

# create database
try:
    with connect(
        host="localhost",
        user="root",
        password=getpass("Enter password: "),
    ) as connection:
        print(connection)
        create_db_query = "CREATE DATABASE IF NOT EXISTS TabOrganizer"
        with connection.cursor() as cursor:
            cursor.execute(create_db_query)
        show_db_query = "SHOW DATABASES"
        with connection.cursor() as cursor:
            cursor.execute(show_db_query)
            for db in cursor:
                print(db)

except Error as e:
    print(e)

# create tables
try:
    with connect(
        host="localhost",
        user="root",
        password=getpass("Enter password: "),
        database="TabOrganizer",
    ) as connection:
        print(connection)
        create_user_query = """CREATE TABLE IF NOT EXISTS USER(
                                UserID INT AUTO_INCREMENT,
                                UserName VARCHAR(100) UNIQUE NOT NULL,
                                Password VARCHAR(100) NOT NULL,
                                PRIMARY KEY (UserID)
                                )"""
        create_folder_query = """CREATE TABLE IF NOT EXISTS FOLDER(
                                FolderID INT AUTO_INCREMENT,
                                UserID INT NOT NULL,
                                FolderName VARCHAR(100) NOT NULL,
                                DateUpdated DATE NOT NULL,
                                PRIMARY KEY (FolderID),
                                FOREIGN KEY (UserID) REFERENCES User(UserID)
                                )"""
        create_item_query = """CREATE TABLE IF NOT EXISTS ITEM(
                                ItemID INT AUTO_INCREMENT,
                                FolderID INT NOT NULL,
                                ItemName VARCHAR(100) NOT NULL,
                                ItemUrl VARCHAR(255) NOT NULL,
                                ItemIcon VARCHAR(255),
                                PRIMARY KEY (ItemID)
                                )"""


        with connection.cursor() as cursor:
            cursor.execute(create_user_query)
            cursor.execute(create_folder_query)
            cursor.execute(create_item_query)
            connection.commit()

except Error as e:
    print(e)
