// ===== EMAILJS SETUP =====
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an Email Service (Gmail recommended) → copy the Service ID
// 3. Create an Email Template with these variables:
//      {{from_name}}  — sender's name
//      {{reply_to}}   — sender's email
//      {{subject}}    — subject line
//      {{message}}    — message body
//    Set "To Email" in the template to: skylnker236@gmail.com
// 4. Go to Account → API Keys → copy your Public Key
// 5. Replace the three placeholder values below:
const EMAILJS_PUBLIC_KEY  = 'ZMsl2hCvPzD1mH5fU';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'service_j1dsnkq';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'template_njau0b9';  // e.g. 'template_xxxxxx'

if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
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

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof emailjs === 'undefined') {
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
        formStatus.textContent = '✓ Message sent!';
        formStatus.className = 'success';
        contactForm.reset();
      })
      .catch(() => {
        formStatus.textContent = '✗ Failed to send. Try again.';
        formStatus.className = 'error';
      })
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
      });
  });
}
