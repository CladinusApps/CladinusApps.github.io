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