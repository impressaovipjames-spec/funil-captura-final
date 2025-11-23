from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class LeadBase(BaseModel):
    nome: str = Field(..., min_length=2, description="Nome completo do lead")
    email: EmailStr = Field(..., description="Email profissional do lead")

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: str
    created_at: str
    ip: Optional[str] = None

    class Config:
        from_attributes = True
