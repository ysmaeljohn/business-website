const track = document.getElementById('carouselTrack');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtns = document.querySelector('.carousel-btn.next');
const dotsContainer = document.getElementById('carouselDots');
const items = Array.from(track.querySelectorAll('.carousel-item'));
const gap = 16; // Match the CSS gap value
// const btn = document.getElementById("myButton");
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('primary-navigation');

function setNavOpen(isOpen) {
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  navMenu.classList.toggle('is-open', isOpen);
}

navToggle.addEventListener('click', () => {
  setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNavOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    setNavOpen(false);
    navToggle.focus();
  }
});

function setActiveNavLink(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
  });
}

function isAtPageBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
}

const observer = new IntersectionObserver(
  (entries) => {
    if (isAtPageBottom()) {
      setActiveNavLink('contact');
      return;
    }

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveNavLink(entry.target.id);
      }
    });
  },
  {
    // Triggers when a section crosses the middle activation band.
    rootMargin: '-30% 0px -50% 0px',
  }
);

sections.forEach((section) => observer.observe(section));
window.addEventListener('scroll', () => {
  if (isAtPageBottom()) {
    setActiveNavLink('contact');
  }
}, { passive: true });

function getScrollAmount() {
  return items[0].offsetWidth + gap;
}

// Calculate how many scroll stops exist based on screen width
function getTotalStops() {
  const visibleCards = Math.round(track.clientWidth / getScrollAmount());
  return Math.max(1, items.length - visibleCards + 1);
}

// Build dots based on valid scroll stops
function renderDots() {
  dotsContainer.innerHTML = '';
  const totalStops = getTotalStops();

  for (let i = 0; i < totalStops; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Go to position ${i + 1}`);
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      track.scrollTo({
        left: i * getScrollAmount(),
        behavior: 'smooth'
      });
    });

    dotsContainer.appendChild(dot);
  }
}

// Update active dot on scroll
function updateActiveDot() {
  const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
  const currentIndex = Math.round(track.scrollLeft / getScrollAmount());

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

// Initialize dots and recalculate if window resizes (desktop <-> mobile)
renderDots();
window.addEventListener('resize', () => {
  renderDots();
  updateActiveDot();
});

track.addEventListener('scroll', updateActiveDot);

nextBtns.addEventListener('click', () => {
  track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
});

/* btn.addEventListener("click", function() {
  window.location.href = "products.html";
}); */



