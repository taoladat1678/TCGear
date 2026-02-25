    
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
        e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
        toggleMobileMenu();
      });

      // Dropdown Elements
      const accountToggle = document.getElementById("account-toggle");
      const mobileAccountToggle = document.getElementById(
        "mobile-account-toggle"
      );
      const desktopAccountDropdown = document.querySelector(
        ".account-dropdown:not(#mobile-menu .account-dropdown)"
      );
      const mobileAccountDropdown = document.querySelector(
        "#mobile-menu .account-dropdown"
      );

      const languageToggle = document.getElementById("language-toggle");
      const mobileLanguageToggle = document.getElementById(
        "mobile-language-toggle"
      );
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
        ].filter(Boolean); // Filter out null/undefined
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
          return; // Do not toggle mobile dropdowns on larger screens
        }
        closeOtherDropdowns(dropdown);
        dropdown.classList.toggle("open"); // Toggle open class
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
        // Partner slider resize logic
        generateDots();
        updateSlider();
      });

      // Search Functionality
      const searchInput = document.getElementById("search-input");
      const mobileSearchInput = document.getElementById("mobile-search-input");
      [searchInput, mobileSearchInput].forEach((input) => {
        if (input) {
          input.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            const products = document.querySelectorAll(".product-card");
            products.forEach((product) => {
              const productName = product
                .querySelector("h3")
                .textContent.toLowerCase();
              product.style.display = productName.includes(query)
                ? "block"
                : "none";
            });
          });
        }
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

      // Quick View Redirect
      document.querySelectorAll(".quick-view").forEach((button) => {
        button.addEventListener("click", function () {
          const product = this.dataset.product;
          const price = this.dataset.price;
          const description = this.dataset.description;
          const image = this.dataset.image;

          const url = `detail.html?product=${encodeURIComponent(
            product
          )}&price=${encodeURIComponent(
            price
          )}&description=${encodeURIComponent(
            description
          )}&image=${encodeURIComponent(image)}`;

          window.location.href = url;
        });
      });

      // Counter Functionality
      let cartCount = 0;
      let wishlistCount = 0;
      let orderCount = 0;

      function updateCounters() {
        // Update desktop counters
        document.getElementById("cart-counter").textContent = cartCount;
        document.getElementById("wishlist-counter").textContent = wishlistCount;
        document.getElementById("orders-counter").textContent = orderCount;

        // Update mobile counters
        document.getElementById("mobile-cart-counter").textContent = cartCount;
        document.getElementById("mobile-wishlist-counter").textContent =
          wishlistCount;
        document.getElementById("mobile-orders-counter").textContent =
          orderCount;
      }

      // Add to Cart
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

      // Add to Wishlist
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

      // Partner Slider Functionality
      const partnerSlider = document.querySelector(".partner-slider");
      const partnerSlides = document.querySelector(".partner-slides");
      const sliderDotsContainer = document.querySelector(".slider-dots");
      const slides = Array.from(document.querySelectorAll(".partner-slide"));

      function getSlidesToShow() {
        return window.innerWidth <= 768 ? 2 : 3;
      }

      let currentIndex = 0;
      let autoSlideInterval;

      function generateDots() {
        sliderDotsContainer.innerHTML = "";
        const slidesToShow = getSlidesToShow();
        const totalDots = Math.ceil(slides.length / slidesToShow);
        for (let i = 0; i < totalDots; i++) {
          const dot = document.createElement("div");
          dot.classList.add("slider-dot");
          if (i === 0) dot.classList.add("active");
          dot.addEventListener("click", () => {
            currentIndex = i;
            updateSlider();
          });
          sliderDotsContainer.appendChild(dot);
        }
      }

      function updateSlider() {
        const slidesToShow = getSlidesToShow();
        const maxIndex = Math.ceil(slides.length / slidesToShow) - 1;
        if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
        }
        const offset = -(currentIndex * (100 / slidesToShow));
        partnerSlides.style.transform = `translateX(${offset}%)`;
        document.querySelectorAll(".slider-dot").forEach((dot, index) => {
          dot.classList.toggle("active", index === currentIndex);
        });
      }

      function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
          const slidesToShow = getSlidesToShow();
          const maxIndex = Math.ceil(slides.length / slidesToShow) - 1;
          currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
          updateSlider();
        }, 3000);
      }

      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }

      // Initialize slider
      generateDots();
      updateSlider();
      startAutoSlide();

      // Pause auto-slide on hover
      partnerSlider.addEventListener("mouseenter", stopAutoSlide);
      partnerSlider.addEventListener("mouseleave", startAutoSlide);

      // Handle window resize
      window.addEventListener("resize", () => {
        generateDots();
        updateSlider();
      });