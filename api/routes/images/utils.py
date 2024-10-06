from api.common import *
from api.ml import siglip_model, siglip_processor

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_from_token(token: str=Depends(oauth2_scheme)):
    if token:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[algorithm])
        user_id = payload.get("sub")
        return user_id
    return None

async def generate_url(format: str) -> str:
    if format == "gif":
        return f"gifs/{uuid4().time}.{format}"
    return f"images/{uuid4().time}.{format}"
    
async def hash_image(image: Image) -> str:
    if image.format == 'GIF':
        # Hash the first and last frames of the GIF
        frames = list(ImageSequence.Iterator(image))
        if len(frames) > 1:
            first_frame_hash = await asyncio.to_thread(phash, frames[0].convert("RGB"))
            last_frame_hash = await asyncio.to_thread(phash, frames[-1].convert("RGB"))
            # Combine the hashes (e.g., concatenate)
            combined_hash = f"{first_frame_hash}{last_frame_hash}"
        else:
            frame_hash = await asyncio.to_thread(phash, frames[0].convert("RGB"))
            combined_hash = f"{frame_hash}{frame_hash}"
        return str(combined_hash)
    else:
        image_hash = await asyncio.to_thread(phash, image)
        return str(image_hash)

async def image_from_url(url: str):
    headers = {'User-Agent': UserAgent().random}
    async with aiohttp.ClientSession(headers=headers, connector=TCPConnector(verify_ssl=False)) as session:
        async with session.get(url) as response:
            image_bytes = await response.read()
            return image_bytes
        
async def text2vec(text: str):
    try:
        inputs = siglip_processor(text=[text], return_tensors="pt", padding="max_length", max_length=16, truncation=True)
        with torch.no_grad():
            text_features = siglip_model.get_text_features(**inputs)
        text_embedding = text_features.squeeze().cpu().numpy()        
        text_embedding = text_embedding / np.linalg.norm(text_embedding)    
        return text_embedding
    except Exception as e:
        raise e

async def img2vec(image: Image.Image):
    try:
        inputs = siglip_processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = siglip_model.get_image_features(**inputs)
        image_embedding = outputs.squeeze().cpu().numpy()
        image_embedding = image_embedding / np.linalg.norm(image_embedding)      
        return image_embedding
    except Exception as e:
        raise e

