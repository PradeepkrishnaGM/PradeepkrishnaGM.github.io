const bootText = [
    "INITIALIZING KERNEL...",
    "LOADING MEMORY MODULES... OK",
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
        setTimeout(printLine, Math.random() * 200 + 100);
    } else {
        setTimeout(() => {
            bootContainer.style.display = 'none';
            mainContent.style.display = 'block';
            initAnimations();
        }, 600);
    }
}

function initAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
        el.setAttribute('data-raw', el.innerHTML);
        el.innerHTML = '';
        el.classList.add('slide-hidden', 'slide-up');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                typeText(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

function typeText(el) {
    const raw = el.getAttribute('data-raw');
    let i = 0;
    function typing() {
        if (i < raw.length) {
            if (raw.charAt(i) === '<') {
                i = raw.indexOf('>', i) + 1;
            } else {
                i++;
            }
            el.innerHTML = raw.substring(0, i);
            setTimeout(typing, 5);
        }
    }
    typing();
}

window.onload = () => {
    if (!sessionStorage.getItem('booted')) {
        printLine();
        sessionStorage.setItem('booted', 'true');
    } else {
        document.getElementById('boot-sequence').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        initAnimations();
    }
};
