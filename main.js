/*===== LOADING SCREEN =====*/
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderProgress = document.getElementById('loader-progress');

  let progress = 0;
  const radius = 74;
  const circumference = 2 * Math.PI * radius;

  if (loaderProgress) {
    loaderProgress.style.strokeDasharray = `${circumference}`;
    loaderProgress.style.strokeDashoffset = `${circumference}`;
  }

  const interval = setInterval(() => {
    progress += 1;

    if (loaderPercent) loaderPercent.textContent = `${progress}%`;

    if (loaderProgress) {
      const offset = circumference - (progress / 100) * circumference;
      loaderProgress.style.strokeDashoffset = offset;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
      }, 400);
    }
  }, 18);
});

/*===== THEME TOGGLE =====*/
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  if (themeIcon) { themeIcon.classList.remove('bx-moon'); themeIcon.classList.add('bx-sun'); }
} else {
  body.classList.remove('dark-theme');
  if (themeIcon) { themeIcon.classList.remove('bx-sun'); themeIcon.classList.add('bx-moon'); }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeIcon) {
      themeIcon.classList.toggle('bx-moon', !isDark);
      themeIcon.classList.toggle('bx-sun', isDark);
    }
  });
}

/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);
  if (toggle && nav) {
    toggle.addEventListener('click', () => { nav.classList.toggle('show'); });
  }
};
showMenu('nav-toggle', 'nav-menu');

/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll('.nav__link');
function linkAction() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) navMenu.classList.remove('show');
}
navLink.forEach((n) => n.addEventListener('click', linkAction));

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
  const scrollDown = window.scrollY;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 80;
    const sectionId = current.getAttribute('id');
    const sectionsClass = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
    if (!sectionsClass) return;
    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add('active-link');
    } else {
      sectionsClass.classList.remove('active-link');
    }
  });
};
window.addEventListener('scroll', scrollActive);

/*===== SCROLL REVEAL =====*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '40px',
  duration: 700,
  delay: 60,
  reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text, .contact__info', {});
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__cards, .contact__form', { delay: 100 });
sr.reveal('.skills__data, .contact__card', { interval: 60 });
sr.reveal('.project__card', { interval: 100 });
sr.reveal('.work__github-cta', { delay: 200 });

/*===== CONTACT FORM =====*/
const contactForm = document.querySelector('.contact__form');
const submitButton = contactForm?.querySelector('.contact__button');

if (contactForm && submitButton) {
  const showFormMessage = (message, type = 'success') => {
    let messageBox = contactForm.querySelector('.contact__message');
    if (!messageBox) {
      messageBox = document.createElement('p');
      messageBox.className = 'contact__message';
      contactForm.appendChild(messageBox);
    }
    messageBox.textContent = message;
    messageBox.className = `contact__message contact__message--${type}`;
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
    const emailInput = contactForm.querySelector('input[placeholder="Your Email"]');
    const subjectInput = contactForm.querySelector('input[placeholder="Subject"]');
    const messageInput = contactForm.querySelector('textarea');

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject = subjectInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
      showFormMessage('Please fill in all fields.', 'error');
      return;
    }

    if (!emailPattern.test(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      showFormMessage('Your message has been sent successfully.', 'success');
      contactForm.reset();
    } catch (error) {
      showFormMessage('Something went wrong. Please try again.', 'error');
      console.error('Contact form error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}