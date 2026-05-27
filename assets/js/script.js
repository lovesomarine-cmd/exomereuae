function selectLanguage(lang) {

  localStorage.setItem('exomereLanguage', lang);

  const isArabicPage = window.location.pathname.includes('/ar/');

  // アラビア語選択
  if (lang === 'ar') {

    // 英語ページからだけ移動
    if (!isArabicPage) {
      window.location.href = './ar/index.html';
    }

    // すでにアラビア語ページなら閉じるだけ
    else {
      document.getElementById('languageModal').style.display = 'none';
    }

    return;
  }

  // 英語選択
  if (lang === 'en') {

    // アラビア語ページなら戻る
    if (isArabicPage) {
      window.location.href = '../index.html';
    }

    // 英語ページなら閉じるだけ
    else {
      document.getElementById('languageModal').style.display = 'none';
    }

  }

}

const activateFadeElement = (element) => {
  element.classList.add('is-visible');
  if (element.classList.contains('js-fade-trigger')) {
    element.classList.add('is-active');
  }
  element.querySelectorAll(':scope > .section-fade:not(.is-visible)').forEach((child) => {
    child.classList.add('is-visible');
  });
};

const setFadeDelay = (element, delay) => {
  element.style.setProperty('--fade-delay', `${delay.toFixed(2)}s`);
};

const configureFadeTimings = () => {
  document.querySelectorAll('.collection-header.section-fade, .insta-header.section-fade, .footer-block h4.section-fade, .footer-logo.section-fade').forEach((element) => {
    element.classList.add('fade-heading');
  });

  document.querySelectorAll('.product-card.section-fade').forEach((element, index) => {
    element.classList.add('fade-product');
    setFadeDelay(element, 0.12 + (index % 6) * 0.1);
  });

  document.querySelectorAll('.collection-actions .section-fade').forEach((element, index) => {
    setFadeDelay(element, 0.1 + index * 0.1);
  });

  document.querySelectorAll('.instagram-loop-section .insta-item.section-fade').forEach((element, index) => {
    setFadeDelay(element, 0.1 + (index % 4) * 0.08);
  });

  document.querySelectorAll('.site-footer .section-fade').forEach((element, index) => {
    setFadeDelay(element, 0.1 + Math.min(index, 8) * 0.1);
  });

  document.querySelectorAll('.collection-section, .split-loop-section, .instagram-loop-section, .site-footer').forEach((section, sectionIndex) => {
    const baseDelay = sectionIndex * 0.12;
    section.querySelectorAll(':scope > .section-fade').forEach((element) => {
      setFadeDelay(element, baseDelay);
    });
  });
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
let letterCoveringRafId = null;

const mixColor = (from, to, progress) => from.map((channel, index) => Math.round(channel + (to[index] - channel) * progress));

const prepareLetterCoveringText = () => {

  document
    .querySelectorAll('[data-animation-type="letter-covering-on-scroll"]')
    .forEach((element) => {

      if (element.dataset.letterCoveringPrepared === 'true') return;

      const text = element.textContent.trim();

      element.textContent = '';

      text.split(' ').forEach((wordText) => {

        const word = document.createElement('span');

        word.className = 'letter-covering-word';

        word.textContent = wordText + ' ';

        element.appendChild(word);

      });

      element.dataset.letterCoveringPrepared = 'true';

    });

};



const letterCoveringObserver = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {

      entry.target.classList.add('is-visible');

    }

  });

}, {
  threshold: 0,
  rootMargin: '0px 0px -10% 0px'
});



document
  .querySelectorAll('[data-animation-type="letter-covering-on-scroll"]')
  .forEach((element) => {

    letterCoveringObserver.observe(element);

  });



prepareLetterCoveringText();

const updateLetterCoveringText = () => {
  prepareLetterCoveringText();
  document.querySelectorAll('[data-animation-type="letter-covering-on-scroll"]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const start = viewportHeight * 0.86;
    const end = viewportHeight * 0.24;
    const travel = Math.max(start - end + rect.height * 0.35, 1);
    const progress = clamp((start - rect.top) / travel, 0, 1);
    const light = [138, 129, 123];
    const dark = [47, 36, 31];
    const current = mixColor(light, dark, progress);
    const words = element.querySelectorAll('.letter-covering-word');

    element.style.setProperty('--progress', progress.toFixed(4));
    element.style.setProperty('--letter-current', `rgb(${current.join(', ')})`);
    words.forEach((word, index) => {
      const wordStart = words.length <= 1 ? 0 : (index / (words.length - 1)) * 0.78;
      const wordProgress = clamp((progress - wordStart) / 0.22, 0, 1);
      word.style.color = `rgb(${mixColor(light, dark, wordProgress).join(', ')})`;
    });
  });
};

const initLetterCoveringText = () => {
  if (letterCoveringRafId) return;

  const tick = () => {
    updateLetterCoveringText();
    letterCoveringRafId = window.requestAnimationFrame(tick);
  };

  tick();
  window.addEventListener('scroll', updateLetterCoveringText, { passive: true });
  window.addEventListener('resize', updateLetterCoveringText);
  window.addEventListener('load', updateLetterCoveringText);
};

const initFadeIn = () => {
  configureFadeTimings();

  const fadeElements = document.querySelectorAll('.section-fade');

  if (!fadeElements.length) return;

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        activateFadeElement(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08,
    });

    fadeElements.forEach((element) => {
      if (!element.classList.contains('is-visible')) {
        fadeObserver.observe(element);
      }
    });
    return;
  }

  fadeElements.forEach(activateFadeElement);
};

const initHeadingIntersection = () => {
  const rightColumnTrigger = document.querySelector('.js-fade-trigger');
  if (!rightColumnTrigger || rightColumnTrigger.dataset.headingObserverReady === 'true') return;

  rightColumnTrigger.dataset.headingObserverReady = 'true';

  const activateHeading = () => {
    rightColumnTrigger.classList.add('is-active');
  };

  if (!('IntersectionObserver' in window)) {
    activateHeading();
    return;
  }

  const headingObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      activateHeading();
      observer.unobserve(entry.target);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.2,
  });

  headingObserver.observe(rightColumnTrigger);
};

window.toggleHeaderPopover = (targetId, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const popovers = document.querySelectorAll('.header-popover');
  const target = document.getElementById(targetId);
  const isOpen = target?.classList.contains('is-open');

  popovers.forEach((popover) => {
    popover.classList.remove('is-open');
    popover.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('[data-popover-target]').forEach((button) => {
    button.classList.remove('is-active');
  });

  if (target && !isOpen) {
    target.classList.add('is-open');
    target.setAttribute('aria-hidden', 'false');
    document.querySelector(`[data-popover-target="${targetId}"]`)?.classList.add('is-active');

    const input = target.querySelector('input');
    if (input) input.focus();
  }
};

window.moveProductCarousel = (direction, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const arrows = document.querySelector(".collection-arrows");

  if (arrows) {
    arrows.classList.remove("is-left", "is-right");

    if (direction === "left") {
      arrows.classList.add("is-left");
    } else {
      arrows.classList.add("is-right");
    }
  }

  const productWrapper = document.querySelector('.product-swiper .swiper-wrapper');
  const productSlides = document.querySelectorAll('.product-swiper .product-card');

  if (!productWrapper || productSlides.length < 2 || productWrapper.dataset.isMoving === 'true') return;

  const firstSlide = productSlides[0];
  const wrapperStyle = window.getComputedStyle(productWrapper);
  const gap = parseFloat(wrapperStyle.columnGap || wrapperStyle.gap) || 14;
  const step = firstSlide.getBoundingClientRect().width + gap;

  productWrapper.dataset.isMoving = 'true';

  if (direction === 'right') {
    productWrapper.style.transform = `translate3d(-${step}px, 0, 0)`;

    window.setTimeout(() => {
      productWrapper.style.transition = 'none';
      productWrapper.appendChild(productWrapper.firstElementChild);
      productWrapper.style.transform = 'translate3d(0, 0, 0)';
      void productWrapper.offsetWidth;
      productWrapper.style.transition = '';
      productWrapper.dataset.isMoving = 'false';
    }, 560);

    return;
  }

  productWrapper.style.transition = 'none';
  productWrapper.insertBefore(productWrapper.lastElementChild, productWrapper.firstElementChild);
  productWrapper.style.transform = `translate3d(-${step}px, 0, 0)`;
  void productWrapper.offsetWidth;
  productWrapper.style.transition = '';
  productWrapper.style.transform = 'translate3d(0, 0, 0)';

  window.setTimeout(() => {
    productWrapper.dataset.isMoving = 'false';
  }, 560);
};

const initProductCarousel = () => {
  const productWrapper = document.querySelector('.product-swiper .swiper-wrapper');

  if (!productWrapper) return;

  productWrapper.dataset.isMoving = 'false';
  productWrapper.style.transform = 'translate3d(0, 0, 0)';
};

const initSocialGalleryLinks = () => {
  const gallery = document.querySelector('.instagram-carousel');
  if (!gallery || gallery.dataset.socialGalleryReady === 'true') return;

  let previousActiveElement = null;
  gallery.dataset.socialGalleryReady = 'true';

  gallery.addEventListener('mousedown', () => {
    previousActiveElement = document.activeElement;
  });

  gallery.addEventListener('click', (event) => {
    const link = event.target.closest('.js-social-gallery-link');
    if (!link || (event.button !== 0 && event.button !== 1)) return;

    link.focus();

    if (previousActiveElement && previousActiveElement !== link) {
      window.setTimeout(() => {
        previousActiveElement.focus();
        previousActiveElement = null;
      }, 0);
    }
  });
};

const initHeaderTools = () => {
  const popovers = document.querySelectorAll('.header-popover');
  const closePopovers = () => {
    popovers.forEach((popover) => {
      popover.classList.remove('is-open');
      popover.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('[data-popover-target]').forEach((button) => {
      button.classList.remove('is-active');
    });
  };

  popovers.forEach((popover) => {
    popover.addEventListener('click', (event) => event.stopPropagation());
  });

  document.addEventListener('click', closePopovers);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePopovers();
  });

  document.querySelectorAll('.header-search-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  });
};

const initHeaderScroll = () => {
  const siteHeader = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeaderState = () => {
    if (!siteHeader) return;

    const currentScrollY = window.scrollY;
    const isLeavingTop = currentScrollY > 24;
    const isPastHeroTop = currentScrollY > 120;
    const isScrollingUp = currentScrollY < lastScrollY;

    if (!isLeavingTop) {
      siteHeader.classList.remove('is-scrolled', 'is-floating', 'is-hidden');
    } else {
      siteHeader.classList.toggle('is-scrolled', isPastHeroTop);
      siteHeader.classList.toggle('is-floating', isPastHeroTop);
      siteHeader.classList.toggle('is-hidden', isPastHeroTop && !isScrollingUp);
    }

    siteHeader.classList.toggle('logo-is-faded', currentScrollY > 8);

    lastScrollY = Math.max(currentScrollY, 0);
    ticking = false;
  };

  updateHeaderState();
function selectLanguage(lang) {
  localStorage.setItem('exomereLanguage', lang);

  const modal = document.getElementById('languageModal');
  const isArabicPage = window.location.pathname.includes('/ar/');

  if (lang === 'ar') {
    if (!isArabicPage) {
      window.location.href = './ar/index.html';
    } else if (modal) {
      modal.style.display = 'none';
      document.body.classList.add('page-loaded');
    }

    return;
  }

  if (lang === 'en') {
    if (isArabicPage) {
      window.location.href = '../index.html';
    } else if (modal) {
      modal.style.display = 'none';
      document.body.classList.add('page-loaded');
    }
  }
}
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeaderState);
  }, { passive: true });
};

const initPage = () => {
  initLetterCoveringText();
  initFadeIn();
  initProductCarousel();
  initSocialGalleryLinks();
  initHeaderTools();
  initHeaderScroll();
  initHeadingIntersection();
  window.addEventListener('resize', initProductCarousel);
};

if (document.body) {
  initPage();
} else {
  document.addEventListener('DOMContentLoaded', initPage);
}
