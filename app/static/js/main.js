document.addEventListener('DOMContentLoaded', function() {
    const noteManager = new NoteManager();
    const uiManager = new UIManager(noteManager);
    
    noteManager.loadFromLocalStorage();
    if(window.location.href.indexOf('shared')===-1){
        uiManager.renderNotes();
    }

    if(window.location.href.indexOf('shared')!==-1){
        // add the notes to the board
        for (let i = 0; i < notes.length; i++) {
            uiManager.addNote1(notes[i]);
        }
    }
    document.getElementById('addNote').addEventListener('click', () => uiManager.addNote());
    document.getElementById('addImage').addEventListener('click', () => uiManager.addImage());
    document.getElementById('exportPDF').addEventListener('click', () => noteManager.exportToPDF());
    document.getElementById('shareBoard').addEventListener('click', () => noteManager.shareBoard());
    document.getElementById('saveNotes').addEventListener('click', () => noteManager.saveToLocalStorage());

    document.getElementById('zoomIn').addEventListener('click', () => uiManager.setZoom(uiManager.zoomLevel + 0.1));
    document.getElementById('zoomOut').addEventListener('click', () => uiManager.setZoom(uiManager.zoomLevel - 0.1));
    document.getElementById('resetZoom').addEventListener('click', () => uiManager.setZoom(1));

    document.getElementById('colorPicker').addEventListener('change', (e) => {
        const selectedNote = document.querySelector('.note.selected');
        if (selectedNote) {
            selectedNote.style.backgroundColor = e.target.value;
            noteManager.updateNote(selectedNote.dataset.id, { color: e.target.value });
        }
    });

    document.getElementById('fontSelector').addEventListener('change', (e) => {
        const selectedNote = document.querySelector('.note.selected');
        if (selectedNote) {
            const textarea = selectedNote.querySelector('textarea');
            if (textarea) {
                textarea.style.fontFamily = e.target.value;
                noteManager.updateNote(selectedNote.dataset.id, { font: e.target.value });
            }
        }
    });

    // Check if there's a shared userId in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUserId = urlParams.get('userId');
    if (sharedUserId) {
        noteManager.userId = sharedUserId;
        noteManager.loadFromLocalStorage();
        uiManager.renderNotes();
    }
});


const complementaryColors = [
    '#ff3e3e', '#3eff3e', '#3e3eff',
    '#ff3eff', '#ffff3e', '#3effff'
];

document.getElementById('colorPicker').addEventListener('input', function(e) {
    const selectedColor = e.target.value;
    e.target.value = closestColor;
});

