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

# returns all users
class Users(Resource):
    def get(self):
        get_user_query = "SELECT * FROM USER"
        with connection.cursor() as cursor:
            cursor.execute(get_user_query)
            users = cursor.fetchall()
            return {'users': [i for i in users]}

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




api.add_resource(Users, '/users') # Route_1
#api.add_resource(Tracks, '/tracks') # Route_2
api.add_resource(UserFolders, '/userfolders/<UserID>') # Route_3
api.add_resource(UserFolderItems, '/useritems/<UserID>')


if __name__ == '__main__':
     app.run(port='5002')
