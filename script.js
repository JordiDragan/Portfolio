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

function setupSkillScrollbars() {
    document.querySelectorAll('.skill-scrollbar').forEach(scrollbar => scrollbar.remove());

    document.querySelectorAll('.skills-grid').forEach(grid => {
        const existingScrollbar = grid.nextElementSibling;
        if (existingScrollbar?.classList?.contains('skill-scrollbar')) {
            existingScrollbar.remove();
        }

        const scrollbar = document.createElement('div');
        scrollbar.className = 'skill-scrollbar';
        scrollbar.setAttribute('aria-hidden', 'true');
        scrollbar.innerHTML = '<div class="skill-scrollbar-thumb"></div>';

        grid.insertAdjacentElement('afterend', scrollbar);
        updateSkillScrollbar(grid, scrollbar);
    });
}

function bindSkillGridScrollListeners() {
    document.querySelectorAll('.skills-grid').forEach(grid => {
        if (grid.dataset.scrollListenerBound === 'true') return;

        grid.addEventListener('scroll', () => {
            updateSkillScrollbar(grid);
        }, { passive: true });

        grid.dataset.scrollListenerBound = 'true';
    });
}

function updateSkillScrollbar(grid, scrollbar = grid?.nextElementSibling) {
    if (!grid || !scrollbar || !scrollbar.classList.contains('skill-scrollbar')) return;

    const thumb = scrollbar.querySelector('.skill-scrollbar-thumb');
    if (!thumb) return;

    const maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
    const trackWidth = scrollbar.clientWidth;
    const thumbWidth = maxScroll > 0
        ? Math.max(36, trackWidth * (grid.clientWidth / grid.scrollWidth))
        : trackWidth;
    const maxThumbOffset = Math.max(0, trackWidth - thumbWidth);
    const thumbOffset = maxScroll > 0
        ? (grid.scrollLeft / maxScroll) * maxThumbOffset
        : 0;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translate3d(${thumbOffset}px, 0, 0)`;
    scrollbar.classList.toggle('is-scrollable', maxScroll > 0);
}

function getGridFromSkillScrollbar(scrollbar) {
    const grid = scrollbar?.previousElementSibling;
    return grid?.classList?.contains('skills-grid') ? grid : null;
}

const skillScrollbarAnimations = new WeakMap();

function cancelSkillScrollbarAnimation(grid) {
    const animationFrameId = skillScrollbarAnimations.get(grid);
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        skillScrollbarAnimations.delete(grid);
    }
}

function getTargetGridScrollFromScrollbar(scrollbar, clientX, thumbOffset = 0) {
    const grid = getGridFromSkillScrollbar(scrollbar);
    if (!grid) return null;

    const maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
    if (maxScroll === 0) return { grid, targetScrollLeft: 0 };

    const thumb = scrollbar.querySelector('.skill-scrollbar-thumb');
    const thumbWidth = thumb?.offsetWidth || 36;
    const maxThumbOffset = Math.max(0, scrollbar.clientWidth - thumbWidth);
    if (maxThumbOffset === 0) return { grid, targetScrollLeft: grid.scrollLeft };

    const scrollbarRect = scrollbar.getBoundingClientRect();
    const targetThumbOffset = Math.min(
        maxThumbOffset,
        Math.max(0, clientX - scrollbarRect.left - thumbOffset)
    );

    return {
        grid,
        targetScrollLeft: (targetThumbOffset / maxThumbOffset) * maxScroll
    };
}

function animateGridScrollTo(grid, targetScrollLeft, duration = 220) {
    cancelSkillScrollbarAnimation(grid);

    const from = grid.scrollLeft;
    const change = targetScrollLeft - from;
    if (Math.abs(change) < 0.5) {
        grid.scrollLeft = targetScrollLeft;
        return;
    }

    const startTime = performance.now();

    const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic

        grid.scrollLeft = from + (change * eased);

        if (t < 1) {
            const frameId = window.requestAnimationFrame(step);
            skillScrollbarAnimations.set(grid, frameId);
            return;
        }

        grid.scrollLeft = targetScrollLeft;
        skillScrollbarAnimations.delete(grid);
    };

    const frameId = window.requestAnimationFrame(step);
    skillScrollbarAnimations.set(grid, frameId);
}

function scrollGridFromSkillScrollbar(scrollbar, clientX, thumbOffset = 0) {
    const target = getTargetGridScrollFromScrollbar(scrollbar, clientX, thumbOffset);
    if (!target) return;

    cancelSkillScrollbarAnimation(target.grid);
    target.grid.scrollLeft = target.targetScrollLeft;
    updateSkillScrollbar(target.grid, scrollbar);
}

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

// Scroll horizontal con arrastre fluido del raton (1:1 con el puntero)
let activeGrid = null;
let isDraggingGrid = false;
let hasMovedWhileDragging = false;
let gridDragStartX = 0;
let gridStartScrollLeft = 0;
let activeSkillScrollbar = null;
let skillScrollbarThumbOffset = 0;

document.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;

    const grid = e.target.closest('.skills-grid');
    if (!grid) return;

    activeGrid = grid;
    isDraggingGrid = true;
    hasMovedWhileDragging = false;
    gridDragStartX = e.clientX;
    gridStartScrollLeft = grid.scrollLeft;

    if (typeof grid.setPointerCapture === 'function') {
        grid.setPointerCapture(e.pointerId);
    }

    grid.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
    e.preventDefault();
}, true);

document.addEventListener('pointermove', (e) => {
    if (!isDraggingGrid || !activeGrid) return;

    const delta = e.clientX - gridDragStartX;
    activeGrid.scrollLeft = gridStartScrollLeft - delta;

    if (Math.abs(delta) > 3) {
        hasMovedWhileDragging = true;
    }

    e.preventDefault();
}, true);

function stopGridDragging(pointerId) {
    if (!activeGrid) return;

    if (typeof activeGrid.releasePointerCapture === 'function') {
        try {
            activeGrid.releasePointerCapture(pointerId);
        } catch (_) {
            // Ignorar si el puntero no estaba capturado por este elemento.
        }
    }

    activeGrid.classList.remove('is-dragging');
    activeGrid = null;
    isDraggingGrid = false;
    document.body.style.userSelect = '';
}

document.addEventListener('pointerup', (e) => {
    stopGridDragging(e.pointerId);
}, true);

document.addEventListener('pointercancel', (e) => {
    stopGridDragging(e.pointerId);
}, true);

// Evita clicks accidentales en tarjetas al terminar un drag.
document.addEventListener('click', (e) => {
    if (!hasMovedWhileDragging) return;

    if (e.target.closest('.skills-grid')) {
        e.preventDefault();
        e.stopPropagation();
    }

    hasMovedWhileDragging = false;
}, true);

document.addEventListener('pointerdown', (e) => {
    const scrollbar = e.target.closest('.skill-scrollbar');
    if (!scrollbar) return;

    const grid = getGridFromSkillScrollbar(scrollbar);
    if (!grid) return;

    const thumb = scrollbar.querySelector('.skill-scrollbar-thumb');
    const thumbRect = thumb?.getBoundingClientRect();
    const isThumbTarget = Boolean(e.target.closest('.skill-scrollbar-thumb'));

    if (!isThumbTarget) {
        // Click en la pista: animacion hasta el punto clicado y dejar listo el drag continuo.
        activeSkillScrollbar = scrollbar;
        skillScrollbarThumbOffset = (thumb?.offsetWidth || 36) / 2;
        scrollbar.classList.add('is-dragging');
        document.body.style.userSelect = 'none';

        const target = getTargetGridScrollFromScrollbar(
            scrollbar,
            e.clientX,
            skillScrollbarThumbOffset
        );

        if (target) {
            animateGridScrollTo(target.grid, target.targetScrollLeft);
        }

        e.preventDefault();
        return;
    }

    activeSkillScrollbar = scrollbar;
    skillScrollbarThumbOffset = isThumbTarget && thumbRect
        ? e.clientX - thumbRect.left
        : (thumb?.offsetWidth || 36) / 2;

    scrollbar.classList.add('is-dragging');
    document.body.style.userSelect = 'none';
    scrollGridFromSkillScrollbar(scrollbar, e.clientX, skillScrollbarThumbOffset);
    e.preventDefault();
}, true);

document.addEventListener('pointermove', (e) => {
    if (!activeSkillScrollbar) return;

    scrollGridFromSkillScrollbar(activeSkillScrollbar, e.clientX, skillScrollbarThumbOffset);
    e.preventDefault();
}, true);

document.addEventListener('pointerup', () => {
    if (!activeSkillScrollbar) return;

    activeSkillScrollbar.classList.remove('is-dragging');
    activeSkillScrollbar = null;
    skillScrollbarThumbOffset = 0;
    document.body.style.userSelect = '';
}, true);

document.addEventListener('pointercancel', () => {
    if (!activeSkillScrollbar) return;

    activeSkillScrollbar.classList.remove('is-dragging');
    activeSkillScrollbar = null;
    skillScrollbarThumbOffset = 0;
    document.body.style.userSelect = '';
}, true);

// Actualizar visibilidad de las flechas según estado de scroll
// Función para copiar el email al portapapeles
function copyEmail(button) {
    const email = 'jordidrgn@gmail.com';
    const feedback = document.querySelector('.copy-email-feedback');
    const language = (document.documentElement.lang || 'es').toLowerCase().slice(0, 2);
    const buttonDefaultText = {
        es: 'Copiar',
        en: 'Copy',
        ja: 'コピー'
    };
    const buttonSuccessText = {
        es: 'Copiado',
        en: 'Copied',
        ja: 'コピー済み'
    };
    const messages = {
        es: 'Correo copiado al portapapeles.',
        en: 'Email copied to the clipboard.',
        ja: 'メールをクリップボードにコピーしました。'
    };
    const successMessage = messages[language] || messages.es;

    navigator.clipboard.writeText(email).then(() => {
        if (button) {
            button.classList.add('copied');
            button.textContent = buttonSuccessText[language] || buttonSuccessText.es;
        }

        if (feedback) {
            feedback.textContent = successMessage;
            feedback.classList.add('is-visible');
        }

        window.clearTimeout(window.copyEmailFeedbackTimer);
        window.copyEmailFeedbackTimer = window.setTimeout(() => {
            if (button) {
                button.classList.remove('copied');
                button.textContent = buttonDefaultText[language] || buttonDefaultText.es;
            }

            if (feedback) {
                feedback.classList.remove('is-visible');
            }
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        if (feedback) {
            feedback.textContent = language === 'en'
                ? 'Could not copy the email.'
                : language === 'ja'
                    ? 'メールをコピーできませんでした。'
                    : 'No se ha podido copiar el correo.';
            feedback.classList.add('is-visible');
        }
    });
}

setupSkillScrollbars();
bindSkillGridScrollListeners();

// Recalcular en resize (por ejemplo si cambia el ancho y el maxScroll)
window.addEventListener('resize', () => {
    document.querySelectorAll('.skills-grid').forEach(grid => updateSkillScrollbar(grid));
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

    setupSkillScrollbars();
    bindSkillGridScrollListeners();
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
    setupSkillScrollbars();
    bindSkillGridScrollListeners();
});