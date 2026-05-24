<<<<<<< HEAD
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

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function getLocaleValue(locale, path) {
    return path.split('.').reduce((value, key) => value?.[key], locale);
}

function renderTextBlock(value) {
    if (Array.isArray(value)) {
        return value.map(item => `<p>${escapeHtml(item)}</p>`).join('');
    }

    return escapeHtml(value || '').replace(/\n/g, '<br>');
}

function renderProjectCard(project) {
    const image = project.image || {};
    const badges = Array.isArray(project.badges) ? project.badges : [];

    return `
            <div class="proyecto-card fade-in-up">
                <div class="proyecto-image">
                    <img src="${escapeAttribute(image.src || '')}" alt="${escapeAttribute(image.alt || '')}"${image.style ? ` style="${escapeAttribute(image.style)}"` : ''}>
                </div>
                <div class="proyecto-content">
                    <h3 class="proyecto-title">${escapeHtml(project.title || '')}</h3>
                    <p class="proyecto-description">${renderTextBlock(project.description || '')}</p>
                    <div class="badges">
                        ${badges.map(badge => `<span class="badge">${escapeHtml(badge)}</span>`).join('')}
                    </div>
                </div>
            </div>`;
}

function renderProjectsSection(projects) {
    if (!projects) return '';

    return `
    <section class="proyectos" id="proyectos">
        <h2 class="section-title">${escapeHtml(projects.title || '')}</h2>
        <div class="proyectos-grid">
            ${(projects.items || []).map(renderProjectCard).join('')}
        </div>
    </section>`;
}

function renderSkillItem(skill) {
    return `
                    <div class="skill-item">
                        <div class="skill-icon" aria-label="${escapeAttribute(skill.alt || skill.label || '')}">
                            <img src="${escapeAttribute(skill.icon || '')}" alt="${escapeAttribute(skill.alt || skill.label || '')}">
                        </div>
                        <div class="skill-name">${escapeHtml(skill.label || '')}</div>
                    </div>`;
}

function renderSkillsSection(skills) {
    if (!skills) return '';

    return `
    <section class="skills" id="skills">
        <h2 class="section-title">${escapeHtml(skills.title || '')}</h2>
        <div class="skills-container">
            ${(skills.categories || []).map(category => `
            <div class="skill-category fade-in-up">
                <h3 class="category-title">${escapeHtml(category.title || '')}</h3>
                <div class="skills-grid${category.gridClass ? ` ${escapeAttribute(category.gridClass)}` : ''}">
${(category.items || []).map(renderSkillItem).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>`;
}

function renderExperienceItem(item) {
    return `
        <div class="experiencia-item fade-in-up">
            <div class="experiencia-header">
                <div>
                    <h3 class="experiencia-title">${escapeHtml(item.title || '')}</h3>
                    <p class="experiencia-empresa">${escapeHtml(item.company || '')}</p>
                </div>
                <div class="experiencia-dates">${escapeHtml(item.dates || '')}</div>
            </div>
            <ul class="experiencia-tasks">
                ${(item.tasks || []).map(task => `<li>${escapeHtml(task)}</li>`).join('')}
            </ul>
        </div>`;
}

function renderExperienceSection(experience) {
    if (!experience) return '';

    return `
    <section class="experiencia" id="experiencia">
        <h2 class="section-title">${escapeHtml(experience.title || '')}</h2>
        ${(experience.items || []).map(renderExperienceItem).join('')}
    </section>`;
}

function renderEducationItem(item) {
    return `
            <div class="timeline-item fade-in-up">
                <div class="timeline-content fade-in-up">
                    <div class="timeline-title">${escapeHtml(item.title || '')}</div>
                    <div class="timeline-year">${escapeHtml(item.year || '')}</div>
                    <div class="timeline-description">${escapeHtml(item.description || '')}</div>
                </div>
            </div>`;
}

function renderEducationSection(education) {
    if (!education) return '';

    return `
    <section class="estudios" id="estudios">
        <h2 class="section-title">${escapeHtml(education.title || '')}</h2>
        <div class="timeline">
${(education.items || []).map(renderEducationItem).join('')}
        </div>
    </section>`;
}

const CONTACT_SVGS = {
    linkedin: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.84v1.64h.05c.53-1 1.83-2.06 3.77-2.06C21.7 8.58 22 11.05 22 14.27V21h-4v-5.96c0-1.42-.03-3.26-1.99-3.26-1.99 0-2.3 1.56-2.3 3.16V21h-4V9Z" /></svg>',
    github: '<svg viewBox="0 0 24 24" role="img" focusable="false"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.41-4.04-1.41-.55-1.37-1.33-1.74-1.33-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.07 1.83 2.8 1.3 3.49 1 .11-.77.42-1.3.77-1.6-2.67-.3-5.47-1.32-5.47-5.88 0-1.3.47-2.37 1.23-3.21-.13-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.22a11.5 11.5 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.65.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.21 0 4.57-2.81 5.58-5.49 5.88.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.58A12 12 0 0 0 12 .5Z" /></svg>'
};

function renderContactLink(link) {
    const icon = CONTACT_SVGS[link.icon] || '';
    return `
                <a href="${escapeAttribute(link.url || '#')}" target="_blank" rel="noopener noreferrer" class="contacto-link">
                    <span class="contacto-icon" aria-hidden="true">${icon}</span>
                    ${escapeHtml(link.label || '')}
                </a>`;
}

function renderContactSection(contact) {
    if (!contact) return '';

    return `
    <section class="contacto" id="contacto">
        <div class="contacto-content fade-in-up">
            <h2 class="section-title">${escapeHtml(contact.title || '')}</h2>
            <p class="hero-text contact-desc">${renderTextBlock(contact.description || '')}</p>
            <div class="contacto-email fade-in-up">
                <div class="email-display">${escapeHtml(contact.email || '')}</div>
                <button class="copy-email-btn" onclick="copyEmail(this)">${escapeHtml(contact.copyButton || '')}</button>
            </div>
            <p class="copy-email-feedback" aria-live="polite"></p>
            <div class="contacto-links fade-in-up">
                ${(contact.links || []).map(renderContactLink).join('')}
            </div>
        </div>
    </section>`;
}

function renderHeroSection(hero) {
    if (!hero) return '';

    return `
    <section class="hero" id="sobre-mi">
        <div class="hero-content">
            <img src="Fotos/yo2.png" alt="${escapeAttribute(hero.imageAlt || '')}" class="hero-image">
            <h1>${escapeHtml(hero.name || '')}</h1>
            <div class="title">${escapeHtml(hero.title || '')}</div>
            <p class="hero-text">${renderTextBlock(hero.description || '')}</p>
            <div class="hero-actions">
                <a href="#contacto" class="cta-button">${escapeHtml(hero.contact || '')}</a>
                <a href="cv.pdf" class="cta-button" download="Jordi Dragan - CV.pdf">${escapeHtml(hero.downloadcv || '')}</a>
            </div>
        </div>
    </section>`;
}

function renderLocaleMainContent(locale) {
    if (!locale) return '';

    const structuredContent = [
        locale.hero && renderHeroSection(locale.hero),
        locale.projects && renderProjectsSection(locale.projects),
        locale.skills && renderSkillsSection(locale.skills),
        locale.experience && renderExperienceSection(locale.experience),
        locale.education && renderEducationSection(locale.education),
        locale.contact && renderContactSection(locale.contact)
    ].filter(Boolean).join('\n');

    return structuredContent || locale.mainHtml || '';
}

function applyLocaleText(locale) {
    if (!locale) return;

    document.documentElement.lang = locale.lang || document.documentElement.lang || DEFAULT_LANGUAGE;
    document.title = locale.title || document.title;

    document.querySelector('.menu-toggle')?.setAttribute('aria-label', locale.menuLabel || '');
    document.querySelector('.menu-toggle')?.setAttribute('title', locale.menuLabel || '');

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const localizedText = getLocaleValue(locale, element.dataset.i18n);
        if (typeof localizedText === 'string') {
            element.textContent = localizedText;
        }
    });
}

function getCopyEmailTexts(locale) {
    const contact = locale?.contact || {};
    return {
        buttonDefaultText: contact.copyButton || 'Copiar',
        buttonSuccessText: contact.copiedButton || 'Copiado',
        messages: {
            success: contact.copySuccess || 'Correo copiado al portapapeles.',
            error: contact.copyError || 'No se ha podido copiar el correo.'
        }
    };
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
let currentLocale = null;

function copyEmail(button) {
    const email = 'jordidrgn@gmail.com';
    const feedback = document.querySelector('.copy-email-feedback');
    const language = (document.documentElement.lang || 'es').toLowerCase().slice(0, 2);
    const copyTexts = getCopyEmailTexts(currentLocale);
    const successMessage = copyTexts.messages.success;

    navigator.clipboard.writeText(email).then(() => {
        if (button) {
            button.classList.add('copied');
            button.textContent = copyTexts.buttonSuccessText;
        }

        if (feedback) {
            feedback.textContent = successMessage;
            feedback.classList.add('is-visible');
        }

        window.clearTimeout(window.copyEmailFeedbackTimer);
        window.copyEmailFeedbackTimer = window.setTimeout(() => {
            if (button) {
                button.classList.remove('copied');
                button.textContent = copyTexts.buttonDefaultText;
            }

            if (feedback) {
                feedback.classList.remove('is-visible');
            }
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        if (feedback) {
            feedback.textContent = copyTexts.messages.error;
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
const LOCALES_PATH = 'locales';

function getSavedLanguage() {
    const savedLanguage = localStorage.getItem('language');
    return LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
}

function saveLanguage(lang) {
    localStorage.setItem('language', lang);
}

async function loadLanguageContent(lang) {
    try {
        const file = `${LOCALES_PATH}/${lang}.json`;
        const mainContent = document.getElementById('main-content');

        // Ocultar mientras carga
        mainContent.style.opacity = '0';

        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const locale = await response.json();

        currentLocale = locale;

        applyLocaleText(locale);

        if (locale.navHtml && !locale.nav) {
            const nav = document.querySelector('nav');
            nav.innerHTML = locale.navHtml;
        }

        mainContent.innerHTML = renderLocaleMainContent(locale);
        reinitializeEventListeners();
        updateActiveLangButton(lang);

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
=======
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
>>>>>>> 9d2b804676c626a828966c1e6f3fdc72b95ff6ac
});