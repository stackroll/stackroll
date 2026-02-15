document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    updateLogo(isDark);

    // for loading
    const loader = document.querySelector(".loader");
    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("done");
                document.body.style.overflow = "";

                setTimeout(triggerScrollReveals, 100);
            }, 1800);
        });
        // fallback
        setTimeout(() => {
            loader.classList.add("done");
            document.body.style.overflow = "";
            setTimeout(triggerScrollReveals, 100);
        }, 3000);
    }

    //nice mouse cursor tracking
    const cursor = document.querySelector(".cursor");
    const cursorRing = document.querySelector(".cursor-ring");
    if (cursor && cursorRing && window.matchMedia("(hover: hover)").matches) {
        let mx = 0,
            my = 0,
            cx = 0,
            cy = 0,
            rx = 0,
            ry = 0;

        document.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
        });

        function animateCursor() {
            cx += (mx - cx) * 0.2;
            cy += (my - cy) * 0.2;
            rx += (mx - rx) * 0.08;
            ry += (my - ry) * 0.08;

            cursor.style.left = cx + "px";
            cursor.style.top = cy + "px";
            cursorRing.style.left = rx + "px";
            cursorRing.style.top = ry + "px";

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverEls = document.querySelectorAll(
            "a, button, .hover-target, [data-cursor]",
        );
        hoverEls.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.classList.add("hover");
                cursorRing.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove("hover");
                cursorRing.classList.remove("hover");
            });
        });

        document.addEventListener("mousedown", () =>
            cursor.classList.add("click"),
        );
        document.addEventListener("mouseup", () =>
            cursor.classList.remove("click"),
        );
    }

    const nav = document.querySelector(".nav");
    if (nav) {
        let lastScroll = 0;
        window.addEventListener("scroll", () => {
            nav.classList.toggle("scrolled", window.scrollY > 60);
        });
    }

    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (navToggle && mobileMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("open");
            mobileMenu.classList.toggle("open");
            document.body.style.overflow = mobileMenu.classList.contains("open")
                ? "hidden"
                : "";
        });
        mobileMenu.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                navToggle.classList.remove("open");
                mobileMenu.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }

    function triggerScrollReveals() {
        const els = document.querySelectorAll(".sr, .line-reveal");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
        );
        els.forEach((el) => observer.observe(el));
    }
    triggerScrollReveals();

    const cmdOverlay = document.querySelector(".cmd-overlay");
    const cmdInput = document.querySelector(".cmd-input");
    const cmdResults = document.querySelector(".cmd-results");

    const commands = [
        {
            icon: '<img src="/Images/house.png" class="icon-img">',
            title: "Home",
            sub: "Go to homepage",
            url: "/",
            keys: ["home"],
        },
        {
            icon: '<img src="/Images/customer-service.png" class="icon-img">',
            title: "Services",
            sub: "What we do",
            url: "/pages/services.html",
            keys: ["services", "what"],
        },
        {
            icon: '<img src="/Images/3d-briefcase.png" class="icon-img">',
            title: "Work",
            sub: "Our projects",
            url: "/pages/work.html",
            keys: ["work", "projects", "portfolio"],
        },
        {
            icon: '<img src="/Images/contact-us.png" class="icon-img">',
            title: "Contact",
            sub: "Get a quote",
            url: "/pages/contact.html",
            keys: ["contact", "quote", "email", "hire"],
        },
        {
            icon: '<img src="/Images/day-and-night.png" class="icon-img">',
            title: "Toggle Dark Mode",
            sub: "Switch theme",
            action: "darkmode",
            keys: ["dark", "theme", "mode"],
        },
        {
            icon: '<img src="/Images/return.png" class="icon-img">',
            title: "Back to Top",
            sub: "Scroll to top",
            action: "scrolltop",
            keys: ["top", "scroll"],
        },
    ];

    function openCmd() {
        if (!cmdOverlay) return;
        cmdOverlay.classList.add("open");
        cmdInput.value = "";
        cmdInput.focus();
        renderCommands("");
        document.body.style.overflow = "hidden";
    }
    function closeCmd() {
        if (!cmdOverlay) return;
        cmdOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    function updateLogo(isDark) {
        const logo = document.querySelector(".nav-logo-icon");
        if (!logo) return;

        const darkSrc = logo.getAttribute("data-dark");
        const lightSrc = logo.getAttribute("data-light");

        logo.src = isDark ? darkSrc : lightSrc;
    }

    function renderCommands(query) {
        if (!cmdResults) return;
        const filtered = commands.filter((c) => {
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                c.title.toLowerCase().includes(q) ||
                c.sub.toLowerCase().includes(q) ||
                c.keys.some((k) => k.includes(q))
            );
        });
        cmdResults.innerHTML = filtered
            .map(
                (c, i) => `
      <div class="cmd-item ${i === 0 ? "selected" : ""}" data-index="${i}">
        <div class="cmd-item-icon">${c.icon}</div>
        <div class="cmd-item-text">
          <div class="cmd-item-title">${c.title}</div>
          <div class="cmd-item-sub">${c.sub}</div>
        </div>
      </div>
    `,
            )
            .join("");

        cmdResults.querySelectorAll(".cmd-item").forEach((item, idx) => {
            item.addEventListener("click", () => executeCommand(filtered[idx]));
        });
    }

    function executeCommand(cmd) {
        closeCmd();
        if (cmd.url) {
            navigateTo(cmd.url);
        } else if (cmd.action === "darkmode") {
            const root = document.documentElement;
            const isDark = root.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateLogo(isDark);
        } else if (cmd.action === "scrolltop") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            cmdOverlay?.classList.contains("open") ? closeCmd() : openCmd();
        }

        if (e.key === "Escape") closeCmd();

        if (e.key === "Enter" && cmdOverlay?.classList.contains("open")) {
            const selected = cmdResults?.querySelector(".cmd-item.selected");
            if (selected) selected.click();
        }
    });

    if (cmdInput) {
        cmdInput.addEventListener("input", (e) =>
            renderCommands(e.target.value),
        );
    }

    if (cmdOverlay) {
        cmdOverlay.addEventListener("click", (e) => {
            if (e.target === cmdOverlay) closeCmd();
        });
    }

    const shortcutBtn = document.querySelector(".nav-shortcut");
    if (shortcutBtn) shortcutBtn.addEventListener("click", openCmd);

    const pageTransition = document.querySelector(".page-transition");

    window.navigateTo = function (url) {
        if (!pageTransition) {
            window.location.href = url;
            return;
        }
        pageTransition.classList.add("active");
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    };

    document.querySelectorAll("a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (
            href &&
            (href.startsWith("/") || href.endsWith(".html")) &&
            !href.startsWith("//") &&
            !href.startsWith("mailto:")
        ) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                navigateTo(href);
            });
        }
    });

    const rotatingEls = document.querySelectorAll(".rotating-text");
    rotatingEls.forEach((el) => {
        const words = el.dataset.words.split(",");
        let idx = 0;
        el.textContent = words[0];

        setInterval(() => {
            el.style.opacity = "0";
            el.style.transform = "translateY(10px)";
            setTimeout(() => {
                idx = (idx + 1) % words.length;
                el.textContent = words[idx];
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }, 300);
        }, 2500);
    });

    document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "";
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = document.querySelector(a.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
});
