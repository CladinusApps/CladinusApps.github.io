/* ── Release sources ──────────────────────────────────────
   Change the repo here if either app's releases move. */
const NOVADOCK_REPO    = "Cladinus/NovaDock-Releases";
const MEDIAPLAYER_REPO = "Cladinus/MediaPlayerPlusPlus-Releases";   // update if different

/* ── Footer year ───────────────────────────────────────── */
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

/* ── Latest release loader ─────────────────────────────── */
async function loadRelease({ repo, infoId, buttonId, errorId, shaId }) {
    const info = document.querySelector(`#${infoId}`);
    const button = document.querySelector(`#${buttonId}`);
    const error = document.querySelector(`#${errorId}`);
    if (!info || !button || !error) return;   // this page doesn't have that app

    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
            headers: { Accept: "application/vnd.github+json" }
        });
        if (!response.ok) throw new Error("Could not retrieve the latest release.");

        const release = await response.json();
        const installer = (release.assets || []).find(a => a.name.toLowerCase().endsWith(".exe"));
        if (!installer) throw new Error("No installer found in the latest release.");

        const version = document.createElement("h3");
        version.textContent = release.tag_name;

        const date = document.createElement("p");
        date.textContent = "Released " + new Date(release.published_at)
            .toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

        info.replaceChildren(version, date);

        if (release.body && release.body.trim()) {
            const notes = document.createElement("div");
            notes.className = "release-notes";
            notes.textContent = release.body.trim();   // textContent: never interpreted as HTML
            info.append(notes);
        }

        button.href = installer.browser_download_url;
        button.setAttribute("download", installer.name);
        button.hidden = false;

        // GitHub adds "sha256:<hash>" to each uploaded asset.
        const shaBox = shaId && document.querySelector(`#${shaId}`);
        if (shaBox && typeof installer.digest === "string" && installer.digest.startsWith("sha256:")) {
            shaBox.querySelector("code").textContent = installer.digest.slice(7);
            shaBox.hidden = false;
        }
        error.hidden = true;
    } catch (err) {
        console.error(`Release error (${repo})`, err);
        info.hidden = true;
        error.hidden = false;
    }
}

loadRelease({
    repo: NOVADOCK_REPO,
    infoId: "release-info-novadock",
    buttonId: "download-btn-novadock",
    errorId: "release-error-novadock",
    shaId: "sha-novadock"
});
loadRelease({
    repo: MEDIAPLAYER_REPO,
    infoId: "release-info-mediaplayer",
    buttonId: "download-btn-mediaplayer",
    errorId: "release-error-mediaplayer",
    shaId: "sha-mediaplayer"
});

/* ── Mobile menu ───────────────────────────────────────── */
const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const menuOverlay = document.querySelector("#menu-overlay");

if (menuToggle && menuOverlay && mobileMenu) {
    const closeMenu = () => {
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
    menuOverlay.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
}

/* ── Scroll reveal (content is always visible without JS or IntersectionObserver) ── */
if ("IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

    const revealElements = document.querySelectorAll(
        ".hero > *:not(.hero-decor), .section-heading, .app-card, .about-section > *, .faq details, .download-card"
    );
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => { el.classList.add("reveal"); observer.observe(el); });
}