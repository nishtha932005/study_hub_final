// Toggle the visibility of lecture list for a chapter
function toggleLectures(id) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
}

// Open video modal and play selected video
function openVideo(src) {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('lectureVideo');
  video.src = src;
  modal.classList.remove('hidden');
  video.play();
}

// Close video modal and stop video playback
function closeVideo() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('lectureVideo');
  video.pause();
  video.removeAttribute('src');  // Remove video source
  video.load();                  // Reset video element
  modal.classList.add('hidden');
}
