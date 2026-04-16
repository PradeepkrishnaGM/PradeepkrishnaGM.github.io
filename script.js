const bootText = [
    "INITIALIZING KERNEL...",
    "LOADING MEMORY MAP... OK",
    "ESTABLISHING SECURE UPLINK...",
    "DECRYPTING PERSONNEL DATA...",
    "READY."
];

let lineIndex = 0;

function printLine() {
    const bootContainer = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');
    
    if (lineIndex < bootText.length) {
        bootContainer.innerHTML += bootText[lineIndex] + "<br>";
        lineIndex++;
        setTimeout(printLine, Math.random() * 200 + 50); // Fast but feels terminal-like
    } else {
        setTimeout(() => {
            bootContainer.style.display = 'none';
            mainContent.style.display = 'block';
            revealGrid();
        }, 500);
    }
}

// Reveal each grid section with a slide-up effect
function revealGrid() {
    const elements = document.querySelectorAll('.section-box');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('is-visible');
            el.style.transform = 'translateY(0)'; // Force reset in case of CSS conflict
        }, index * 100); // 100ms stagger between sections
    });
}

window.onload = () => {
    const hasBooted = sessionStorage.getItem('booted');
    const bootContainer = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');

    if (bootContainer && !hasBooted) {
        // First visit: play boot sequence
        printLine();
        sessionStorage.setItem('booted', 'true');
    } else {
        // Skip boot sequence
        if (bootContainer) bootContainer.style.display = 'none';
        if (mainContent) {
            mainContent.style.display = 'block';
            revealGrid();
        }
    }
};
