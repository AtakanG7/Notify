class NoteManager {
    constructor() {
        this.notes = [];
        this.userId = this.getUserId();
    }

    getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    addNote(note) {
        this.notes.push(note);
        this.saveToLocalStorage();
    }

    updateNote(id, updates) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            Object.assign(note, updates);
            this.saveToLocalStorage();
        }
    }

    deleteNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem(`notes_${this.userId}`, JSON.stringify(this.notes));
    }

    loadFromLocalStorage() {
        const savedNotes = localStorage.getItem(`notes_${this.userId}`);
        this.notes = savedNotes ? JSON.parse(savedNotes) : [];
    }

    exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;
        
        this.notes.forEach(note => {
            doc.setFontSize(16);
            doc.text(note.content, 10, y);
            y += 20;
        });

        doc.save('notes.pdf');
    }

    shareBoard() {
        fetch('/share-board', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.userId,
                notes: this.notes
            })
        }).then(response => response.json())
        .then(data => {
            const shareUrl = `${window.location.origin}/shared/${data.id}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Share link copied to clipboard!', shareUrl);
            });
        });
    }
}