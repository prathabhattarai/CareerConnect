from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.notification import Notification


def create_notification(db: Session, user_id: int, title: str, message: str, notification_type: str = None, related_id: int = None):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        related_id=related_id
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_unread_count(db: Session, user_id: int) -> int:
    return db.query(func.count(Notification.id)).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).scalar()
