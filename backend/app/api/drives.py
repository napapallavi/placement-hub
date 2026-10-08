from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import User, PlacementDrive, Company, UserRole
from app.schemas.schemas import PlacementDriveCreate, PlacementDriveResponse
from app.api.deps import get_current_user, require_admin

router = APIRouter(prefix="/drives", tags=["drives"])

@router.get("", response_model=List[PlacementDriveResponse])
def get_placement_drives(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PlacementDrive)
    if status_filter:
        query = query.filter(PlacementDrive.status == status_filter)
    drives = query.order_by(PlacementDrive.drive_date.asc()).all()

    results = []
    for d in drives:
        resp = PlacementDriveResponse.model_validate(d)
        if d.company:
            resp.company_name = d.company.company_name
        results.append(resp)
    return results

@router.post("", response_model=PlacementDriveResponse)
def create_placement_drive(
    drive_in: PlacementDriveCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in [UserRole.ADMIN.value, UserRole.RECRUITER.value]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    company_id = drive_in.company_id
    if current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if company:
            company_id = company.id

    drive = PlacementDrive(
        title=drive_in.title,
        description=drive_in.description,
        company_id=company_id,
        drive_date=drive_in.drive_date,
        venue=drive_in.venue,
        eligibility_criteria=drive_in.eligibility_criteria,
        status=drive_in.status
    )
    db.add(drive)
    db.commit()
    db.refresh(drive)

    resp = PlacementDriveResponse.model_validate(drive)
    if drive.company:
        resp.company_name = drive.company.company_name
    return resp

@router.put("/{drive_id}", response_model=PlacementDriveResponse)
def update_placement_drive(
    drive_id: int,
    drive_in: PlacementDriveCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")

    drive.title = drive_in.title
    drive.description = drive_in.description
    drive.company_id = drive_in.company_id
    drive.drive_date = drive_in.drive_date
    drive.venue = drive_in.venue
    drive.eligibility_criteria = drive_in.eligibility_criteria
    drive.status = drive_in.status

    db.commit()
    db.refresh(drive)

    resp = PlacementDriveResponse.model_validate(drive)
    if drive.company:
        resp.company_name = drive.company.company_name
    return resp

@router.delete("/{drive_id}")
def delete_placement_drive(
    drive_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    drive = db.query(PlacementDrive).filter(PlacementDrive.id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")

    db.delete(drive)
    db.commit()
    return {"message": "Placement drive deleted successfully"}
