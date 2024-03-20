from flask import jsonify
from flask import request
from flask_jwt_extended import create_access_token, get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt
from application.data.database import db
from application.data.models import User
from werkzeug.security import generate_password_hash
from flask import current_app as app
from flask_jwt_extended import unset_jwt_cookies, set_access_cookies
from datetime import datetime
from datetime import timedelta
from datetime import timezone


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
