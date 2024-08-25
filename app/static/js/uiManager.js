class UIManager {
    constructor(noteManager) {
        this.noteManager = noteManager;
        this.container = document.getElementById('noteContainer');
        this.colorPicker = document.getElementById('colorPicker');
        this.fontSelector = document.getElementById('fontSelector');
        this.zoomLevel = 1;
    }

    createNoteElement(note) {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.style.left = note.x + 'px';
        noteEl.style.top = note.y + 'px';
        noteEl.style.backgroundColor = note.color;
        noteEl.style.zIndex = note.zIndex || 1;
        noteEl.dataset.id = note.id;

        noteEl.innerHTML = `
            <div class="note-header">
                <div class="drag-handle"><i class="fas fa-arrows-alt"></i></div>
                <button class="delete-note"><i class="fas fa-times"></i></button>
            </div>
            ${note.type === 'image' 
                ? `<img src="${note.content}" class="image-note" alt="User uploaded image">`
                : `<textarea style="font-family: ${note.font};">${note.content}</textarea>`}
        `;

        this.setupNoteEvents(noteEl);
        return noteEl;
    }

    setupNoteEvents(noteEl) {
        const dragHandle = noteEl.querySelector('.drag-handle');
        const deleteBtn = noteEl.querySelector('.delete-note');
        const textarea = noteEl.querySelector('textarea');

        dragHandle.addEventListener('mousedown', this.startDragging.bind(this));
        deleteBtn.addEventListener('click', () => this.deleteNote(noteEl));
        
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.noteManager.updateNote(noteEl.dataset.id, { content: textarea.value });
            });
        }
    }

    startDragging(e) {
        const noteEl = e.target.closest('.note');
        const startX = e.clientX - noteEl.offsetLeft;
        const startY = e.clientY - noteEl.offsetTop;

        const doDrag = (e) => {
            noteEl.style.left = (e.clientX - startX) + 'px';
            noteEl.style.top = (e.clientY - startY) + 'px';
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            this.noteManager.updateNote(noteEl.dataset.id, {
                x: parseInt(noteEl.style.left),
                y: parseInt(noteEl.style.top)
            });
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    deleteNote(noteEl) {
        this.noteManager.deleteNote(noteEl.dataset.id);
        noteEl.remove();
    }

    addNote(type = 'text') {
        const note = {
            id: 'note_' + Date.now(),
            content: type === 'text' ? 'New Note' : '',
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 100),
            color: this.colorPicker.value,
            font: this.fontSelector.value,
            type: type,
            zIndex: this.noteManager.notes.length + 1
        };

        this.noteManager.addNote(note);
        const noteEl = this.createNoteElement(note);
        this.container.appendChild(noteEl);
    }

    renderNotes() {
        this.container.innerHTML = '';
        this.noteManager.notes.forEach(note => {
            const noteEl = this.createNoteElement(note);
            this.container.appendChild(noteEl);
        });
    }

    setZoom(zoom) {
        this.zoomLevel = zoom;
        this.container.style.transform = `scale(${zoom})`;
        this.container.style.transformOrigin = 'top left';
    }

    addImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                this.addNote('image');
                const lastNote = this.noteManager.notes[this.noteManager.notes.length - 1];
                lastNote.content = event.target.result;
                this.noteManager.updateNote(lastNote.id, { content: lastNote.content });
                this.renderNotes();
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }
}