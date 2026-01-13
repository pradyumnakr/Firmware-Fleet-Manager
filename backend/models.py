from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    group_name = Column(String, default="stable")
    current_version = Column(String)
    status = Column(String, default="offline")
    last_seen = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)

class FirmwareVersion(Base):
    __tablename__ = "firmware_versions"

    id = Column(Integer, primary_key=True, index=True)
    version_string = Column(String, unique=True, index=True, nullable=False)
    file_path = Column(String, nullable=False)
    release_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    description = Column(Text)

class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(Integer, primary_key=True, index=True)
    firmware_id = Column(Integer, ForeignKey("firmware_versions.id"))
    target_group = Column(String, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    firmware = relationship("FirmwareVersion")

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    message = Column(Text)
    log_level = Column(String, default="info")
    timestamp = Column(DateTime, default=datetime.utcnow)

    device = relationship("Device")
