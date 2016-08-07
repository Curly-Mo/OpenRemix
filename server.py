import os
import tempfile
from flask import Flask, request, jsonify, Response
from werkzeug import secure_filename

import api


app = Flask(__name__)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        suffix = os.path.splitext(filename)[1]
        with tempfile.NamedTemporaryFile(suffix=suffix) as temp:
            file.save(temp.name)
            analysis = api.Analysis(temp.name)
            serialized = analysis.to_json()
            response = Response(serialized, mimetype='text/json')
            return response
    else:
        return jsonify({
            'success': False,
            'error': 'Unable to read audio',
            'status': 500,
        })
