from api.common import *
import api.routes.users.schemas as schemas
from api.routes.users.crud import create_dbuser, get_user_by_email, get_user_by_id
from api.routes.users.utils import get_password_hash, verify_password, generate_name, random_avatar, get_token, get_db

router = APIRouter(prefix='/api', tags=['Users'])
oauth_schema = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)
SECRET_KEY = os.getenv("SECRET_KEY")

@router.post("/users", status_code=201)
async def create_user(db: Session = Depends(get_db),
    name: str = Form(...), 
    email: str = Form(...),
    password: str = Form(...)
    ):
    try:
        existing_user = await get_user_by_email(db, email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = await get_password_hash(password)
        avatar = await random_avatar()
        kwargs = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "avatar": avatar
        }
        created_user = await create_dbuser(db, **kwargs)
        return {"message": "User created", "user_id": created_user.id}
    except Exception as e:
        logging.error(f"Error creating user: {e}")

@router.get("/session", response_model=schemas.Session)
async def get_user(db: Session = Depends(get_db), token: str = Depends(oauth_schema)):
    try:
        print(SECRET_KEY)
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        print(user_id)
        user = await get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logging.error(f"Error fetching user by id: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/auth", response_model=schemas.token)
async def auth_user(form_data: schemas.UserValidate, db: Session = Depends(get_db)):
    try:
        user = await get_user_by_email(db, form_data.email)
        if not user or not await verify_password(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        token = await get_token(data=user.id, key=SECRET_KEY, expires=datetime.timedelta(days=15))
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        logging.error(f"Error authenticating user: {e}")
        raise