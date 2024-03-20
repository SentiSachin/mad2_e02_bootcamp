from application.data.database import db
# from hmac import compare_digest
from werkzeug.security import check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    playlists = db.relationship('Playlist', backref='user', lazy=True)

    # NOTE: In a real application make sure to properly hash and salt passwords
    def check_password(self, password):
        return check_password_hash(self.password, password)




class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    tracks = db.relationship('Track', lazy=True)

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tracks = db.relationship('Track', backref='playlist', lazy=True)

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    album = db.Column(db.String(100))
    lyrics = db.Column(db.String(200))
    audio_data = db.Column(db.LargeBinary, nullable=False)
    audio_type = db.Column(db.String(200))
    duration = db.Column(db.Integer)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.id'),
                            nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable=False)

