from fastapi import HTTPException, UploadFile
from typing import Tuple

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}

async def validate_image_file(file: UploadFile) -> bytes:
    """
    Validates uploaded image file type and size.
    Returns raw file bytes if valid, raises HTTPException otherwise.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided.")

    if file.content_type and file.content_type.lower() not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Only PNG, JPEG, and WebP images are supported."
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds 5MB limit ({round(len(content) / (1024*1024), 2)}MB uploaded)."
        )

    # Magic byte verification for PNG, JPEG, WEBP
    is_png = content.startswith(b'\x89PNG\r\n\x1a\n')
    is_jpeg = content.startswith(b'\xff\xd8\xff')
    is_webp = len(content) > 12 and content[:4] == b'RIFF' and content[8:12] == b'WEBP'

    if not (is_png or is_jpeg or is_webp):
        raise HTTPException(
            status_code=400,
            detail="File content does not match a valid PNG, JPEG, or WebP image signature."
        )

    return content
