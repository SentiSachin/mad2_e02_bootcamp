from datetime import timedelta


class LocalDevelopmentConfig:
    DEBUG = True
    TESTING = True
    JWT_SECRET_KEY = "5#y2LF4Q8z\n\xec]/"
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_COOKIE_SECURE = False
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    # JWT_COOKIE_CSRF_PROTECT = False
