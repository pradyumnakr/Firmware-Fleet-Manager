from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, logic
from fastapi.middleware.cors import CORSMiddleware

# Create DB Tables (Auto-migration for MVP)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Firmware Fleet Manager")

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return database.get_db()

@app.get("/")
def read_root():
    return {"message": "Firmware Fleet Manager API"}

# Devices
@app.get("/devices", response_model=List[schemas.Device])
def read_devices(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    devices = db.query(models.Device).offset(skip).limit(limit).all()
    return devices

@app.post("/devices", response_model=schemas.Device)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(database.get_db)):
    db_device = models.Device(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

# Firmware
@app.get("/firmwares", response_model=List[schemas.Firmware])
def read_firmwares(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    firmwares = db.query(models.FirmwareVersion).offset(skip).limit(limit).all()
    return firmwares

@app.post("/firmwares", response_model=schemas.Firmware)
def create_firmware(firmware: schemas.FirmwareCreate, db: Session = Depends(database.get_db)):
    # Mock file path
    db_firmware = models.FirmwareVersion(**firmware.dict(), file_path=f"/s3/firmware/{firmware.version_string}.bin")
    db.add(db_firmware)
    db.commit()
    db.refresh(db_firmware)
    return db_firmware

# Deployments
@app.post("/deploy", response_model=schemas.Deployment)
def create_deployment(deployment: schemas.DeploymentCreate, db: Session = Depends(database.get_db)):
    db_deployment = models.Deployment(**deployment.dict())
    db.add(db_deployment)
    db.commit()
    db.refresh(db_deployment)
    
    # Trigger logic
    logic.distribute_update(db, db_deployment.id)
    
    return db_deployment

@app.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    total_devices = db.query(models.Device).count()
    online_devices = db.query(models.Device).filter(models.Device.status == "online").count()
    active_deployments = db.query(models.Deployment).filter(models.Deployment.status == "in_progress").count()
    return {
        "total_devices": total_devices,
        "online_devices": online_devices,
        "active_deployments": active_deployments
    }

# Mock Data Generation Endpoint for testing
@app.post("/seed")
def seed_data(db: Session = Depends(database.get_db)):
    if db.query(models.Device).count() == 0:
        db.add(models.Device(name="Device-001", group_name="canary", status="online"))
        db.add(models.Device(name="Device-002", group_name="canary", status="online"))
        db.add(models.Device(name="Device-003", group_name="stable", status="online"))
        db.add(models.Device(name="Device-004", group_name="stable", status="offline"))
        db.commit()
    
    if db.query(models.FirmwareVersion).count() == 0:
        db.add(models.FirmwareVersion(version_string="v1.0.0", file_path="/tmp", description="Initial Release"))
        db.add(models.FirmwareVersion(version_string="v1.1.0-RC1", file_path="/tmp", description="Beta Release"))
        db.commit()
        
    return {"message": "Data seeded"}
