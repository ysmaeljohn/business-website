lucide.createIcons();
const favoriteButtons = document.querySelectorAll('.fav-btn');

favoriteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    button.classList.toggle('favorited');
    
    if (button.classList.contains('favorited')) {
      button.setAttribute('title', 'remove from favorites');
      createHeartBurst(button);
    } else {
      button.setAttribute('title', 'add to favorites');
    }
  });
});

function createHeartBurst(button) {
  const container = button.closest('.img-container');
  const numHearts = 10;

  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement('span');
    heart.classList.add('scatter-heart');
    heart.textContent = '♥';
    
    const endX = (Math.random() - 0.5) * 80;
    const endY = (Math.random() - 0.5) * 80;

    heart.style.setProperty('--end-x', `${endX}px`);
    heart.style.setProperty('--end-y', `${endY}px`);

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 800);
  }
}