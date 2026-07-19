// Hamburger mobile menu
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
const helpPills = document.querySelectorAll('.help-pill');

function closeMenu() {
  drawer.classList.remove('open');
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.querySelectorAll('span')[0].style.transform = '';
  hamburger.querySelectorAll('span')[1].style.opacity = '1';
  hamburger.querySelectorAll('span')[2].style.transform = '';
}

function setSectionHighlight(section) {
  if (!section) return;
  section.classList.add('highlight');
  setTimeout(() => section.classList.remove('highlight'), 1200);
}

function scrollToSection(targetId) {
  const section = document.getElementById(targetId);
  if (!section) return;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setSectionHighlight(section);
}

if (helpPills.length) {
  helpPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      scrollToSection(pill.dataset.target);
    });
  });
}

hamburger.addEventListener('click', function() {
  const isOpen = drawer.classList.toggle('open');
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  const bars = hamburger.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    closeMenu();
  }
});

drawer.querySelectorAll('a').forEach(function(a) {
  a.addEventListener('click', closeMenu);
});

// Close if clicking outside
document.addEventListener('click', function(e) {
  if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
    closeMenu();
  }
});

// Formspree AJAX submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-msg');
    const errorMsg = document.getElementById('error-msg');

    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const data = new FormData(contactForm);

    try {
      const res = await fetch('https://formspree.io/f/mzdakapl', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        successMsg.style.display = 'block';
        successMsg.classList.add('animate');
        setTimeout(() => successMsg.classList.remove('animate'), 1400);
        contactForm.reset();
      } else {
        const json = await res.json();
        errorMsg.style.display = 'block';
        console.error('Formspree error:', json);
      }
    } catch (err) {
      errorMsg.style.display = 'block';
      console.error('Network error:', err);
    }

    btn.textContent = 'Send Message ✓';
    btn.disabled = false;
    btn.style.opacity = '1';
  });
}

// Intersection observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      e.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

// Elements to fade in
document.querySelectorAll('.service-card, .ai-feature, .about-text, .hero-badge, .hero-sub, .hero-actions').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});
