from app import db
from datetime import datetime

class Note(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)
    color = db.Column(db.String(20), nullable=False)
    font = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(10), nullable=False)
    z_index = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    priority = db.Column(db.String(10), nullable=False, default=0)
    share_id = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'x': self.x,
            'y': self.y,
            'color': self.color,
            'font': self.font,
            'type': self.type,
            'zIndex': self.z_index,
            'createdAt': self.created_at.isoformat(),
            'priority': self.priority,
            'share_id': self.share_id
        }
