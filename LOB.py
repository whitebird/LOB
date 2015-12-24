import sqlite3, json
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash
from contextlib import closing

DATABASE = './database/LOB.db'
DEBUG = True
SECRET_KEY = 'CHANGEME'
USERNAME = 'admin'
PASSWORD = 'CHANGEME'

app = Flask(__name__)
app.config.from_object(__name__)



def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route('/reset_database')
def reset_database():
    init_db()
    return 'Database has been reset!'


global names
names = set([])

@app.route('/')
def home():
    return render_template("login.html")

@app.route('/test', methods=['POST'])
def test():
    name = request.form['name'];
    response = {}
    if(name not in names):
        names.add(name)
        response["add_name"] = True
    else:
        response["add_name"] = False

    print names
    return json.dumps(response)

if __name__ == '__main__':
    app.debug = True
app.run(host='0.0.0.0')