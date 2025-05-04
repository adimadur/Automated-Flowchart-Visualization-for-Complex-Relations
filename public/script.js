document.addEventListener("DOMContentLoaded", function () {
    const mindmapImg = document.getElementById("mindmap-img");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementById("close-modal");

    if (!mindmapImg) return;

    let zoomed = false;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    mindmapImg.addEventListener("click", function () {
        modal.style.display = "flex";
        modalImg.src = mindmapImg.src;
        modal.classList.remove("zoomed");
        zoomed = false;
        resetImagePosition();
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
        zoomed = false;
        resetImagePosition();
    });

    modal.addEventListener("click", function (event) {
        // Close modal only when clicked outside the image (on modal background)
        if (event.target === modal || event.target === closeBtn) {
            modal.style.display = "none";
            zoomed = false;
            resetImagePosition();
        }
    });

    modalImg.addEventListener("click", function () {
        if (!zoomed) {
            modal.classList.add("zoomed");
            modalImg.style.transform = "scale(2)";
            modalImg.style.cursor = "grab";
        } else {
            resetImagePosition();
        }
        zoomed = !zoomed;
    });

    modalImg.addEventListener("wheel", function (event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            modal.classList.add("zoomed");
            modalImg.style.transform = "scale(2)";
            zoomed = true;
        } else {
            resetImagePosition();
        }
    });

    modalImg.addEventListener("mousedown", function (e) {
        if (zoomed) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            modalImg.style.cursor = "grabbing";
        }
    });

    modalImg.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        modalImg.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        modalImg.style.cursor = "grab";
    });

    function resetImagePosition() {
        modal.classList.remove("zoomed");
        modalImg.style.transform = "scale(1) translate(0, 0)";
        modalImg.style.cursor = "zoom-in";
        translateX = 0;
        translateY = 0;
    }
});

const form = document.querySelector(".search-form");
const loadingOverlay = document.getElementById("loading-overlay");

if (form && loadingOverlay) {
    form.addEventListener("submit", function () {
        loadingOverlay.style.display = "flex";
    });
}
