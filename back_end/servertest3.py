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
connection = connect( host="localhost", user="root", password="password", database="TabOrganizer")

#All Classes expect a JSON file with the required information. We can test this right now using PostMan or similar programs.

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


#Add an Item
class AddItem(Resource):
    # Add Item (add item and return id)
    def post(self):
        json_data = request.get_json(force=True)
        folder_id = json_data['FolderID']
        item_name = json_data['ItemName']
        item_url = json_data['ItemUrl']
        item_icon = json_data['ItemIcon']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""SELECT * FROM FOLDER WHERE FolderID=%s""",(folder_id))
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

# returns items for a given folder
class GetItems(Resource):
    def get(self):
        json_data = request.get_json(force=True)
        folder_id = json_data['FolderID']
        with connection.cursor() as cursor:
            cursor.execute("""SELECT * FROM folder WHERE FOLDERID = """ + folder_id)
            items = cursor.fetchall()
            return {'user items': [i for i in items]}

class DeleteItem(Resource):
    # Delete Item (remove item)
    def post(self):
        json_data = request.get_json(force=True)
        item_id = json_data['ItemID']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""DELETE FROM ITEM WHERE ItemID = """ + item_id)
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





#Adds a Folder to the Databse
class AddFolder(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        folder_name = json_data['FolderName']
        folder_updated = json_data['DateUpdated']
        user_id = json_data['UserID']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""INSERT INTO folder(FolderName, DateUpdated, UserID) VALUES (%s, %s, %s)""",(folder_name, folder_updated, user_id))
            connection.commit()
            cursor.execute("""SELECT last_insert_id()""")
            folderid = cursor.fetchone()
            return folderid[0]

#Gets all Folders for a given User
class GetFolder(Resource):
    def get(self):
        json_data = request.get_json(force=True)
        user_id = json_data['UserID']
        # get_user_folder_query = "" + UserID
        with connection.cursor() as cursor:
            cursor.execute("""SELECT * FROM FOLDER WHERE USERID =""" + user_id)
            folders = cursor.fetchall()
            return {'folders': [i for i in folders]}

#Deletes a Folder from the Database
class DeleteFolder(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        folder_id = json_data['FolderID']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""DELETE FROM folder WHERE FolderID=%s""",(folder_id,))
            connection.commit()
            return 1

#Updates a Folder Name on the Database
class UpdateFolder(Resource):
    # Update Item Name
    def post(self):
        json_data = request.get_json(force=True)
        folder_id = json_data['FolderID']
        folder_name = json_data['FolderName']

        with connection.cursor(buffered=True) as cursor:
            cursor.execute("""UPDATE folder SET FolderName = %s WHERE folderID = %s;""",(folder_name, folder_id))
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

#User Paths
api.add_resource(User, '/user') # Register and Login

#Item Paths
api.add_resource(AddItem, '/additem') # Add item
api.add_resource(GetItems, '/useritems') # Get Items from Folder
api.add_resource(DeleteItem, '/deleteitem') # Delete item
api.add_resource(UpdateItem, '/updateitem') # Update item

#Folder Paths
api.add_resource(AddFolder, '/addfolder') # Add Folder
api.add_resource(GetFolder, '/userfolders') # currently doest work, use JSON instead
api.add_resource(DeleteFolder, '/deletefolder') # Delete Folder
api.add_resource(UpdateFolder, '/updatefolder') # Update Folder Name

# For debugging
api.add_resource(Users, '/users')
api.add_resource(Folders, '/folders')
api.add_resource(Items, '/items')


if __name__ == '__main__':
     app.run(port='5002')
