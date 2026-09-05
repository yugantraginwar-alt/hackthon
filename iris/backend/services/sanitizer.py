import re

def sanitize_text(text: str) -> str:
    """
    Sanitizes sensitive user input before logging or database persistence.
    Strips OTPs, PINs, passwords, and 16-digit card numbers.
    """
    if not text:
        return ""
    
    # 1. Mask 4-8 digit OTP / PIN references
    sanitized = re.sub(r'(?i)\b(otp|pin|cvv|code|pwd|password)[\s:=#\-]*([0-9a-zA-Z]{4,8})\b', r'\1: [REDACTED]', text)
    
    # 2. Mask 16-digit credit/debit card numbers
    sanitized = re.sub(r'\b(?:\d[ -]*?){13,16}\b', '[CARD-REDACTED]', sanitized)
    
    # 3. Strip excessive control chars
    sanitized = "".join(ch for ch in sanitized if ch.isprintable() or ch in '\n\r\t')
    
    # 4. Cap length
    if len(sanitized) > 2000:
        sanitized = sanitized[:2000] + "... [TRUNCATED]"
        
    return sanitized
