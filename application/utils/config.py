class LocalDevelopmentConfig:
    DEBUG = True
    TESTING = True
    JWT_SECRET_KEY = "5#y2LF4Q8z\n\xec]/"
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
