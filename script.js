const navLinks = document.querySelectorAll('.site-nav a');
const pageOverlay = document.querySelector('.page-overlay');
let customCursor = document.querySelector('.custom-cursor');
let cursorTrail = document.querySelector('.cursor-trail');
const heroSection = document.querySelector('.hero');
const visualCard = document.querySelector('.hero .visual-card');

if (!customCursor) {
  customCursor = document.createElement('div');
  customCursor.className = 'custom-cursor';
  document.body.appendChild(customCursor);
}

if (!cursorTrail) {
  cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);
}

const isLocalPageLink = (href) => href && href.endsWith('.html');

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (isLocalPageLink(href)) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (!pageOverlay) {
        window.location.href = href;
        return;
      }
      pageOverlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 420);
    });
  }
});

const sections = document.querySelectorAll('main section, .hero');
const links = document.querySelectorAll('.site-nav a');

function updateActiveLink() {
  const viewportCenter = window.innerHeight * 0.35;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionId = section.id;
    if (!sectionId) return;
    const active = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}` && active);
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  { threshold: 0.22 }
);

sections.forEach((section) => observer.observe(section));
window.addEventListener('scroll', updateActiveLink);
window.addEventListener('resize', updateActiveLink);
updateActiveLink();

if (heroSection && visualCard) {
  heroSection.addEventListener('pointermove', (event) => {
    const rect = heroSection.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    visualCard.style.transform = `translate3d(${offsetX * 16}px, ${offsetY * 12}px, 0) rotate(${offsetX * 4}deg)`;
  });

  heroSection.addEventListener('pointerleave', () => {
    visualCard.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
  });
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let trailX = mouseX;
let trailY = mouseY;

window.addEventListener('pointermove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (customCursor) {
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.top = `${mouseY}px`;
  }

  const target = event.target;
  if (target && (target.matches('a') || target.closest('button'))) {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.3)';
    cursorTrail.style.opacity = '0.9';
  } else {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorTrail.style.opacity = '0.75';
  }
});

function animateTrail() {
  const deltaX = mouseX - trailX;
  const deltaY = mouseY - trailY;
  trailX += deltaX * 0.18;
  trailY += deltaY * 0.18;

  if (cursorTrail) {
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
  }

  requestAnimationFrame(animateTrail);
}

requestAnimationFrame(animateTrail);
