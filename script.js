
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. TYPEWRITER EFFECT (Home Page Only)
    // ==========================================
    const typewriterElement = document.getElementById('typewriter-text');

    if (typewriterElement) {
        const roles = ["FRONTEND DEVELOPER", "UI/UX DESIGNER", "PYTHON ENTHUSIAST", "GAMER"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100; // Speed of typing

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                // Remove char
                typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster when deleting
            } else {
                // Add char
                typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            // Logic to switch between typing and deleting
            if (!isDeleting && charIndex === currentRole.length) {
                // Finished typing word, pause before deleting
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, switch to next word
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start the typing loop
        type();
    }


    // ==========================================
    // 2. ACTIVE NAVIGATION HIGHLIGHTING (All Pages)
    // ==========================================
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .nav-item');

    navLinks.forEach(link => {
        // Get the href attribute (e.g., "about.html")
        const linkHref = link.getAttribute('href');

        // Check if current location matches the link
        // Handle root path "/" case if necessary, but assuming file names for now
        if (linkHref === currentLocation || (currentLocation === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    // ==========================================
    // 3. SCROLL REVEAL ANIMATION (All Pages)
    // ==========================================
    const observerOptions = {
        root: null, // Use the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: Stop observing once shown if you want it to happen only once
                // observer.unobserve(entry.target); 
            } else {
                // Optional: Remove class to re-animate when scrolling back up
                // entry.target.classList.remove('show'); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

});
