// Define the base path for GitHub Pages if applicable
const GITHUB_PAGES_BASE_PATH = '/hotel-1/'; // Adjust this if your project is in a different subdirectory

// Data for gallery images
const galleryImages = [
    { url: `${GITHUB_PAGES_BASE_PATH}12.jpg`, title: 'Hotel Exterior', category: 'Garden' },
    { url: `${GITHUB_PAGES_BASE_PATH}11.jpg`, title: 'Nearby Places', category: 'Temple' },
    { url: `${GITHUB_PAGES_BASE_PATH}fttemple.jpg`, title: 'Nearby Places', category: 'Temple' },
    { url: `${GITHUB_PAGES_BASE_PATH}13.jpg`, title: 'Hotel Exterior', category: 'Exterior' },
    { url: `${GITHUB_PAGES_BASE_PATH}vip.jpg`, title: 'Deluxe Suite', category: 'Rooms' },
    { url: `${GITHUB_PAGES_BASE_PATH}14.jpg`, title: 'Garden', category: 'Amenities' },
    { url: `${GITHUB_PAGES_BASE_PATH}templeview.jpg`, title: 'Nearby Attractions', category: 'Temple' },
    { url: `${GITHUB_PAGES_BASE_PATH}3bed.jpg`, title: 'Family Suite', category: 'Rooms' }
];

// Cache frequently accessed DOM elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');
const floatingBtn = document.getElementById('floatingBtn');
const floatingOptions = document.getElementById('floatingOptions');
const galleryModal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const galleryGrid = document.querySelector('.gallery-grid'); // Get the parent for event delegation

// Global state variables
let currentImageIndex = 0;
let isFloatingOpen = false;
let sliderInterval; // Variable to hold the interval for the hero slider

// --- Utility Functions ---

/**
 * Debounce function to limit how often a function can run.
 * Useful for scroll, resize, input events.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} A debounced version of the function.
 */
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// --- Event Handlers and Core Functionality ---

// Header scroll effect (debounced for performance)
const handleHeaderScroll = debounce(() => {
    if (header) { // Check if header exists before manipulating
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 100); // Debounce by 100ms

// Mobile menu toggle
// Removed duplicate function from here and kept the one at the bottom with the 'active' class toggle
function toggleMobileMenu() {
    if (nav && mobileMenuBtn) { // Check if elements exist
        nav.classList.toggle('show');
        // MODIFIED: Uncommented this line for hamburger-to-cross animation
        mobileMenuBtn.classList.toggle('active'); 
    }
}


// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Floating contact toggle
function toggleFloatingContact() {
    isFloatingOpen = !isFloatingOpen;
    if (floatingOptions && floatingBtn) { // Check if elements exist
        floatingOptions.classList.toggle('show', isFloatingOpen); // Toggles 'show' based on isFloatingOpen
        floatingBtn.innerHTML = isFloatingOpen ? '✕' : '💬';
        // Add ARIA attributes for accessibility
        floatingBtn.setAttribute('aria-expanded', isFloatingOpen);
        floatingOptions.setAttribute('aria-hidden', !isFloatingOpen);
    }
}

// Gallery modal functions
function updateModalContent() {
    const imageData = galleryImages[currentImageIndex];
    if (imageData && modalImage && modalTitle && modalCategory) { // Check if elements exist
        modalImage.src = imageData.url;
        modalTitle.textContent = imageData.title;
        modalCategory.textContent = imageData.category;
    }
}

function openModal(index) {
    currentImageIndex = index;
    updateModalContent();
    if (galleryModal) {
        galleryModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        // Add ARIA attributes for accessibility
        galleryModal.setAttribute('aria-modal', 'true');
        galleryModal.setAttribute('role', 'dialog');
    }
}

function closeModal() {
    if (galleryModal) {
        galleryModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        // Remove ARIA attributes
        galleryModal.removeAttribute('aria-modal');
        galleryModal.removeAttribute('role');
    }
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalContent(); // Use updateModalContent instead of openModal to avoid re-adding classes
}

function prevImage() {
    currentImageIndex = (currentImageIndex === 0) ? galleryImages.length - 1 : currentImageIndex - 1;
    updateModalContent(); // Use updateModalContent instead of openModal
}

// Preload images for better performance in the gallery (once on DOMContentLoaded)
function preloadGalleryImages() {
    galleryImages.forEach(image => {
        const img = new Image();
        img.src = image.url;
    });
}

// Hero Image Slider Functionality (Non-conflicting)
const newSliderImages = document.querySelectorAll('#heroNewImageSlider .new-slide-image');
let currentNewSlide = 0;

function startNewHeroSlider() {
    if (newSliderImages.length === 0) return;

    // Ensure the first image is active on load
    newSliderImages[currentNewSlide].classList.add('active-new-slide');

    // Clear any existing interval to prevent multiple sliders running
    if (sliderInterval) {
        clearInterval(sliderInterval);
    }

    sliderInterval = setInterval(() => {
        // Remove active class from the current slide
        newSliderImages[currentNewSlide].classList.remove('active-new-slide');

        // Move to the next slide, loop back to start if at the end
        currentNewSlide = (currentNewSlide + 1) % newSliderImages.length;

        // Add active class to the new current slide
        newSliderImages[currentNewSlide].classList.add('active-new-slide');
    }, 5000); // Change image every 5 seconds (adjust this value as desired)
}


// --- Main Execution Block (DOM Content Loaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect listener
    window.addEventListener('scroll', handleHeaderScroll);

    // Mobile menu button listener
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links smooth scroll and menu close
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            if (nav && nav.classList.contains('show')) { // Check if nav is open
                nav.classList.remove('show'); // Close mobile menu after clicking a link
                // ADDED: Ensure hamburger reverts to original state when menu is closed by link click
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active'); 
                }
            }
        });
    });

    // Floating contact button listener
    if (floatingBtn) {
        floatingBtn.addEventListener('click', toggleFloatingContact);
    }

    // Gallery item click listener using event delegation on the parent
    if (galleryGrid) {
        galleryGrid.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = Array.from(galleryGrid.children).indexOf(galleryItem);
                if (index !== -1) {
                    openModal(index);
                }
            }
        });
    }

    // Modal close when clicking outside (using event listener directly on modal)
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
        // Add listeners for modal navigation buttons if they exist
        const modalPrev = galleryModal.querySelector('.modal-nav.prev');
        const modalNext = galleryModal.querySelector('.modal-nav.next');
        if (modalPrev) modalPrev.addEventListener('click', prevImage);
        if (modalNext) modalNext.addEventListener('click', nextImage);
    }


    // Keyboard navigation for modal (only if modal is present)
    if (galleryModal) {
        document.addEventListener('keydown', (e) => {
            if (galleryModal.classList.contains('show')) {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                }
            }
        });
    }


    // Intersection Observer for animations (sections and cards)
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start observing 50px before the viewport bottom
    };

    const observer = new IntersectionObserver((entries) => { // Removed 'observer' param as it's not used directly
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed'); // Add a class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        'section, .room-card, .gallery-item, .info-card, .contact-card, .booking-card'
    );
    elementsToAnimate.forEach(el => {
        // Ensure no 'revealed' class initially, let CSS handle initial hidden state
        observer.observe(el);
    });

    // Preload gallery images for better performance
    preloadGalleryImages();

    // Start the new hero slider
    startNewHeroSlider();

    // Expose scrollToSection to global scope for inline onclick usage (e.g., in hero buttons)
    window.scrollToSection = scrollToSection;
});

// REMOVED DUPLICATE: This function was already defined above and called correctly within DOMContentLoaded.
// function toggleMobileMenu() {
//     if (nav && mobileMenuBtn) { // Check if elements exist
//         nav.classList.toggle('show');
//         mobileMenuBtn.classList.toggle('active'); // <--- ADD THIS LINE
//     }
// }