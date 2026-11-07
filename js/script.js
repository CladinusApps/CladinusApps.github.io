const yearElement = document.querySelector("#year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


async function loadRelease(appName, repo, infoId, buttonId, errorId) {
    const releaseInfo = document.querySelector(`#${infoId}`);
    const downloadBtn = document.querySelector(`#${buttonId}`);
    const releaseError = document.querySelector(`#${errorId}`);

    if (!releaseInfo || !downloadBtn || !releaseError){
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);

        if (!response.ok) {
            throw new Error("Could not retrieve the latest release.");
        }
        const release = await response.json();
        const installer = release.assets.find(asset =>
            asset.name.toLowerCase().endsWith(".exe")
        );

        if (!installer) {
            throw new Error("No installer found.");
        }

        releaseInfo.replaceChildren();

        const version = document.createElement("h3");
        version.textContent = release.tag_name;

        const date = document.createElement("p");
        date.textContent = "Released on " +
                            new Date(release.published_at).toLocaleDateString();

        const notes = document.createElement("p");
        notes.textContent = release.body || "No release notes available.";
        notes.style.whiteSpace = "pre-wrap";

        releaseInfo.append(version, date, notes);

        downloadBtn.href = installer.browser_download_url;
        downloadBtn.download = installer.name;
        downloadBtn.hidden = false
    } catch (error) {
        console.error("NovaDock release error", error);
        releaseInfo.hidden = false;
        releaseInfo.textContent = error.message;
        releaseError.hidden = false;
    }
}

loadRelease(
    "NovaDock",
    "M-H-S-2637/NovaDock-Releases",
    "release-info-novadock",
    "download-btn-novadock",
    "release-error-novadock"
);
loadRelease(
    "MediaPlayer++",
    "M-H-S-2637/MediaPlayerPlusPlus-Releases",
    "release-info-mediaplayer",
    "download-btn-mediaplayer",
    "release-error-mediaplayer"
);


const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const menuOverlay = document.querySelector("#menu-overlay");

if (menuToggle && menuOverlay && mobileMenu) {
    function closeMenu() {
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("menu-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    menuOverlay.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}


const revealElements = document.querySelectorAll(
    ".hero > *, .section-heading, .app-card, .about-section > *, .footer > *"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting){
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});