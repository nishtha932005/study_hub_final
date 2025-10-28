const notesContainer = document.getElementById('notes-container');
const form = document.getElementById('add-note-form');
const titleInput = document.getElementById('note-title');
const contentInput = document.getElementById('note-content');

let notes = JSON.parse(localStorage.getItem('beautifulNotes') || '[]');

// Render notes with animation and neat structure
function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';

    // Heading
    const heading = document.createElement('h3');
    heading.textContent = note.title;
    noteCard.appendChild(heading);

    // Bullet list
    const ul = document.createElement('ul');
    note.content.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      ul.appendChild(li);
    });
    noteCard.appendChild(ul);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✖';
    deleteBtn.title = 'Delete this note';
    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      saveAndRender();
    };
    noteCard.appendChild(deleteBtn);

    notesContainer.appendChild(noteCard);
  });
}

// Save notes and rerender
function saveAndRender() {
  localStorage.setItem('beautifulNotes', JSON.stringify(notes));
  renderNotes();
}

// Handle form submit to add note
form.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const contentLines = contentInput.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  if (!title || contentLines.length === 0) return;

  notes.push({ title, content: contentLines });

  saveAndRender();

  // Clear form inputs smoothly
  titleInput.value = '';
  contentInput.value = '';
  titleInput.focus();
});

// Initial render on page load
renderNotes();
