// ===== EMAILJS SETUP =====
const EMAILJS_PUBLIC_KEY  = 'ZMsl2hCvPzD1mH5fU';
const EMAILJS_SERVICE_ID  = 'service_j1dsnkq';
const EMAILJS_TEMPLATE_ID = 'template_l34raxk';

// Init EmailJS only when the SDK is available (Contact page)
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    return true;
  }
  return false;
}

// ===== TYPEWRITER =====
const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
  const words = ['Animator', 'Programmer', 'Motion Designer', 'VFX Artist', '3D Modeler', 'Compositor', 'Storyteller'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = words[wordIndex];
    typewriterEl.textContent = deleting
      ? current.substring(0, --charIndex)
      : current.substring(0, ++charIndex);

    let delay = deleting ? 60 : 110;
    if (!deleting && charIndex === current.length) { delay = 1800; deleting = true; }
    else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }

    setTimeout(type, delay);
  }
  type();
}

// ===== NAVBAR =====
const navbar = document.querySelector('.NavBar');
const navItems = document.querySelector('.NavBar .Navbar_Items');
const hamburger = document.querySelector('.hamburger');
const menuClose = document.querySelector('.menu-close');

// Scroll: add/remove Container class (passive for performance)
window.addEventListener('scroll', () => {
  navbar.classList.toggle('Container', window.scrollY > 20);
}, { passive: true });

function closeMenu() {
  navItems.classList.remove('active');
  hamburger.querySelector('i').classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = navItems.classList.toggle('active');
  hamburger.querySelector('i').classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

menuClose?.addEventListener('click', closeMenu);

// Close menu when a nav link is clicked
navItems?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ===== PORTFOLIO FILTER & PREVIEW =====
const filterItem = document.querySelector('.items');
const filterImgs = document.querySelectorAll('.gallery .image');

if (filterItem && filterImgs.length) {
  const previewBox   = document.querySelector('.preview-box');
  const categoryName = previewBox.querySelector('.title p');
  const previewVid   = previewBox.querySelector('video');
  const closeIcon    = previewBox.querySelector('.icon');
  const shadow       = document.querySelector('.shadow');
  const progressBar  = previewBox.querySelector('.progress-bar');
  const timeLabel    = previewBox.querySelector('.time-label');
  const restartBtn   = previewBox.querySelector('.restart-btn');

  function fmt(s) {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  previewVid.addEventListener('timeupdate', () => {
    if (!previewVid.duration) return;
    progressBar.style.width = (previewVid.currentTime / previewVid.duration * 100) + '%';
    timeLabel.textContent = fmt(previewVid.currentTime) + ' / ' + fmt(previewVid.duration);
  });

  previewVid.addEventListener('loadedmetadata', () => {
    timeLabel.textContent = '0:00 / ' + fmt(previewVid.duration);
  });

  restartBtn.addEventListener('click', () => {
    previewVid.currentTime = 0;
    previewVid.play().catch(() => {});
  });

  // Filter
  filterItem.addEventListener('click', (e) => {
    if (!e.target.classList.contains('item')) return;
    filterItem.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    const name = e.target.dataset.name;
    filterImgs.forEach(img => {
      const match = img.dataset.name === name || name === 'all';
      img.classList.toggle('hide', !match);
      img.classList.toggle('show', match);
    });
  });

  // Preview open
  function openPreview(el) {
    const vid = el.querySelector('video');
    previewVid.src = vid.src || vid.dataset.src || '';
    progressBar.style.width = '0%';
    timeLabel.textContent = '0:00 / 0:00';
    categoryName.textContent = el.dataset.title;
    previewBox.classList.add('show');
    shadow.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // Preview close
  function closePreview() {
    previewBox.classList.remove('show');
    shadow.classList.remove('show');
    document.body.style.overflow = '';
    previewVid.pause();
    previewVid.src = '';
    progressBar.style.width = '0%';
    timeLabel.textContent = '0:00 / 0:00';
  }

  filterImgs.forEach(img => img.addEventListener('click', () => openPreview(img)));
  closeIcon.addEventListener('click', closePreview);
  shadow.addEventListener('click', closePreview);

  // Lazy-load gallery videos — load src when in view, play all, never pause
  if ('IntersectionObserver' in window) {
    const vidObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.dataset.src) {
            video.src = video.dataset.src;
            delete video.dataset.src;
          }
          video.play().catch(() => {});
        }
        // no pause on exit — all videos play simultaneously
      });
    }, { rootMargin: '200px', threshold: 0.05 });

    filterImgs.forEach(img => {
      const video = img.querySelector('video');
      if (video) vidObserver.observe(video);
    });
  }
}

// ===== SCROLL REVEAL =====
(function () {
  if (!('IntersectionObserver' in window)) return;
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObs.observe(el));
})();

// ===== CONTACT FORM (EmailJS) =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const sendBtn    = document.getElementById('send-btn');
  const formStatus = document.getElementById('form-status');

  // Real-time field validation styling
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.value.trim() === '') {
        field.style.borderColor = 'crimson';
      } else {
        field.style.borderColor = '';
      }
    });
    field.addEventListener('input', () => {
      if (field.value.trim() !== '') field.style.borderColor = '';
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      if (field.value.trim() === '') {
        field.style.borderColor = 'crimson';
        field.style.boxShadow = '0 0 0 2px rgba(220,20,60,0.2)';
        valid = false;
      }
    });
    if (!valid) {
      formStatus.textContent = '\u26a0 Please fill in all fields.';
      formStatus.className = 'error';
      return;
    }

    // Validate email format
    const emailField = contactForm.querySelector('input[name="sender_email"]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      emailField.style.borderColor = 'crimson';
      emailField.style.boxShadow = '0 0 0 2px rgba(220,20,60,0.2)';
      formStatus.textContent = '\u26a0 Please enter a valid email address.';
      formStatus.className = 'error';
      return;
    }

    if (!initEmailJS()) {
      formStatus.textContent = 'Email service not configured yet.';
      formStatus.className = 'error';
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = '';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
      .then(() => {
        formStatus.innerHTML = '<span style="font-size:18px;display:inline-block;animation:checkBounce 0.5s ease">✅</span> Message sent! I\'ll get back to you soon.';
        formStatus.className = 'success';
        contactForm.reset();
        contactForm.querySelectorAll('input, textarea').forEach(f => {
          f.style.borderColor = '';
          f.style.boxShadow = '';
        });
      })
      .catch((err) => {
        console.error('EmailJS error:', err?.text || err?.status || err);
        formStatus.textContent = '\u2717 Failed: ' + (err?.text || 'Try again.');
        formStatus.className = 'error';
      })
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
      });
  });
}
