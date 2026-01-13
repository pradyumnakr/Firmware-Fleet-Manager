from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class DeviceBase(BaseModel):
    name: str
    group_name: str = "stable"
    current_version: Optional[str] = None
    status: str = "offline"
    ip_address: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int
    last_seen: datetime

    class Config:
        orm_mode = True

class FirmwareBase(BaseModel):
    version_string: str
    description: Optional[str] = None
    is_active: bool = True

class FirmwareCreate(FirmwareBase):
    pass

class Firmware(FirmwareBase):
    id: int
    release_date: datetime
    file_path: str

    class Config:
        orm_mode = True

class DeploymentCreate(BaseModel):
    firmware_id: int
    target_group: str

class Deployment(DeploymentCreate):
    id: int
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True
