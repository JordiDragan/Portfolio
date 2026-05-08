// Menú hamburguesa responsive
document.addEventListener('click', (e) => {
    if (e.target.closest('.menu-toggle')) {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        menuToggle?.classList.toggle('active');
        navLinks?.classList.toggle('active');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        event.preventDefault();
        // Buscar en el momento del click, no al inicio
        document.querySelector('.menu-toggle')?.classList.remove('active');
        document.querySelector('.nav-links')?.classList.remove('active');
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerInstance.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

window.addEventListener('scroll', () => {
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        const isActive = link.getAttribute('href').slice(1) === currentSection;
        link.classList.toggle('active', isActive);
    });
});

// Scroll horizontal con arrastre del ratón
let activeGrid = null;
let isDown = false;
let startX = 0;
let scrollLeft = 0;
let hasMovedWhileDragging = false;
let dragGhost = null;

document.addEventListener('mousedown', (e) => {
    const grid = e.target.closest('.skills-grid');
    if (!grid) return;

    console.log('Mouse down en grid');
    activeGrid = grid;
    isDown = true;
    hasMovedWhileDragging = false;
    startX = e.pageX - grid.getBoundingClientRect().left;
    scrollLeft = grid.scrollLeft;
    
    // Crear fantasma visual que sigue al ratón
    dragGhost = document.createElement('div');
    dragGhost.className = 'drag-ghost';
    dragGhost.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        opacity: 0.8;
        border: 3px solid var(--accent-purple);
        border-radius: 15px;
        background: rgba(215, 166, 255, 0.15);
        width: 150px;
        height: 150px;
        box-shadow: 0 0 30px rgba(215, 166, 255, 0.6), inset 0 0 20px rgba(215, 166, 255, 0.2);
        will-change: transform;
    `;
    document.body.appendChild(dragGhost);
    
    // Cambiar cursor del grid y todos los skill-items dentro
    grid.style.setProperty('cursor', 'grabbing', 'important');
    grid.querySelectorAll('.skill-item').forEach(item => {
        item.style.setProperty('cursor', 'grabbing', 'important');
    });
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDown || !activeGrid) return;

    e.preventDefault();
    const x = e.pageX - activeGrid.getBoundingClientRect().left;
    const walk = (x - startX) * 1.5;
    
    // Scroll suave con easing
    activeGrid.scrollLeft = scrollLeft - walk;
    
    // Mover el fantasma al ratón con transformación suave
    if (dragGhost) {
        dragGhost.style.transform = `translate(calc(${e.pageX}px - 50%), calc(${e.pageY}px - 50%))`;
    }
    
    // Mantener cursor grabbing en todo
    activeGrid.style.setProperty('cursor', 'grabbing', 'important');
    activeGrid.querySelectorAll('.skill-item').forEach(item => {
        item.style.setProperty('cursor', 'grabbing', 'important');
    });
    
    if (Math.abs(walk) > 5) {
        hasMovedWhileDragging = true;
    }
});

document.addEventListener('mouseup', (e) => {
    if (!activeGrid) return;
    
    console.log('Mouse up');
    if (hasMovedWhileDragging) {
        e.preventDefault();
    }
    
    // Eliminar fantasma con animación suave
    if (dragGhost) {
        dragGhost.style.transition = 'all 0.3s ease-out';
        dragGhost.style.opacity = '0';
        dragGhost.style.transform = 'translate(-50%, -50%) scale(0.5)';
        setTimeout(() => {
            if (dragGhost && dragGhost.parentNode) {
                dragGhost.parentNode.removeChild(dragGhost);
            }
            dragGhost = null;
        }, 300);
    }
    
    // Volver a grab en todo
    activeGrid.style.setProperty('cursor', 'grab', 'important');
    activeGrid.querySelectorAll('.skill-item').forEach(item => {
        item.style.setProperty('cursor', 'grab', 'important');
    });
    
    isDown = false;
    activeGrid = null;
});

document.addEventListener('mouseenter', (e) => {
    const grid = e.target.closest('.skills-grid');
    if (!grid || isDown) return; // No cambiar cursor si estamos arrastrando
    
    grid.style.setProperty('cursor', 'grab', 'important');
    grid.querySelectorAll('.skill-item').forEach(item => {
        item.style.setProperty('cursor', 'grab', 'important');
    });
}, true);

document.addEventListener('mouseover', (e) => {
    // Mantener grab en cualquier elemento dentro del grid
    const grid = e.target.closest('.skills-grid');
    if (!grid || isDown) return;
    
    grid.style.setProperty('cursor', 'grab', 'important');
    const skillItem = e.target.closest('.skill-item');
    if (skillItem) {
        skillItem.style.setProperty('cursor', 'grab', 'important');
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    const grid = e.target.closest('.skills-grid');
    if (!grid || isDown) return; // No cambiar cursor si estamos arrastrando
    
    grid.style.cursor = 'auto';
    grid.querySelectorAll('.skill-item').forEach(item => {
        item.style.cursor = 'auto';
    });
}, true);

// Actualizar visibilidad de las flechas según estado de scroll
function updateArrowsForGrid(grid) {
    if (!grid) return;
    const maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
    const parent = grid.closest('.skill-category');
    if (!parent) return;
    const leftAtStart = grid.scrollLeft <= 5;
    const rightAtEnd = grid.scrollLeft >= (maxScroll - 5);
    parent.classList.toggle('no-left', leftAtStart);
    parent.classList.toggle('no-right', rightAtEnd);
}

// Añadir listeners a cada grid y ejecutar comprobación inicial
document.querySelectorAll('.skills-grid').forEach(grid => {
    // comprobar al hacer scroll
    grid.addEventListener('scroll', () => updateArrowsForGrid(grid), { passive: true });
    // comprobación inicial
    updateArrowsForGrid(grid);
});

// Recalcular en resize (por ejemplo si cambia el ancho y el maxScroll)
window.addEventListener('resize', () => {
    document.querySelectorAll('.skills-grid').forEach(updateArrowsForGrid);
});

// ============ SISTEMA DE IDIOMAS ============
const DEFAULT_LANGUAGE = 'es';
const LANGUAGES = ['es', 'en', 'ja'];
const MENU_LABELS = {
    es: 'Abrir menú',
    en: 'Open menu',
    ja: 'メニューを開く'
};

function getSavedLanguage() {
    return localStorage.getItem('language') || DEFAULT_LANGUAGE;
}

function saveLanguage(lang) {
    localStorage.setItem('language', lang);
}

function updateMenuToggleLabel(lang) {
    const label = MENU_LABELS[lang] || MENU_LABELS[DEFAULT_LANGUAGE];

    document.querySelectorAll('.menu-toggle').forEach(menuToggle => {
        menuToggle.setAttribute('aria-label', label);
        menuToggle.setAttribute('title', label);
    });
}

async function loadLanguageContent(lang) {
    try {
        const file = lang === 'es' ? 'index.html' : `content-${lang}.html`;
        const mainContent = document.getElementById('main-content');
        const nav = document.querySelector('nav');

        // Ocultar mientras carga
        mainContent.style.opacity = '0';

        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.getElementById('main-content');
        const newNav = doc.querySelector('nav');

        if (newNav && nav) {
            nav.innerHTML = newNav.innerHTML;
        }

        document.documentElement.lang = lang;

        mainContent.innerHTML = newContent ? newContent.innerHTML : html;
        reinitializeEventListeners();
        updateActiveLangButton(lang);
        updateMenuToggleLabel(lang);

        // Mostrar con fade-in suave
        requestAnimationFrame(() => {
            mainContent.style.transition = 'opacity 0.3s ease';
            mainContent.style.opacity = '1';
        });

    } catch (error) {
        console.error(`Error loading language content: ${error.message}`);
        document.getElementById('main-content').style.opacity = '1';
    }
} 

function reinitializeEventListeners() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Animaciones fade-in-up
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // Drag-to-scroll
    document.querySelectorAll('.skills-grid').forEach(grid => {
        grid.addEventListener('scroll', () => updateArrowsForGrid(grid), { passive: true });
        updateArrowsForGrid(grid);
    });
}

function updateActiveLangButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function setLanguage(lang) {
    if (!LANGUAGES.includes(lang)) return;
    saveLanguage(lang);
    updateActiveLangButton(lang);
    updateMenuToggleLabel(lang);
    loadLanguageContent(lang);
}

// Delegación de eventos — funciona aunque los botones se reemplacen
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) setLanguage(btn.dataset.lang);
});

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(getSavedLanguage());
});