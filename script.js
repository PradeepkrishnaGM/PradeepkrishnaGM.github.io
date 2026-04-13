// Boot Sequence Animation
const bootText = [
    "INITIALIZING BIOS...",
    "MEMORY CHECK: 640K OK",
    "LOADING KERNEL MODULES... DONE",
    "MOUNTING ENCRYPTED FILESYSTEM...",
    "ESTABLISHING SECURE CONNECTION...",
    "AUTHENTICATION REQUIRED...",
    "BYPASSING SECURITY... SUCCESS",
    "ACCESSING CLASSIFIED DOSSIER...",
    " "
];

let lineIndex = 0;

function printLine() {
    const bootContainer = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');
    
    if (lineIndex < bootText.length) {
        bootContainer.innerHTML += bootText[lineIndex] + "<br>";
        lineIndex++;
        setTimeout(printLine, Math.random() * 150 + 50); // Sped up for better UX
    } else {
        setTimeout(() => {
            bootContainer.style.display = 'none';
            mainContent.style.display = 'block';
            initTerminalScroll();
        }, 500);
    }
}

function initTerminalScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        el.style.minHeight = rect.height + 'px';

        el.setAttribute('data-raw-html', el.innerHTML);
        el.innerHTML = ''; 
        
        const aosType = el.getAttribute('data-aos');
        if(aosType === 'fade-up') el.classList.add('slide-hidden', 'slide-up');
        else if(aosType === 'fade-right') el.classList.add('slide-hidden', 'slide-right');
        else if(aosType === 'fade-down') el.classList.add('slide-hidden', 'slide-down');
        else if(aosType === 'zoom-in') el.classList.add('slide-hidden', 'zoom-in');
        else el.classList.add('slide-hidden');
        
        el.removeAttribute('data-aos'); 
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                observer.unobserve(el); 
                el.classList.add('is-visible');
                typeHTML(el, 5); // Speed: ~5ms per character for snappy reading
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
    });

    elements.forEach(el => observer.observe(el));
}

function typeHTML(element, speed) {
    const html = element.getAttribute('data-raw-html');
    let i = 0;
    let isTag = false;
    let text = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor-inline';
    
    function type() {
        if (i < html.length) {
            if (html.charAt(i) === '<') isTag = true;
            text += html.charAt(i);
            i++;
            
            if (isTag) {
                while (i < html.length && html.charAt(i-1) !== '>') {
                    text += html.charAt(i);
                    i++;
                }
                isTag = false;
            }
            
            element.innerHTML = text;
            element.appendChild(cursor);
            
            const jitter = Math.random() * 10;
            setTimeout(type, speed + jitter);
        } else {
            element.innerHTML = text;
            element.style.minHeight = ''; 
        }
    }
    type();
}

// Session Storage Logic: Decides whether to show the boot screen
window.onload = function() {
    const hasBooted = sessionStorage.getItem('systemBooted');
    const bootContainer = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');

    if (bootContainer && !hasBooted) {
        // First time visiting the site (only runs on index.html)
        printLine();
        sessionStorage.setItem('systemBooted', 'true'); 
    } else {
        // Already visited, or on a subpage without a boot container
        if (bootContainer) bootContainer.style.display = 'none';
        if (mainContent) {
            mainContent.style.display = 'block';
            initTerminalScroll(); 
        }
    }
};
