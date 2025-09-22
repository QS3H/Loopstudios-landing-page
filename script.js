const btn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("menu-close");
const menu = document.getElementById("menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuItems = menu.querySelectorAll('a[role="menuitem"]');
const body = document.body;

// Focus trap variables
let lastFocusedElement;

// Add close button event listener
closeBtn.addEventListener("click", navToggle);

// Create intersection observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

// Observe elements that should animate on scroll
document.querySelectorAll(".animate-on-scroll").forEach((element) => {
  observer.observe(element);
});

// Add enhanced 3D hover effect with dynamic shadows to gallery items
document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update mouse position CSS variables
    item.style.setProperty("--mouse-x", `${x}px`);
    item.style.setProperty("--mouse-y", `${y}px`);

    // Calculate the tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    // Calculate shadow based on mouse position
    const shadowX = (centerX - x) / 10;
    const shadowY = (centerY - y) / 10;
    const shadowBlur = Math.abs(shadowX) + Math.abs(shadowY);

    // Apply transform and dynamic shadow
    item.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.05, 1.05, 1.05)
    `;
    item.style.boxShadow = `
      ${shadowX}px ${shadowY}px ${shadowBlur + 15}px rgba(0, 0, 0, 0.2),
      0 10px 20px rgba(0, 0, 0, 0.1),
      0 0 15px rgba(0, 0, 0, 0.1)
    `;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    item.style.boxShadow =
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  });
});

// Parallax effect for hero section
let ticking = false;
const heroSection = document.getElementById("hero");
const parallaxContent = document.querySelector(".parallax-content");

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      if (parallaxContent) {
        parallaxContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
});

// Smooth section transitions
const sections = document.querySelectorAll("section");
sections.forEach((section) => {
  section.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
});

// Featured section scroll animation
const featuredSection = document.getElementById("featured");
const featuredImage = document.querySelector(".featured-image-container");
const featuredText = document.querySelector(".featured-text-content");

const featuredObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        featuredSection.classList.add("is-visible");

        // Add mousemove parallax effect
        featuredSection.addEventListener("mousemove", (e) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } =
            featuredSection.getBoundingClientRect();

          const xPercent = (clientX - left) / width - 0.5;
          const yPercent = (clientY - top) / height - 0.5;

          if (featuredImage && featuredText) {
            featuredImage.style.transform = `translateX(${
              -xPercent * 20
            }px) translateY(${-yPercent * 10}px)`;
            featuredText.style.transform = `translateX(${
              xPercent * 30
            }px) translateY(${yPercent * 15}px)`;
            featuredText.style.boxShadow = `${-xPercent * 15}px ${
              -yPercent * 15
            }px 30px rgba(0,0,0,0.1)`;
          }
        });

        featuredObserver.unobserve(featuredSection);
      }
    });
  },
  { threshold: 0.2 }
);

if (featuredSection) {
  featuredObserver.observe(featuredSection);
}

// Stagger nav items animation
document.querySelectorAll(".nav-item").forEach((item, index) => {
  item.style.animationDelay = `${0.3 + index * 0.1}s`;
});

// Add loading class to body when page is fully loaded
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

btn.addEventListener("click", navToggle);

// Handle keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !menu.classList.contains("hidden")) {
    navToggle();
  }
});

function navToggle() {
  const isOpen = btn.classList.toggle("open");
  menu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
  btn.setAttribute("aria-expanded", isOpen);
  body.classList.toggle("menu-open");

  if (isOpen) {
    // Store last focused element and trap focus
    lastFocusedElement = document.activeElement;
    trapFocus();
    // Enable menu items for keyboard navigation
    menuItems.forEach((item) => item.setAttribute("tabindex", "0"));
  } else {
    // Restore focus and disable menu items
    menuItems.forEach((item) => item.setAttribute("tabindex", "-1"));
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
}

// Focus trap functionality
function trapFocus() {
  const focusableElements = menu.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  menu.addEventListener("keydown", function (e) {
    let isTabPressed = e.key === "Tab";

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });

  firstFocusableElement.focus();
}

// Handle menu overlay click
menuOverlay.addEventListener("click", () => {
  if (menu.classList.contains("active")) {
    navToggle();
  }
});
