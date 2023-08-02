from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template('dashboard.html')

@app.route("/tasks")
def tasks():
    return render_template("tasks.html")

@app.route("/send")
def send():
    return render_template("send.html")

@app.route("/setting")
def setting():
    return render_template("setting.html")