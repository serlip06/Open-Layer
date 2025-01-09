export function showPopup(title, message) {
  const popup = document.getElementById('input-popup');
  const popupTitle = popup.querySelector('h3');
  const popupMessage = document.getElementById('popup-coordinates');

  // Set the title and message
  popupTitle.textContent = title;
  popupMessage.textContent = message;

  // Show the popup
  popup.classList.add('visible');
}

// Close the popup (optional utility function)
export function closePopup() {
  const popup = document.getElementById('input-popup');
  popup.classList.remove('visible');
}

// JavaScript untuk menutup popup
document.getElementById('close-popup').addEventListener('click', function () {
  const popup = document.getElementById('input-popup');
  popup.classList.remove('visible');
});
