(() => {
    "use strict";

    // Smooth reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".portal__card, .how__step, .feature__card, .privacy__item").forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });

    // Nav background on scroll
    const nav = document.querySelector(".nav");
    window.addEventListener("scroll", () => {
        nav.style.borderBottomColor = window.scrollY > 50 ? "var(--border)" : "transparent";
    });

    // Active nav link
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav__links a:not(.nav__cta)");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.style.color = "";
            if (link.getAttribute("href") === `#${current}`) {
                link.style.color = "var(--text-primary)";
            }
        });
    });
})();
