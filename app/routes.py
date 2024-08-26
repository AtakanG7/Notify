from flask import Blueprint, jsonify, request, render_template
from app.models import Note
from app import db
import uuid
import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/share-board', methods=['POST'])
def share_board():
    data = request.json
    share_id = uuid.uuid4().hex
    for note_data in data['notes']:
        existing_note = Note.query.filter_by(id=note_data['id']).first()
        if existing_note:
            if existing_note.share_id:
                for key, value in note_data.items():
                    setattr(existing_note, key, value)
                existing_note.share_id = share_id
                db.session.add(existing_note)
        else:
            new_note = Note(
                id=note_data['id'],
                user_id=data['userId'],
                content=note_data['content'],
                x=note_data['x'],
                y=note_data['y'],
                color=note_data['color'],
                font=note_data['font'],
                type=note_data['type'],
                z_index=note_data['zIndex'],
                priority=note_data['priority'],
                created_at=datetime.datetime.utcnow(),
                share_id=share_id
            )
            db.session.add(new_note)
    db.session.commit()
    return jsonify({"id": share_id}), 201


@main.route('/shared/<share_id>')
def get_shared_board(share_id):
    notes = Note.query.filter_by(share_id=share_id).all()
    if not notes:
        return jsonify('Owner shared the same content again. Url has been changed!'), 200
    serializable_notes = [note.to_dict() for note in notes]
    return render_template('index.html', notes=serializable_notes)

