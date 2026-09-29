import logging
import httpx
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status
from app.core.config import settings

logger = logging.getLogger(__name__)

class ClerkAuthManager:
    """
    Clerk Authentication & Identity Manager for FastAPI.
    Supports JWT verification against Clerk Backend API / JWKS
    with automatic pass-through in development/demo mode.
    """
    def __init__(self):
        self.secret_key = settings.CLERK_SECRET_KEY
        self.publishable_key = settings.CLERK_PUBLISHABLE_KEY
        self.jwks_url = settings.CLERK_JWKS_URL
        self.auth_enabled = settings.AUTH_ENABLED and bool(self.secret_key or self.publishable_key)

    async def get_current_user(self, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
        """
        FastAPI dependency to extract and verify Clerk user from Bearer token.
        """
        # In Demo Mode or if Auth is not explicitly enabled with keys, allow seamless dev access
        if not self.auth_enabled:
            return {
                "user_id": "user_sre_lead",
                "email": "commander@incidentmind.ai",
                "name": "Incident Commander",
                "role": "Lead SRE",
                "auth_provider": "clerk_sandbox",
                "is_authenticated": True
            }

        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or malformed Authorization header. Expected 'Bearer <clerk_token>'",
                headers={"WWW-Authenticate": "Bearer"}
            )

        token = authorization.split(" ")[1]

        try:
            # Verify token with Clerk Backend API
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {
                    "Authorization": f"Bearer {self.secret_key}",
                    "Content-Type": "application/json"
                }
                # Clerk's Client / Session verification endpoint
                verify_url = "https://api.clerk.com/v1/tokens/verify"
                resp = await client.post(verify_url, json={"token": token}, headers=headers)
                
                if resp.status_code == 200:
                    data = resp.json()
                    return {
                        "user_id": data.get("sub", data.get("user_id", "clerk_user")),
                        "email": data.get("email", "engineer@incidentmind.ai"),
                        "name": data.get("name", "SRE Engineer"),
                        "role": data.get("role", "SRE Responder"),
                        "auth_provider": "clerk_live",
                        "is_authenticated": True
                    }
                else:
                    logger.warning(f"Clerk verification failed ({resp.status_code}): {resp.text}")
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid or expired Clerk session token",
                        headers={"WWW-Authenticate": "Bearer"}
                    )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error connecting to Clerk Auth service: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authentication provider temporarily unavailable"
            )

auth_manager = ClerkAuthManager()

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    return await auth_manager.get_current_user(authorization)
