const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contact-form');

function setMenuState(isOpen) {
  if (!drawer || !hamburger) return;
  drawer.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  const bars = hamburger.querySelectorAll('span');
  if (bars.length) {
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '1';
      bars[2].style.transform = '';
    }
  }
}

function closeMenu() {
  setMenuState(false);
}

if (hamburger && drawer) {
  hamburger.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = drawer.classList.contains('open');
    setMenuState(!isOpen);
  });

  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    const clickedInside = hamburger.contains(event.target) || drawer.contains(event.target);
    if (!clickedInside) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

if (revealElements.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('in'));
}

if (contactForm) {
  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-msg');
    const errorMessage = document.getElementById('error-msg');

    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    if (submitButton) {
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      submitButton.style.opacity = '0.7';
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://formspree.io/f/mzdakapl', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (successMessage) {
          successMessage.style.display = 'block';
          successMessage.classList.add('animate');
          setTimeout(() => successMessage.classList.remove('animate'), 1400);
        }
        contactForm.reset();
      } else {
        let payload = null;
        try {
          payload = await response.json();
        } catch (error) {
          payload = null;
        }
        if (errorMessage) {
          errorMessage.style.display = 'block';
        }
        console.error('Formspree error:', payload);
      }
    } catch (error) {
      if (errorMessage) {
        errorMessage.style.display = 'block';
      }
      console.error('Network error:', error);
    }

    if (submitButton) {
      submitButton.textContent = 'Send message';
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
    }
  });
}
