from flask import Flask
from flask import render_template
from application.utils.config import LocalDevelopmentConfig
from flask_jwt_extended import JWTManager
from application.data.database import db
from application.data.models import User
from werkzeug.security import generate_password_hash
from flask import jsonify
from flask import request
from application.data.models import User, Track
from flask import current_app as app
from flask_jwt_extended import current_user, jwt_required
from flask import jsonify
from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt
from application.data.database import db
from application.data.models import User
from werkzeug.security import generate_password_hash
from flask import current_app as app
from flask_jwt_extended import unset_jwt_cookies, set_access_cookies



app = Flask(__name__)
# Setup the Flask-JWT-Extended extension
app.config.from_object(LocalDevelopmentConfig)
jwt = JWTManager(app)
db.init_app(app)
with app.app_context():
    db.create_all()
    admin = User.query.filter_by(username="admin").one_or_none()
    if not admin:
        admin = User(
            username="admin",
            password=generate_password_hash("password", method="scrypt"),
            role="admin",
            email="admin@gmail.com"
        )
        db.session.add(admin)
        db.session.commit()
app.app_context().push()


# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).first()


@app.route("/")
def index():
    return render_template("index.html")

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@app.route('/register', methods=['POST'])
def signup_post():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        return jsonify({'error': 'User already exists'}), 409
    else:
        new_user = User(email=data["email"], username=data["username"],
                        role='user',
                        password=generate_password_hash(data["password"],
                                                        method='scrypt'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created'}), 201


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    print(username, password, "sachin")
    user = User.query.filter_by(username=username).one_or_none()
    print(user, "testcheck5")
    if not user or not user.check_password(password):
        return jsonify("Wrong username or password"), 401

    # Notice that we are passing in the actual sqlalchemy user object here
    access_token = create_access_token(identity=user)
    response = jsonify({"msg": "login successful"})
    set_access_cookies(response, access_token)
    return response


@app.route("/auth/user")
@jwt_required()
def isAuth():
    user = get_jwt_identity()
    print(user, "testcheck2")
    response = jsonify({"user": user})
    return response


@app.route('/api/creator', methods=['POST'])
def creator():
    if request.method == 'POST':
        json_data = request.get_json()

        username = json_data.get('username')
        password = json_data.get('password')
        email = json_data.get('email')
        error = None
        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        elif not email:
            error = 'email is required.'
        if error is None:
            user = User.query.filter_by(username=username).one_or_none()
            if not user:
                user = User.query.filter_by(email=email).one_or_none()
                if not user:
                    user = User(
                        username=username,
                        password=generate_password_hash(password, method='scrypt'),
                        email=email,
                        role='creator'
                    )
                    db.session.add(user)
                    db.session.commit()
                    return jsonify({'data': 'success'}), 200
                else:
                    error = f"Creator {email} is already registered."
                    return jsonify({'error': error}), 401
            else:
                error = f"Creator {username} is already registered."
                return jsonify({'error': error}), 401            
        return jsonify({'error': error}), 404


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


from application.controllers.album import addalbum
from application.controllers.songsrouter import *

if __name__ == "__main__":
    app.run()
