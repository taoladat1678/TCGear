tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#e11d48",
        secondary: "#000000",
        accent: "#ffffff",
      },
    },
  },
};

// Initialize AOS
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

// Initialize Feather Icons
feather.replace();

// Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  preloader.style.display = "none";
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  if (window.innerWidth <= 1151) {
    mobileMenu.classList.toggle("hidden");
    document.body.style.overflow = mobileMenu.classList.contains("hidden")
      ? "auto"
      : "hidden";
  }
}

mobileMenuToggle.addEventListener("click", toggleMobileMenu);
mobileMenuToggle.addEventListener("touchstart", (e) => {
  e.preventDefault();
  toggleMobileMenu();
});

// Dropdown Elements
const accountToggle = document.getElementById("account-toggle");
const mobileAccountToggle = document.getElementById("mobile-account-toggle");
const desktopAccountDropdown = document.querySelector(
  ".account-dropdown:not(#mobile-menu .account-dropdown)"
);
const mobileAccountDropdown = document.querySelector(
  "#mobile-menu .account-dropdown"
);

const languageToggle = document.getElementById("language-toggle");
const mobileLanguageToggle = document.getElementById("mobile-language-toggle");
const desktopLanguageDropdown = document.querySelector(
  ".language-dropdown:not(#mobile-menu .language-dropdown)"
);
const mobileLanguageDropdown = document.querySelector(
  "#mobile-menu .language-dropdown"
);

// Function to close all dropdowns except the specified one
function closeOtherDropdowns(exceptDropdown) {
  const dropdowns = [
    desktopAccountDropdown,
    mobileAccountDropdown,
    desktopLanguageDropdown,
    mobileLanguageDropdown,
  ].filter(Boolean);
  dropdowns.forEach((dropdown) => {
    if (dropdown !== exceptDropdown) {
      dropdown.classList.remove("open");
    }
  });
}

// Function to toggle a dropdown and close others
function toggleDropdown(dropdown, isMobile, e) {
  e.stopPropagation();
  if (isMobile && window.innerWidth > 1151) {
    return;
  }
  closeOtherDropdowns(dropdown);
  dropdown.classList.toggle("open");
}

// Event listeners for account dropdown
accountToggle.addEventListener("click", (e) => {
  toggleDropdown(desktopAccountDropdown, false, e);
});

mobileAccountToggle.addEventListener("click", (e) => {
  toggleDropdown(mobileAccountDropdown, true, e);
});

// Event listeners for language dropdown
languageToggle.addEventListener("click", (e) => {
  toggleDropdown(desktopLanguageDropdown, false, e);
});

mobileLanguageToggle.addEventListener("click", (e) => {
  toggleDropdown(mobileLanguageDropdown, true, e);
});

// Close dropdowns when clicking outside
window.addEventListener("click", (e) => {
  if (
    !desktopAccountDropdown.contains(e.target) &&
    !mobileAccountDropdown.contains(e.target) &&
    !mobileAccountToggle.contains(e.target) &&
    !accountToggle.contains(e.target)
  ) {
    desktopAccountDropdown.classList.remove("open");
    mobileAccountDropdown.classList.remove("open");
  }
  if (
    !desktopLanguageDropdown.contains(e.target) &&
    !mobileLanguageDropdown.contains(e.target) &&
    !mobileLanguageToggle.contains(e.target) &&
    !languageToggle.contains(e.target)
  ) {
    desktopLanguageDropdown.classList.remove("open");
    mobileLanguageDropdown.classList.remove("open");
  }
});

// Handle window resize to close mobile menu and dropdowns on larger screens
window.addEventListener("resize", () => {
  if (window.innerWidth > 1151) {
    mobileMenu.classList.add("hidden");
    mobileAccountDropdown.classList.remove("open");
    mobileLanguageDropdown.classList.remove("open");
    document.body.style.overflow = "auto";
  }
});

// Mobile Filter Toggle
const mobileFilterBtn = document.querySelector(".mobile-filter-btn");
const filterSidebar = document.querySelector(".filter-sidebar");
const filterOverlay = document.getElementById("filter-overlay");
const closeFilters = document.getElementById("close-filters");

mobileFilterBtn.addEventListener("click", () => {
  filterSidebar.classList.add("open");
  filterOverlay.classList.add("open");
});

closeFilters.addEventListener("click", () => {
  filterSidebar.classList.remove("open");
  filterOverlay.classList.remove("open");
});

filterOverlay.addEventListener("click", () => {
  filterSidebar.classList.remove("open");
  filterOverlay.classList.remove("open");
});

// Price Slider
const priceSlider = document.getElementById("price-slider");
const priceValue = document.getElementById("price-value");

priceSlider.addEventListener("input", function () {
  priceValue.textContent = "$" + this.value;
});

// Counter Functionality
let cartCount = 0;
let wishlistCount = 0;
let orderCount = 0;

function updateCounters() {
  document.getElementById("cart-counter").textContent = cartCount;
  document.getElementById("wishlist-counter").textContent = wishlistCount;
  document.getElementById("orders-counter").textContent = orderCount;
  document.getElementById("mobile-cart-counter").textContent = cartCount;
  document.getElementById("mobile-wishlist-counter").textContent =
    wishlistCount;
  document.getElementById("mobile-orders-counter").textContent = orderCount;
}

// Add event listeners for add-to-cart (static)
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      cartCount++;
      orderCount++;
      updateCounters();
      const originalIcon = this.innerHTML;
      this.innerHTML = '<i data-feather="check" class="h-4 w-4"></i>';
      feather.replace();
      anime({
        targets: this,
        scale: [1, 1.2, 1],
        duration: 300,
        easing: "easeInOutQuad",
      });
      setTimeout(() => {
        this.innerHTML = originalIcon;
        feather.replace();
      }, 2000);
    });
  });

  // Add event listeners for quick-view (static)
  document.querySelectorAll(".quick-view").forEach((button) => {
    button.addEventListener("click", function () {
      const product = this.dataset.product;
      const price = this.dataset.price;
      const description = this.dataset.description;
      const image = this.dataset.image;

      const url = `detail.html?product=${encodeURIComponent(
        product
      )}&price=${encodeURIComponent(price)}&description=${encodeURIComponent(
        description
      )}&image=${encodeURIComponent(image)}`;

      window.location.href = url;
    });
  });

  // Add event listeners for wishlist (static)
  document.querySelectorAll(".wishlist-btn").forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      wishlistCount++;
      updateCounters();
      const originalContent = this.innerHTML;
      const isMobileWishlist = this.classList.contains("mobile-wishlist");
      this.innerHTML = isMobileWishlist
        ? '<i data-feather="check" class="h-5 w-5"></i> Wishlist'
        : '<i data-feather="check" class="h-4 w-4"></i>';
      feather.replace();
      anime({
        targets: this,
        scale: [1, 1.2, 1],
        duration: 300,
        easing: "easeInOutQuad",
      });
      setTimeout(() => {
        this.innerHTML = originalContent;
        feather.replace();
      }, 2000);
    });
  });
});

// Newsletter Form Submission
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");
newsletterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("newsletter-email").value;
  if (email) {
    newsletterMessage.textContent = "Thank you for subscribing!";
    newsletterMessage.classList.remove("hidden");
    newsletterMessage.classList.add("text-accent");
    newsletterForm.reset();
    setTimeout(() => {
      newsletterMessage.classList.add("hidden");
    }, 3000);
  } else {
    newsletterMessage.textContent = "Please enter a valid email address.";
    newsletterMessage.classList.remove("hidden");
    newsletterMessage.classList.add("text-red-500");
  }
});

// Pagination
document.querySelectorAll(".page-item").forEach((item) => {
  item.addEventListener("click", function () {
    document
      .querySelectorAll(".page-item")
      .forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
    // In a real application, this would load the appropriate page of products
  });
});