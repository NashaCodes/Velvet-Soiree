window.addEventListener('load', () => {
  window.setTimeout(() => document.body.classList.add('loaded'), 2500);
});

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.section-title').forEach((heading) => {
  heading.classList.add('scroll-drop');
});

const revealHeadings = () => {
  const headings = document.querySelectorAll('.scroll-drop');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    headings.forEach((heading) => heading.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  headings.forEach((heading) => observer.observe(heading));
};

const setupServiceCards = () => {
  document.querySelectorAll('#services .card').forEach((card, index) => {
    const title = card.querySelector('h3');
    const detail = card.querySelector('p');
    if (!title || !detail) return;

    const detailId = `service-detail-${index + 1}`;
    card.classList.add('service-card');
    detail.classList.add('card-detail');
    detail.id = detailId;
    detail.hidden = true;
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-controls', detailId);
    title.setAttribute('aria-expanded', 'false');

    const enquiryLink = document.createElement('a');
    enquiryLink.href = '#contact';
    enquiryLink.className = 'service-enquire';
    enquiryLink.textContent = 'Enquire about this service';
    enquiryLink.hidden = true;
    enquiryLink.addEventListener('click', () => {
      document.getElementById('service-interest').value = title.textContent;
    });
    detail.after(enquiryLink);

    const toggleDetail = () => {
      const isOpen = title.getAttribute('aria-expanded') === 'true';
      title.setAttribute('aria-expanded', String(!isOpen));
      detail.hidden = isOpen;
      enquiryLink.hidden = isOpen;
      card.classList.toggle('is-open', !isOpen);
    };

    title.addEventListener('click', toggleDetail);
    title.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDetail();
      }
    });
  });
};

const setupMobileNavigation = () => {
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.nav-links');
  if (!toggle || !navigation) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    });
  });
};

const setupQuoteForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const fields = [
      ['Name', values.get('name')],
      ['Phone / WhatsApp', values.get('phone')],
      ['Email', values.get('email')],
      ['Event type', values.get('eventType')],
      ['Event date', values.get('eventDate')],
      ['Location', values.get('location')],
      ['Guests', values.get('guestCount')],
      ['Service of interest', values.get('serviceInterest')],
      ['Requirements', values.get('requirements')],
    ].filter(([, value]) => value);

    const message = ['Hello Velvet Soirée, I would like to request a quote:', '', ...fields.map(([label, value]) => `${label}: ${value}`)].join('\n');
    window.open(`https://wa.me/27752202466?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
};

const setupFoodCarousel = () => {
  const carousel = document.querySelector('.food-carousel');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.food-slide')];
  const dots = [...carousel.querySelectorAll('.food-dots button')];
  const caption = carousel.querySelector('.food-caption');
  let activeIndex = 0;
  let timer;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeIndex));
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
    caption.textContent = slides[activeIndex].dataset.caption;
  };

  const startRotation = () => {
    if (reduceMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(activeIndex + 1), 4200);
  };

  const pauseRotation = () => window.clearInterval(timer);
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    pauseRotation();
    startRotation();
  }));
  carousel.addEventListener('mouseenter', pauseRotation);
  carousel.addEventListener('mouseleave', startRotation);
  carousel.addEventListener('focusin', pauseRotation);
  carousel.addEventListener('focusout', startRotation);
  startRotation();
};

revealHeadings();
setupServiceCards();
setupMobileNavigation();
setupQuoteForm();
setupFoodCarousel();
