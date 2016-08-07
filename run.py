#!/usr/bin/env python
"""
Initialize Flask app

"""
# app.config.from_pyfile('flaskapp.cfg')

from server import app

if __name__ == '__main__':
    app.run(debug=True)
