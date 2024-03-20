from flask import jsonify, make_response
from flask import request
from application.data.database import db
from application.data.models import User, Album, Track
from flask import current_app as app
from flask_jwt_extended import current_user, jwt_required


@app.route('/api/add/song', methods=('GET', 'POST'))
@jwt_required()
def create():
    if request.method == 'POST':
        title = request.form.get('title')
        audio_file = request.files.get('audio_file')
        print(audio_file, type(audio_file))
        if audio_file:
            audio_data = audio_file.read()
            audio_type = audio_file.filename.split('.')[-1]  # Extract the file extension
        lyrics = request.form.get('lyrics')
        album_id = request.form.get('album_id')
        error = None

        if not title:
            error = 'Title is required.'
        if not audio_file:
            error = 'audio_file is required.'
        if not album_id:
            error = 'album_id is required.'

        if error is not None:
            return jsonify({"message": "Something went wrong"}), 400
        else:
            if lyrics:
                track = Track(title=title, lyrics=lyrics, album_id=album_id,
                              audio_data=audio_data, audio_type=audio_type,
                              artist=current_user.username,
                              playlist_id=1)
                db.session.add(track)
                db.session.commit()
            else:
                track = Track(title=title, album_id=album_id,
                              audio_data=audio_data, audio_type=audio_type,
                              artist=current_user.username,
                              playlist_id=1)
                db.session.add(track)
                db.session.commit()
            return jsonify({"message": "Song uploaded successfully"}), 200


@app.route('/api/songs')
def get_songs():
    tracks = Track.query.all()
    songs = [
        {
            'id': song.id,
            'artist': song.artist,
            'title': song.title,
            'album': song.album,
            'lyrics': song.lyrics,
            'duration': song.duration,
            'playlist_id': song.playlist_id,
            'album_id': song.album_id
        }
        for song in tracks
    ]
    return jsonify(songs), 200


@app.route('/api/songs/curr')
def get_curr_songs():
    tracks = Track.query.all()
    songs = [
        {
            'artist': song.artist,
            'name': song.title,
            'image': None,
            'path': '/api/play/' + str(song.id),
        }
        for song in tracks
    ]
    return jsonify(songs), 200


@app.route('/api/play/<int:song_id>')
def play_audio(song_id):
    track = Track.query.filter_by(id=song_id).first()
    audio_data, audio_type = track.audio_data, track.audio_type
    response = make_response(audio_data)
    response.headers['Content-Type'] = f'audio/{audio_type}'
    return response
