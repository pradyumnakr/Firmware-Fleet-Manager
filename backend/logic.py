from sqlalchemy.orm import Session
from . import models
import random

def distribute_update(db: Session, deployment_id: int):
    """
    Simulates the distribution logic.
    Finds devices in the target group and 'pushes' the update to them.
    In a real scenario, this would send MQTT messages or HTTP requests to devices.
    """
    deployment = db.query(models.Deployment).filter(models.Deployment.id == deployment_id).first()
    if not deployment:
        return {"error": "Deployment not found"}
    
    deployment.status = "in_progress"
    db.commit()

    target_group = deployment.target_group
    firmware = db.query(models.FirmwareVersion).filter(models.FirmwareVersion.id == deployment.firmware_id).first()
    
    # Select devices
    devices = db.query(models.Device).filter(models.Device.group_name == target_group).all()
    
    updated_count = 0
    for device in devices:
        # Simulate check: is device online?
        if device.status != "offline":
             # "Deploy" logic
             device.status = "updating"
             device.current_version = firmware.version_string
             # Log it
             log = models.Log(device_id=device.id, message=f"Started update to {firmware.version_string}")
             db.add(log)
             updated_count += 1
    
    db.commit()
    
    # Simulate completion
    deployment.status = "completed"
    deployment.completed_at = models.datetime.utcnow()
    db.commit()

    return {"message": f"Deployment started for {updated_count} devices in group {target_group}"}
