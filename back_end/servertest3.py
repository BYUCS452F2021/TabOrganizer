from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify

import mysql.connector
from getpass import getpass
from mysql.connector import connect, Error

app = Flask(__name__)
api = Api(app)
# https://www.codementor.io/@sagaragarwal94/building-a-basic-restful-api-in-python-58k02xsiq
connection = connect( host="localhost", user="root", password='', database="TabOrganizer")


class User(Resource):
    # Login (returns userid if valid else returns -1)
    def get(self):
        json_data = request.get_json(force=True)
        username = json_data['username']
        password = json_data['password']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""SELECT UserID FROM USER WHERE UserName=%s AND Password=%s""",(username, password))
            checkUsername = cursor.fetchone()
        print(checkUsername)
        if checkUsername is None:
            print('Wrong username or password')
            return -1
        else:
            print('Logged In!', checkUsername)
            return checkUsername[0]


    # Add User (register, return userid)
    def post(self):
        json_data = request.get_json(force=True)
        username = json_data['username']
        password = json_data['password']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""SELECT UserID FROM USER WHERE UserName=%s""",(username,))
            checkUsername = cursor.fetchone()
            print(checkUsername)
            if checkUsername is None:
                cursor.execute("""INSERT INTO USER(UserName, Password) VALUES (%s, %s)""",(username, password))
                connection.commit()
                cursor.execute("""SELECT UserID FROM USER WHERE UserName=%s""",(username,))
                userid = cursor.fetchone()
                return userid[0]

            else:
                print('Username taken')
                return -1


# returns all folders for a given user
class UserFolders(Resource):
    def get(self, UserID):
        get_user_folder_query = "SELECT * FROM FOLDER WHERE USERID = " + UserID
        with connection.cursor() as cursor:
            cursor.execute(get_user_folder_query)
            folders = cursor.fetchall()
            print(folders)
            return {'user folders': [i for i in folders]}

# returns items for a given user
class UserFolderItems(Resource):
    def get(self, UserID):
        get_user_folder_query = "SELECT * FROM ITEM JOIN FOLDER ON ITEM.FOLDERID = FOLDER.FOLDERID WHERE FOLDER.USERID = " + UserID
        with connection.cursor() as cursor:
            cursor.execute(get_user_folder_query)
            folders = cursor.fetchall()
            print(folders)
            return {'user items': [i for i in folders]}


class Item(Resource):
    # Add Item (add item and return id)
    def post(self):
        json_data = request.get_json(force=True)
        folder_id = json_data['FolderID']
        item_name = json_data['ItemName']
        item_url = json_data['ItemUrl']
        item_icon = json_data['ItemIcon']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""SELECT * FROM FOLDER WHERE FolderID=%s""",(folder_id,))
            checkFolder = cursor.fetchone()
            if checkFolder is None:
                print("Folder doesn't exist")
                return -1
            else:
                cursor.execute("""INSERT INTO ITEM(FolderID, ItemName, ItemUrl, ItemIcon) VALUES (%s, %s, %s, %s)""",(folder_id, item_name, item_url, item_icon))
                connection.commit()
                cursor.execute("""SELECT last_insert_id()""")
                userid = cursor.fetchone()
                return userid[0]

class DeleteItem(Resource):
    # Delete Item (remove item)
    def post(self):
        json_data = request.get_json(force=True)
        item_id = json_data['ItemID']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""DELETE FROM ITEM WHERE ItemID=%s""",(item_id,))
            connection.commit()
            return 1

class UpdateItem(Resource):
    # Update Item Name
    def post(self):
        json_data = request.get_json(force=True)
        item_id = json_data['ItemID']
        item_name = json_data['ItemName']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""UPDATE ITEM SET ItemName = %s WHERE ItemID = %s;""",(item_name, item_id))
            connection.commit()
            return 1

# Debugging Methods
# returns all users
class Users(Resource):
    def get(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM USER")
            users = cursor.fetchall()
            return {'users': [i for i in users]}

# returns all folders
class Folders(Resource):
    def get(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM FOLDER")
            folders = cursor.fetchall()
            return {'folders': [i for i in folders]}

# returns all items
class Items(Resource):
    def get(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM ITEM")
            items = cursor.fetchall()
            return {'items': [i for i in items]}

# Make Paths
api.add_resource(User, '/user') # Register and Login
api.add_resource(Item, '/item') # Add item
api.add_resource(DeleteItem, '/deleteitem') # Delete item
api.add_resource(UpdateItem, '/updateitem') # Update item

api.add_resource(UserFolders, '/userfolders/<UserID>') # currently doest work, use JSON instead
api.add_resource(UserFolderItems, '/useritems/<UserID>') # currently doest work, use JSON instead

# For debugging
api.add_resource(Users, '/users')
api.add_resource(Folders, '/folders')
api.add_resource(Items, '/items')


if __name__ == '__main__':
     app.run(port='5002')
