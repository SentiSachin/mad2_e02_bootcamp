from flask import jsonify
from functools import wraps
from flask_jwt_extended import current_user


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
