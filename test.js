const stars = document.querySelectorAll('.star');
const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');
const avgScoreEl = document.getElementById('avg-score');
const reviewCountEl = document.getElementById('review-count');

let selectedRating = 0;
// Load existing reviews from localStorage or start with an empty array
let reviews = JSON.parse(localStorage.getItem('productReviews')) || [];

// 1. Handle Star Hover & Click Interactions
stars.forEach((star) => {
  star.addEventListener('mouseover', () => {
    highlightStars(star.dataset.value, 'hovered');
  });

  star.addEventListener('mouseout', () => {
    clearStars('hovered');
  });

  star.addEventListener('click', () => {
    selectedRating = Number(star.dataset.value);
    highlightStars(selectedRating, 'selected');
  });
});

function highlightStars(count, className) {
  clearStars(className);
  stars.forEach((star) => {
    if (Number(star.dataset.value) <= count) {
      star.classList.add(className);
    }
  });
}

function clearStars(className) {
  stars.forEach((star) => star.classList.remove(className));
}

// 2. Handle Form Submission
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (selectedRating === 0) {
    alert('Please select a star rating before submitting.');
    return;
  }

  const username = document.getElementById('username').value.trim();
  const comment = document.getElementById('comment').value.trim();

  const newReview = {
    username,
    rating: selectedRating,
    comment,
    date: new Date().toLocaleDateString()
  };

  reviews.unshift(newReview); // Add newest review to the top
  localStorage.setItem('productReviews', JSON.stringify(reviews));

  // Reset form and stars
  reviewForm.reset();
  selectedRating = 0;
  clearStars('selected');

  renderReviews();
});

// 3. Render Reviews & Calculate Average
function renderReviews() {
  reviewsList.innerHTML = '';

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    avgScoreEl.textContent = '0.0';
    reviewCountEl.textContent = '0';
    return;
  }

  let totalScore = 0;

  reviews.forEach((rev) => {
    totalScore += rev.rating;

    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review-item');
    
    // Create visual stars for the submitted review
    const filledStars = '&#9733;'.repeat(rev.rating);
    const emptyStars = '&#9734;'.repeat(5 - rev.rating);

    // Escape user text to prevent XSS
    const safeName = escapeHTML(rev.username);
    const safeComment = escapeHTML(rev.comment);

    reviewDiv.innerHTML = `
      <div class="review-header">
        <span>${safeName}</span>
        <span class="review-stars">${filledStars}${emptyStars}</span>
      </div>
      <small style="color: #777;">${rev.date}</small>
      <p style="margin-top: 6px;">${safeComment}</p>
    `;
    reviewsList.appendChild(reviewDiv);
  });

  const average = (totalScore / reviews.length).toFixed(1);
  avgScoreEl.textContent = average;
  reviewCountEl.textContent = reviews.length;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initial render on page load
renderReviews();
