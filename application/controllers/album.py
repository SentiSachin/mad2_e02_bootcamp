from flask import jsonify
from flask import request
from flask_jwt_extended import jwt_required
from application.data.database import db
from application.data.models import User, Album
from werkzeug.security import generate_password_hash
from flask import current_app as app


@app.route('/api/create', methods=['POST'])
@jwt_required()
def addalbum():
    data = request.get_json()
    title = data.get('title')
    genre = data.get('genre')
    already_exists = Album.query.filter_by(title=title).first()
    if already_exists:
        return jsonify({'error': 'Album already exists'}), 409
    else:
        new_album = Album(title=title, genre=genre)
        db.session.add(new_album)
        db.session.commit()
        return jsonify({'message': 'Album created'}), 201


@app.route('/get/ablum')
def getalbums():
    albums = Album.query.all()
    albums = [{
        'id': album.id,
        'title': album.title,
        'genre': album.genre
    } for album in albums]
    return jsonify(albums)
