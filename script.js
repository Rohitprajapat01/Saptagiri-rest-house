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
const galleryItems = document.querySelectorAll('.gallery-item');

let currentImageIndex = 0;

// Helper function to smooth scroll
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
        // Close mobile menu if open
        if (nav.classList.contains('show')) {
            toggleMobileMenu();
        }
    }
}

// Gallery Modal Functions
function openModal(index) {
    currentImageIndex = index;
    updateModalContent();
    galleryModal.classList.add('show');
    document.body.classList.add('modal-open'); // Prevent body scroll
}

function closeModal() {
    galleryModal.classList.remove('show');
    document.body.classList.remove('modal-open');
}

function updateModalContent() {
    const image = galleryImages[currentImageIndex];
    modalImage.src = image.url;
    modalTitle.textContent = image.title;
    modalCategory.textContent = image.category;
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalContent();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalContent();
}

// Preload gallery images (optional, for better UX)
function preloadGalleryImages() {
    galleryImages.forEach(image => {
        const img = new Image();
        img.src = image.url;
    });
}

// New Hero Image Slider
let heroSlideIndex = 0;
let heroSlides = [];
let heroSliderInterval;

function startNewHeroSlider() {
    const heroSliderContainer = document.getElementById('heroNewImageSlider');
    if (!heroSliderContainer) return;

    // Create image elements for each slide
    heroSlides = galleryImages.slice(0, 3).map(image => { // Use first 3 images for hero
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.classList.add('new-slide-image');
        heroSliderContainer.appendChild(img);
        return img;
    });

    if (heroSlides.length > 0) {
        showHeroSlide(heroSlideIndex);
        heroSliderInterval = setInterval(() => {
            heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
            showHeroSlide(heroSlideIndex);
        }, 5000); // Change image every 5 seconds
    }
}

function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.remove('active-new-slide');
        if (i === index) {
            slide.classList.add('active-new-slide');
        }
    });
}

// Main DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // --- Header scroll effect ---
    function handleScroll() {
        if (window.scrollY > 50) {
            if (!header.classList.contains('scrolled')) { // Prevent re-adding
                header.classList.add('scrolled');
            }
        } else {
            if (header.classList.contains('scrolled')) { // Prevent re-removing
                header.classList.remove('scrolled');
            }
        }
        // You can uncomment the line below for debugging in browser console
        // console.log('Scroll Y:', window.scrollY, 'Scrolled class:', header.classList.contains('scrolled'));
    }

    // IMPORTANT FIX: Call handleScroll after a small delay to ensure initial state is set correctly
    // This helps with browser rendering variations on load, especially on mobile.
    setTimeout(handleScroll, 100); 

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // --- Mobile menu toggle ---
    if (mobileMenuBtn) { // Check if mobileMenuBtn exists
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // --- Floating Contact Button Toggle ---
    if (floatingBtn && floatingOptions) {
        floatingBtn.addEventListener('click', () => {
            floatingOptions.classList.toggle('show');
            floatingBtn.classList.toggle('active'); // Add/remove active class for visual feedback
        });
    }

    // Close floating options if clicked outside
    document.addEventListener('click', (event) => {
        if (!floatingBtn.contains(event.target) && !floatingOptions.contains(event.target)) {
            floatingOptions.classList.remove('show');
            floatingBtn.classList.remove('active');
        }
    });

    // --- Gallery Initialization ---
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    // Intersection Observer for animations (for sections and cards)
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start observing 50px before the viewport bottom
    };

    const observer = new IntersectionObserver((entries) => {
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
        observer.observe(el);
    });

    // Preload gallery images for better performance
    preloadGalleryImages();

    // Start the new hero slider
    startNewHeroSlider();

    // Expose scrollToSection to global scope for inline onclick usage (e.g., in hero buttons)
    window.scrollToSection = scrollToSection;
});

// Mobile menu toggle
function toggleMobileMenu() {
    if (nav && mobileMenuBtn) { // Check if elements exist
        nav.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active'); 
    }
}
