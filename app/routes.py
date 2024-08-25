from flask import Blueprint, jsonify, request, render_template
from app.models import Note
from app import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/notes/<user_id>', methods=['GET', 'POST'])
def manage_notes(user_id):
    if request.method == 'POST':
        notes_data = request.json
        Note.query.filter_by(user_id=user_id).delete()
        for note_data in notes_data:
            new_note = Note(
                id=note_data['id'],
                user_id=user_id,
                content=note_data['content'],
                x=note_data['x'],
                y=note_data['y'],
                color=note_data['color'],
                font=note_data['font'],
                type=note_data['type'],
                z_index=note_data['zIndex']
            )
            db.session.add(new_note)
        db.session.commit()
        return jsonify({"message": "Notes saved!"}), 201
    
    notes = Note.query.filter_by(user_id=user_id).all()
    return jsonify([note.to_dict() for note in notes]), 200