/**
 * PrimeFix Appliances - Main JavaScript
 * Premium Appliance Repair Services in Orange County, CA
 * Author: PrimeFix Team
 * Version: 3.0
 * Last Updated: 2025
 */

// Development mode check
const isDev =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.includes("netlify.app");

// Debug logger - only logs in development
const debug = {
  log: (...args) => isDev && console.log(...args),
  error: (...args) => console.error(...args), // Always log errors
  warn: (...args) => isDev && console.warn(...args),
};

class PrimeFix {
  constructor() {
    this.config = {
      breakpoints: {
        mobile: 768,
        desktop: 1024,
      },
      carousel: {
        autoSlideDelay: 5000,
        resizeDebounce: 250,
      },
      brands: ["sub-zero", "wolf", "cove"],
    };

    this.state = {
      mobileMenuOpen: false,
      carouselAutoSlide: null,
    };

    this.elements = {};
    this.init();
  }

  // Initialize the application
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.initModules();
    this.setupImageFallbacks();
  }

  // Cache frequently used DOM elements
  cacheElements() {
    this.elements = {
      body: document.body,
      mobileMenu: document.getElementById("mobile-menu"),
      burgerMenus: document.querySelectorAll(".burger-menu"),
      carousel: document.querySelector(".reviews-carousel"),
      carouselPrev: document.querySelector(".carousel-prev"),
      carouselNext: document.querySelector(".carousel-next"),
      dotsContainer: document.querySelector(".flex.justify-center.space-x-2"),
      faqToggles: document.querySelectorAll(".faq-toggle"),
      forms: document.querySelectorAll("form[netlify], form[data-netlify]"),
      phoneLinks: document.querySelectorAll('a[href^="tel:"]'),
      lazyImages: document.querySelectorAll("img[data-src]"),
    };
  }

  // Set up all event listeners
  setupEventListeners() {
    // Mobile menu
    this.elements.burgerMenus.forEach((burger) => {
      burger.addEventListener("click", (e) => this.handleBurgerClick(e));
    });

    // FAQ toggles
    this.elements.faqToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const index = parseInt(toggle.getAttribute("data-faq-index"));
        this.toggleFAQ(index);
      });
    });

    // Carousel navigation
    if (this.elements.carouselPrev) {
      this.elements.carouselPrev.addEventListener("click", () =>
        this.moveCarousel(-1)
      );
    }
    if (this.elements.carouselNext) {
      this.elements.carouselNext.addEventListener("click", () =>
        this.moveCarousel(1)
      );
    }

    // Global event listeners
    document.addEventListener("click", (e) => this.handleGlobalClick(e));
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("submit", (e) => this.handleFormSubmit(e));
    window.addEventListener(
      "resize",
      this.debounce(
        () => this.handleResize(),
        this.config.carousel.resizeDebounce
      )
    );

    // Phone tracking
    this.elements.phoneLinks.forEach((link) => {
      link.addEventListener("click", () =>
        this.trackCall(link.href.replace("tel:", ""))
      );
    });
  }

  // Initialize modules
  initModules() {
    this.initCarousel();
    this.initPerformanceOptimizations();
    this.initBodyClasses();
  }

  // MOBILE MENU METHODS
  handleBurgerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleMobileMenu();
  }

  toggleMobileMenu() {
    this.state.mobileMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
  }

  openMobileMenu() {
    if (!this.elements.mobileMenu) return;

    this.elements.mobileMenu.classList.add("open");
    this.elements.burgerMenus.forEach((menu) => menu.classList.add("open"));
    this.elements.body.style.overflow = "hidden";
    this.elements.mobileMenu.setAttribute("aria-hidden", "false");
    this.state.mobileMenuOpen = true;
  }

  closeMobileMenu() {
    if (!this.elements.mobileMenu) return;

    this.elements.mobileMenu.classList.remove("open");
    this.elements.burgerMenus.forEach((menu) => menu.classList.remove("open"));
    this.elements.body.style.overflow = "";
    this.elements.mobileMenu.setAttribute("aria-hidden", "true");
    this.state.mobileMenuOpen = false;
  }

  // CAROUSEL METHODS
  initCarousel() {
    if (!this.elements.carousel) return;

    this.carousel = {
      currentSlide: 0,
      totalReviews: 10,
      reviewsPerSlide: this.getReviewsPerSlide(),
      totalSlides: 0,
    };

    this.calculateCarouselSlides();
    this.updateCarousel();
    this.startAutoSlide();

    // Pause auto-slide on hover
    this.elements.carousel.addEventListener("mouseenter", () =>
      this.stopAutoSlide()
    );
    this.elements.carousel.addEventListener("mouseleave", () =>
      this.startAutoSlide()
    );
  }

  getReviewsPerSlide() {
    const width = window.innerWidth;
    return width >= this.config.breakpoints.desktop
      ? 3
      : width >= this.config.breakpoints.mobile
      ? 2
      : 1;
  }

  calculateCarouselSlides() {
    this.carousel.reviewsPerSlide = this.getReviewsPerSlide();
    this.carousel.totalSlides = Math.ceil(
      this.carousel.totalReviews / this.carousel.reviewsPerSlide
    );
  }

  moveCarousel(direction) {
    this.carousel.currentSlide =
      (this.carousel.currentSlide + direction + this.carousel.totalSlides) %
      this.carousel.totalSlides;
    this.updateCarousel();
  }

  goToSlide(slideIndex) {
    this.carousel.currentSlide = slideIndex;
    this.updateCarousel();
  }

  updateCarousel() {
    if (!this.elements.carousel) return;

    this.calculateCarouselSlides();
    this.carousel.currentSlide = Math.min(
      this.carousel.currentSlide,
      this.carousel.totalSlides - 1
    );

    const translateX = -(
      this.carousel.currentSlide *
      (100 / this.carousel.reviewsPerSlide)
    );
    this.elements.carousel.style.transform = `translateX(${translateX}%)`;
    this.updateCarouselDots();
  }

  updateCarouselDots() {
    if (!this.elements.dotsContainer) return;

    this.elements.dotsContainer.innerHTML = Array.from(
      { length: this.carousel.totalSlides },
      (_, i) =>
        `<button class="carousel-dot w-3 h-3 rounded-full transition-colors duration-300 ${
          i === this.carousel.currentSlide
            ? "bg-primefix-navy"
            : "bg-gray-300 hover:bg-gray-400"
        }" data-slide-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join("");

    this.elements.dotsContainer
      .querySelectorAll(".carousel-dot")
      .forEach((dot, index) => {
        dot.addEventListener("click", () => this.goToSlide(index));
      });
  }

  startAutoSlide() {
    if (this.state.carouselAutoSlide) return;
    this.state.carouselAutoSlide = setInterval(
      () => this.moveCarousel(1),
      this.config.carousel.autoSlideDelay
    );
  }

  stopAutoSlide() {
    if (this.state.carouselAutoSlide) {
      clearInterval(this.state.carouselAutoSlide);
      this.state.carouselAutoSlide = null;
    }
  }

  // FAQ METHODS
  toggleFAQ(index) {
    const faqAnswers = document.querySelectorAll(".faq-answer");
    const faqIcons = document.querySelectorAll(".faq-icon");
    const faqButtons = document.querySelectorAll(".faq-toggle");

    if (!faqAnswers.length || !faqIcons.length) return;

    // Close all other FAQs
    faqAnswers.forEach((answer, i) => {
      if (i !== index) {
        answer.classList.remove("open");
        faqIcons[i].textContent = "+";
        faqIcons[i].classList.remove("rotated");
        if (faqButtons[i]) {
          faqButtons[i].setAttribute("aria-expanded", "false");
        }
      }
    });

    // Toggle current FAQ
    const currentAnswer = faqAnswers[index];
    const currentIcon = faqIcons[index];
    const currentButton = faqButtons[index];
    const isOpen = currentAnswer.classList.contains("open");

    currentAnswer.classList.toggle("open", !isOpen);
    currentIcon.textContent = isOpen ? "+" : "−";
    currentIcon.classList.toggle("rotated", !isOpen);

    if (currentButton) {
      currentButton.setAttribute("aria-expanded", (!isOpen).toString());
    }
  }

  // FORM HANDLING METHODS
  async handleFormSubmit(event) {
    const form = event.target;
    if (!form.hasAttribute("netlify") && !form.hasAttribute("data-netlify"))
      return;

    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton?.disabled) return;

    if (!this.validateForm(form)) return;

    this.setLoadingState(submitButton, true);

    try {
      const formData = new FormData(form);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        this.trackFormSubmission(form.name || "contact-form");
        const actionUrl = form.action;
        if (actionUrl && actionUrl !== "#") {
          window.location.href = actionUrl;
        } else {
          this.showSuccessMessage();
        }
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      debug.error("Form submission error:", error);
      this.showErrorMessage(
        "There was an error submitting your form. Please try again."
      );
    } finally {
      this.setLoadingState(submitButton, false);
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    this.clearAllFormErrors(form);

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        this.showFieldError(field, "This field is required");
        isValid = false;
      }
    });

    // Email validation
    form.querySelectorAll('input[type="email"]').forEach((field) => {
      if (field.value && !this.isValidEmail(field.value)) {
        this.showFieldError(field, "Please enter a valid email address");
        isValid = false;
      }
    });

    // Phone validation
    form.querySelectorAll('input[type="tel"]').forEach((field) => {
      if (field.value && !this.isValidPhone(field.value)) {
        this.showFieldError(field, "Please enter a valid phone number");
        isValid = false;
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, "");
    return cleanPhone.length >= 10 && /^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone);
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    const errorDiv = document.createElement("div");
    errorDiv.className = "form-error text-red-500 text-sm mt-1";
    errorDiv.textContent = message;
    errorDiv.setAttribute("role", "alert");
    errorDiv.setAttribute("aria-live", "polite");

    const errorId = `error-${Date.now()}`;
    errorDiv.id = errorId;

    field.classList.add("border-red-500");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errorId);
    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    const existingError = field.parentNode.querySelector(".form-error");
    if (existingError) existingError.remove();

    field.classList.remove("border-red-500");
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  }

  clearAllFormErrors(form) {
    form.querySelectorAll(".form-error").forEach((error) => error.remove());
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
      field.classList.remove("border-red-500");
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
  }

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Submitting...
      `;
    } else {
      button.disabled = false;
      if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
      }
    }
  }

  showSuccessMessage() {
    const currentBrand = this.getCurrentBrand();
    alert(
      `Thank you for your service request! We will contact you within 1 hour to schedule your ${currentBrand} repair appointment.`
    );
  }

  showErrorMessage(message) {
    alert(message);
  }

  // UTILITY METHODS
  getCurrentBrand() {
    const path = window.location.pathname;

    for (const brand of this.config.brands) {
      if (path.includes(`/${brand}/`)) {
        return brand.charAt(0).toUpperCase() + brand.slice(1).replace("-", "-");
      }
    }

    // Fallback checks
    const brandLogo = document.querySelector('img[alt*="Logo"]');
    if (brandLogo) {
      for (const brand of ["Sub-Zero", "Wolf", "Cove"]) {
        if (brandLogo.alt.includes(brand)) return brand;
      }
    }

    const title = document.title;
    for (const brand of ["Sub-Zero", "Wolf", "Cove"]) {
      if (title.includes(brand)) return brand;
    }

    return "Sub-Zero";
  }

  // ANALYTICS METHODS
  trackCall(phoneNumber) {
    if (typeof gtag !== "undefined") {
      gtag("event", "phone_call", {
        event_category: "contact",
        event_label: phoneNumber,
        value: 1,
      });
    }

    if (typeof fbq !== "undefined") {
      fbq("track", "Contact", {
        content_name: "Phone Call",
        content_category: "Contact",
      });
    }

    debug.log("Call tracking:", phoneNumber);
  }

  trackFormSubmission(formType) {
    if (typeof gtag !== "undefined") {
      gtag("event", "form_submit", {
        event_category: "contact",
        event_label: formType,
        value: 1,
      });
    }

    if (typeof fbq !== "undefined") {
      fbq("track", "Lead", {
        content_name: formType,
        content_category: "Contact Form",
      });
    }

    debug.log("Form submission tracking:", formType);
  }

  // PERFORMANCE OPTIMIZATION METHODS
  initPerformanceOptimizations() {
    this.setupLazyLoading();
    // Preloading moved to server-side (base.liquid template)
  }

  setupLazyLoading() {
    if (!this.elements.lazyImages.length) return;

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      this.elements.lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      this.elements.lazyImages.forEach((img) => {
        img.src = img.dataset.src;
        img.classList.remove("lazy");
      });
    }
  }

  // Preloading moved to server-side (base.liquid template)

  // EVENT HANDLERS
  handleGlobalClick(e) {
    // Close mobile menu when clicking outside
    if (this.state.mobileMenuOpen && this.elements.mobileMenu) {
      const isClickInsideMenu = this.elements.mobileMenu.contains(e.target);
      const isClickOnBurger = Array.from(this.elements.burgerMenus).some(
        (burger) => burger.contains(e.target)
      );

      if (!isClickInsideMenu && !isClickOnBurger) {
        this.closeMobileMenu();
      }
    }

    // Close mobile menu when clicking on navigation links
    if (
      this.state.mobileMenuOpen &&
      e.target.tagName === "A" &&
      this.elements.mobileMenu.contains(e.target)
    ) {
      this.closeMobileMenu();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape" && this.state.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  handleResize() {
    // Close mobile menu on desktop resize
    if (
      window.innerWidth >= this.config.breakpoints.desktop &&
      this.state.mobileMenuOpen
    ) {
      this.closeMobileMenu();
    }

    // Update carousel on resize
    if (this.elements.carousel) {
      this.updateCarousel();
    }
  }

  // BODY CLASS INITIALIZATION
  initBodyClasses() {
    const brandIndicator = document.querySelector("[data-brand]");
    if (brandIndicator) {
      const brandName = brandIndicator.getAttribute("data-brand");
      this.elements.body.classList.add("brand-site", `brand-${brandName}`);
    }

    const mainIndicator = document.querySelector('[data-layout="main"]');
    if (mainIndicator) {
      this.elements.body.classList.add("main-site");
    }
  }

  // UTILITY FUNCTIONS
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Set up image fallbacks for brand logos
  setupImageFallbacks() {
    const brandImages = document.querySelectorAll('img[src*="-big.svg"]');

    brandImages.forEach((img) => {
      img.addEventListener("error", (e) => {
        // Extract brand slug from the original src
        const originalSrc = e.target.src;
        const brandSlugMatch = originalSrc.match(/\/([^\/]+)-big\.svg$/);

        if (brandSlugMatch) {
          const brandSlug = brandSlugMatch[1];
          const fallbackSrc = `/assets/images/${brandSlug}.svg`;

          // Only set fallback if it's different from current src to prevent infinite loop
          if (e.target.src !== fallbackSrc) {
            e.target.src = fallbackSrc;
          }
        }
      });
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.primeFix = new PrimeFix();
});
