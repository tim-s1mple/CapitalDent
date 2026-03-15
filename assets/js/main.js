document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('.header')
  const headerHeight = header.clientHeight
  const burgerBtn = document.getElementById('burgerBtn')
  const mobileMenuEl = document.querySelector('.header__nav')

  const heroPaddingTop = () => {
    const element = document.querySelector('.pt')
    if (element) element.style.paddingTop = `${headerHeight}px`
  }
  heroPaddingTop()

  const specialistsSwiper = new Swiper('.specialists-slider .swiper', {
    slidesPerView: 3,
    spaceBetween: 32,
    navigation: {
      nextEl: '.specialists-slider .swiper-button-next',
      prevEl: '.specialists-slider .swiper-button-prev'
    },
    breakpoints: {
      360: { slidesPerView: 1.3, spaceBetween: 20 },
      576: { slidesPerView: 1.5, spaceBetween: 32 },
      768: { slidesPerView: 2, spaceBetween: 32 },
      992: { slidesPerView: 2.5, spaceBetween: 32 },
      1200: { slidesPerView: 3, spaceBetween: 32 }
    }
  })

  const reviewstsSwiper = new Swiper('.reviews-slider .swiper', {
    slidesPerView: 3,
    spaceBetween: 32,
    navigation: {
      nextEl: '.reviews-slider .swiper-button-next',
      prevEl: '.reviews-slider .swiper-button-prev'
    },
    breakpoints: {
      360: { slidesPerView: 1, spaceBetween: 16 },
      576: { slidesPerView: 1.5, spaceBetween: 22 },
      768: { slidesPerView: 2, spaceBetween: 22 },
      992: { slidesPerView: 2.5, spaceBetween: 22 },
      1200: { slidesPerView: 3, spaceBetween: 32 }
    }
  })

  const reviewCard = {
    parents: document.querySelectorAll('.review-card'),

    init() {
      this.parents.forEach(parent => {

        const content = parent.querySelector('.review-card__content')
        const text = parent.querySelector('.review-card__text')
        const btn = parent.querySelector('.review-card__more')

        let flag = false

        const stars = [...parent.querySelectorAll('.stars__item')]
        const value = parent.dataset.rating

        stars.slice(value).forEach(star => star.classList.add('grayscale'))

        if (content.clientHeight > 80) {
          content.classList.add('collapsed')
        }

        btn.addEventListener('click', () => {
          flag = !flag
          text.classList.toggle('active')
          btn.classList.toggle('active')
          btn.textContent = flag ? 'скрыть' : '...еще'
        })

      })
    }
  }

  reviewCard.init()

  const heightEqualizer = selector => {

    const elements = document.querySelectorAll(selector)
    let maxHeight = 0

    elements.forEach(element => {
      if (maxHeight <= element.clientHeight) maxHeight = element.clientHeight
    })

    elements.forEach(element => {
      element.style.minHeight = `${maxHeight}px`
    })

  }

  heightEqualizer('.specialist-card')
  heightEqualizer('.review-card')

  const sideOverlay = () => {

    const elements = document.querySelectorAll('.side-overlay')
    const container = document.querySelector('.container')

    elements.forEach(element => {
      element.style.width = `${(window.innerWidth - (container.offsetWidth + 20)) / 2}px`
    })

  }

  sideOverlay()

  const swiperBanners = new Swiper('.banners__slider .swiper', {
    spaceBetween: 24,
    pagination: {
      el: '.banners__slider .swiper-pagination'
    }
  })

  /* ---------------- БУРГЕР МЕНЮ ---------------- */


function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  burgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

burgerBtn.addEventListener('click', () => {
  if (mobileMenu.classList.contains('is-open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

  /* ---------------- MODAL ---------------- */

  class Modal {

    isOpen = false
    #overlayEl = null
    #buttonCloseEls = null
    #triggerEls = null
    #activeModal = null

    constructor(overlaySelector, modalSelector, buttonCloseSelector, triggerSelector, transitionTime) {

      this.overlaySelector = overlaySelector
      this.modalSelector = modalSelector
      this.buttonCloseSelector = buttonCloseSelector
      this.triggerSelector = triggerSelector
      this.transitionTime = transitionTime

      this.#init()

    }

    #init() {

      this.#overlayEl = document.querySelector(this.overlaySelector)
      this.#triggerEls = document.querySelectorAll(this.triggerSelector)
      this.#buttonCloseEls = document.querySelectorAll(this.buttonCloseSelector)

      this.#triggerEls.forEach(triggerEl => {

        triggerEl.addEventListener('click', () => {
          this.open(triggerEl.dataset.modal)
        })

      })

      this.#buttonCloseEls.forEach(buttonCloseEl => {

        buttonCloseEl.addEventListener('click', () => {
          this.close()
        })

      })

      this.#overlayEl.addEventListener('click', () => {
        this.close()
      })

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this.isOpen) this.close()
      })

    }

    open(id, callback) {

      if (this.isOpen) return

      const modalElement = document.getElementById(id)
      if (!modalElement) return

      this.#activeModal = modalElement
      this.#activeModal.style.transition = `${this.transitionTime}ms`

      this.isOpen = true

      if (document.body.offsetHeight > window.innerHeight) {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.scrollbarGutter = 'stable'
      }

      this.#overlayEl.classList.add('active')
      this.#activeModal.classList.add('active')

      requestAnimationFrame(() => {
        this.#activeModal.classList.add('fade')
      })

      if (typeof callback === 'function') {
        callback(this.#activeModal)
      }

    }

    close() {

      this.isOpen = false
      const activeModal = this.#activeModal

      this.#activeModal.classList.remove('fade')

      setTimeout(() => {

        document.body.style.overflow = ''
        document.documentElement.style.scrollbarGutter = ''

        this.#overlayEl.classList.remove('active')
        activeModal.classList.remove('active')

        this.#activeModal = null

      }, this.transitionTime)

    }

  }

  window.modal = new Modal(
    '.modal-overlay',
    '.modal',
    '.modal__button-close',
    '.modal-trigger',
    200
  )

})
