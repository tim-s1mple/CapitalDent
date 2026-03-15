/**
 * Capital Dent — лендинг
 * Hero-карусель, фиксированный хедер, бургер-меню, модалка записи, формы (Ajax + honeypot), карусели
 */

(function () {
  'use strict';

  // Куда отправлять формы (оставь пустым для показа успеха без отправки; укажи URL бэкенда для реальной отправки)
  var FEEDBACK_URL = '';
  var BOOKING_URL = '';

  var header = document.getElementById('header');
  var burgerBtn = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var modalBooking = document.getElementById('modalBooking');
  var feedbackForm = document.getElementById('feedbackForm');
  var feedbackSuccess = document.getElementById('feedbackSuccess');
  var bookingForm = document.getElementById('bookingForm');
  var bookingSuccess = document.getElementById('bookingSuccess');

  // --- Фиксированный хедер при скролле ---
  function updateHeaderScroll() {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }
  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // --- Бургер-меню ---
  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) closeMobileMenu();
      else openMobileMenu();
    });
  }
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- Модальное окно записи ---
  function openModal(el) {
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstInput = el.querySelector('input:not([type="hidden"]):not(.form__hp), textarea');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
  }
  function closeModal(el) {
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-open-modal="booking"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(modalBooking);
      if (bookingSuccess) bookingSuccess.hidden = true;
      if (bookingForm) bookingForm.hidden = false;
    });
  });
  if (modalBooking) {
    modalBooking.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeModal(modalBooking); });
    });
    modalBooking.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal(modalBooking);
    });
  }

  // --- Honeypot: бот заполнил скрытое поле — не отправляем ---
  function isHoneypotFilled(form) {
    var hp = form.querySelector('.form__hp, input[name="website"]');
    return hp && hp.value.trim() !== '';
  }

  // --- Форма обратной связи (Ajax) ---
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isHoneypotFilled(feedbackForm)) return;
      var submitBtn = feedbackForm.querySelector('button[type="submit"]');
      feedbackForm.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(feedbackForm);
      var data = {};
      formData.forEach(function (v, k) {
        if (k !== 'website') data[k] = v;
      });

      function showSuccess() {
        feedbackForm.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
        feedbackForm.hidden = true;
        if (feedbackSuccess) feedbackSuccess.hidden = false;
      }

      if (FEEDBACK_URL) {
        fetch(FEEDBACK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (res.ok) showSuccess();
            else throw new Error('Ошибка отправки');
          })
          .catch(function () {
            feedbackForm.classList.remove('is-loading');
            if (submitBtn) submitBtn.disabled = false;
            alert('Не удалось отправить сообщение. Попробуйте позже или позвоните нам.');
          });
      } else {
        setTimeout(showSuccess, 500);
      }
    });
  }

  // --- Форма записи в модалке (Ajax) ---
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isHoneypotFilled(bookingForm)) return;
      var submitBtn = bookingForm.querySelector('button[type="submit"]');
      bookingForm.classList.add('is-loading');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(bookingForm);
      var data = {};
      formData.forEach(function (v, k) {
        if (k !== 'website') data[k] = v;
      });

      function showSuccess() {
        bookingForm.classList.remove('is-loading');
        if (submitBtn) submitBtn.disabled = false;
        bookingForm.hidden = true;
        if (bookingSuccess) bookingSuccess.hidden = false;
      }

      if (BOOKING_URL) {
        fetch(BOOKING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            if (res.ok) showSuccess();
            else throw new Error('Ошибка отправки');
          })
          .catch(function () {
            bookingForm.classList.remove('is-loading');
            if (submitBtn) submitBtn.disabled = false;
            alert('Не удалось отправить заявку. Позвоните нам: +7 (495) 000-00-00');
          });
      } else {
        setTimeout(showSuccess, 500);
      }
    });
  }

  // --- Слайдер отзывов ---
  var revTrack = document.getElementById('revTrack');
  var revPrev = document.getElementById('revPrev');
  var revNext = document.getElementById('revNext');
  var revPrevNav = document.getElementById('revPrevNav');
  var revNextNav = document.getElementById('revNextNav');
  if (revTrack && revPrev && revNext) {
    var revCards = revTrack.querySelectorAll('.review-card');
    var revTotal = revCards.length;
    var revIndex = 0;
    var revGap = 24;

    function getRevStep() {
      var wrap = revTrack.closest('.reviews__track-wrap');
      if (!wrap || !revCards[0]) return { step: 0, visibleCount: 1, maxIndex: 0 };
      var cardWidth = revCards[0].offsetWidth;
      var visibleCount = Math.max(1, Math.floor((wrap.offsetWidth + revGap) / (cardWidth + revGap)));
      var step = visibleCount * (cardWidth + revGap);
      var maxIndex = Math.max(0, Math.ceil(revTotal / visibleCount) - 1);
      return { step: step, visibleCount: visibleCount, maxIndex: maxIndex };
    }

    function updateRevSlider() {
      var wrap = revTrack.closest('.reviews__track-wrap');
      if (!wrap) return;
      var r = getRevStep();
      revTrack.style.transform = 'translateX(-' + revIndex * r.step + 'px)';
      revPrev.disabled = revIndex <= 0;
      revNext.disabled = revIndex >= r.maxIndex;
      if (revPrevNav) revPrevNav.disabled = revIndex <= 0;
      if (revNextNav) revNextNav.disabled = revIndex >= r.maxIndex;
    }

    function revGo(dir) {
      var r = getRevStep();
      if (dir < 0 && revIndex > 0) { revIndex--; updateRevSlider(); }
      if (dir > 0 && revIndex < r.maxIndex) { revIndex++; updateRevSlider(); }
    }

    revPrev.addEventListener('click', function () { revGo(-1); });
    revNext.addEventListener('click', function () { revGo(1); });
    if (revPrevNav) revPrevNav.addEventListener('click', function () { revGo(-1); });
    if (revNextNav) revNextNav.addEventListener('click', function () { revGo(1); });
    window.addEventListener('resize', updateRevSlider);
    updateRevSlider();
  }

  // --- Слайдер акций (3 картинки) ---
  var promoTrack = document.getElementById('promoTrack');
  var promoPrev = document.getElementById('promoPrev');
  var promoNext = document.getElementById('promoNext');
  var promoDots = document.getElementById('promoDots');
  if (promoTrack && promoPrev && promoNext && promoDots) {
    var promoSlides = promoTrack.querySelectorAll('.promo__slide');
    var promoTotal = promoSlides.length;
    var promoIndex = 0;

    function updatePromoSlider() {
      promoTrack.style.transform = 'translateX(-' + promoIndex * 100 + '%)';
      promoPrev.disabled = promoIndex <= 0;
      promoNext.disabled = promoIndex >= promoTotal - 1;
      var dots = promoDots.querySelectorAll('span');
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('is-active', d === promoIndex);
    }

    for (var i = 0; i < promoTotal; i++) {
      var dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', 'Акция ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () {
          promoIndex = idx;
          updatePromoSlider();
        });
      })(i);
      promoDots.appendChild(dot);
    }

    promoPrev.addEventListener('click', function () {
      if (promoIndex > 0) { promoIndex--; updatePromoSlider(); }
    });
    promoNext.addEventListener('click', function () {
      if (promoIndex < promoTotal - 1) { promoIndex++; updatePromoSlider(); }
    });
    updatePromoSlider();
  }
})();
