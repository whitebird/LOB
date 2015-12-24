import sqlite3, json, random
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
    print "Initing database"
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
global started
global roundnmb
global chooser
names = []
started = False
roundnmb = 1
chooser = ""


@app.route('/')
def home():
    return render_template("login.html")


@app.route('/add_name', methods=['POST'])
def add_name():
    name = request.form['name'];
    response = {}
    if name not in names:
        names.append(name)
        response["add_name"] = True
    else:
        response["add_name"] = False

    return json.dumps(response)


@app.route('/get_lobby_file')
def get_lobby_file():
    return json.dumps({"lobby_html" : render_template("lobby.html")})


@app.route('/names')
def get_names():
    global names
    return json.dumps({"names" : names})


@app.route('/start_game')
def start_game():
    global started
    started= True
    return "Starting game"


@app.route('/check_game_status', methods=['POST'])
def check_game_status():
    output = {"started" : started}
    if started:
        global names
        global chooser
        if not chooser:
            chooser = random.choice(names)
            print "Choosing category: " + chooser

        name = request.form['name'];
        chooses_categories = False
        if name.lower() == chooser.lower():
            chooses_categories = True

        output["chooser"] = chooser
        output["category_html"] = render_template("category.html", chooser=chooser, chooses_categories=chooses_categories)
    return json.dumps(output)

if __name__ == '__main__':
    app.debug = True
app.run(host='0.0.0.0')