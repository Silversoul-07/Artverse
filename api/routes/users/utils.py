from api.common import *

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_password_hash(password):
    return pwd_context.hash(password)

async def generate_name() -> str:
    base_name = coolname.generate_slug(2).replace('-', '_')
    random_number = random.randint(0, 100)
    username = f"{base_name}{random_number}"
    return username

async def random_avatar() -> str:
    avatars = os.listdir("media/avatar")
    return f"avatar/{random.choice(avatars)}"

async def get_token(data: dict, key:str, algorithm:str="HS256", expires: datetime.timedelta = None):
    to_encode = {"sub": data, "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30)}
    if expires:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires
        to_encode.update({"exp": expire})
    return jwt.encode(to_encode, key, algorithm)
