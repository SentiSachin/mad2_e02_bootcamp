from flask import Flask
from flask import jsonify
from flask import request
from flask import render_template
from application.utils.config import LocalDevelopmentConfig
from flask_jwt_extended import create_access_token
from flask_jwt_extended import current_user
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from application.data.database import db
from application.data.models import User
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


# Decorator for verifying role
def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):

            if current_user.role == role:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="You don't have permission xyz!"), 403
        return decorator
    return wrapper


app = Flask(__name__)
# Setup the Flask-JWT-Extended extension
app.config.from_object(LocalDevelopmentConfig)
jwt = JWTManager(app)
db.init_app(app)
with app.app_context():
    db.create_all()
    db.session.commit()

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
    return User.query.filter_by(id=identity).one_or_none()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/who_am_i", methods=["GET"])
@jwt_required()
@role_required("user")
def protected():
    # We can now access our sqlalchemy User object via `current_user`.
    return jsonify(
        id=current_user.id,
        full_name=current_user.email,
        username=current_user.username,
    )


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    print(username, password, "sachin")
    user = User.query.filter_by(username=username).one_or_none()
    print(user, "sachin", user.check_password(password))
    if not user or not user.check_password(password):
        return jsonify("Wrong username or password"), 401

    # Notice that we are passing in the actual sqlalchemy user object here
    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
# @app.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     # Access the identity of the current user with get_jwt_identity
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200


if __name__ == "__main__":
    app.run()
