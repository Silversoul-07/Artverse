from api.common import *
from api.routes.users.models import Users

async def create_dbuser(db: Session, **kwargs):
    try:
        db_user = Users(**kwargs)
        db.add(db_user)
        db.commit()
        return db_user
    except Exception as e:
        db.rollback()
        raise e

async def get_user_by_email(db: Session, email: str):
    try:
        return db.query(Users).filter(Users.email == email).first()
    except Exception as e:
        logger.error(f"Error fetching user by email: {email}")
        raise

async def get_user_by_id(db: Session, id: str):
    try:
        return db.query(Users).filter(Users.id == id).first()
    except Exception as e:
        logger.error(f"Error fetching user by id: {id}")
        raise