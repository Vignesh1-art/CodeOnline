from flask import Flask
from flask import render_template,send_from_directory

app = Flask(__name__)

@app.route('/compilerservice')
def getCompilerService():
    pass

if __name__ == '__main__':
   app.run()