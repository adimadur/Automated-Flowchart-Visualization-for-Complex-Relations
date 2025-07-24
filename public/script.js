document.addEventListener("DOMContentLoaded", function () {
    const mindmapImg = document.getElementById("mindmap-img");
    // const modal = document.getElementById("image-modal");
    // const modalImg = document.getElementById("modal-img");
    // const closeBtn = document.getElementById("close-modal");

    if (!mindmapImg) return;

    // Remove modal logic for mindmapImg click, open in new tab instead
    // mindmapImg.addEventListener("click", function (e) {
    //     e.preventDefault();
    //     window.open(mindmapImg.src, "_blank");
    // });
    mindmapImg.addEventListener("click", function (e) {
        e.preventDefault();
    
        const base64Data = mindmapImg.src.split(',')[1];
        const contentType = mindmapImg.src.split(',')[0].split(':')[1].split(';')[0];
    
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
    
        // Create Blob and object URL
        const blob = new Blob([byteArray], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
    
        // Force open in new tab securely
        const newTab = window.open();
        newTab.opener = null;
        newTab.location = blobUrl;
    });
    

});

const form = document.querySelector(".search-form");
const loadingOverlay = document.getElementById("loading-overlay");

if (form && loadingOverlay) {
    form.addEventListener("submit", function () {
        loadingOverlay.style.display = "flex";
    });
}
