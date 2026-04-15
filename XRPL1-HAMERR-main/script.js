/* ==================== LOADING SCREEN ==================== */
(function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loaderBar = document.getElementById('loaderBar');
    const loaderPercent = document.getElementById('loaderPercent');

    function setProgress(p) {
        loaderBar.style.width = p + '%';
        loaderPercent.textContent = Math.round(p) + '%';
    }

    function hideLoader() {
        setProgress(100);
        setTimeout(function() {
            loadingScreen.classList.add('hide');
        }, 400);
    }

    // Collect all resources to track
    var resources = performance.getEntriesByType('resource');
    var allImages = Array.from(document.images);

    // Simulate smooth progress + actual load tracking
    var progress = 0;
    var interval = setInterval(function() {
        if (progress < 70) {
            progress += Math.random() * 8;
            setProgress(Math.min(progress, 70));
        }
    }, 150);

    function checkAllImagesLoaded() {
        var imgs = Array.from(document.images);
        var total = imgs.length;
        if (total === 0) return true;
        var loaded = imgs.filter(function(img) { return img.complete; }).length;
        return loaded >= total;
    }

    window.addEventListener('load', function() {
        clearInterval(interval);
        // Animate from current to 100
        var current = progress;
        var fill = setInterval(function() {
            current += 5;
            setProgress(Math.min(current, 100));
            if (current >= 100) {
                clearInterval(fill);
                hideLoader();
            }
        }, 30);
    });

    // Fallback: hide after 8 seconds max
    setTimeout(function() {
        clearInterval(interval);
        hideLoader();
    }, 8000);
})();

/* ==================== LAZY LOADING ==================== */
// Enhanced lazy loading with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Function to handle image loading
    function handleImageLoad(img) {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                this.classList.add('loaded');
                console.log('Image failed to load:', this.src);
            });
        }
    }
    
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    handleImageLoad(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => handleImageLoad(img));
    }

    // Tidak perlu auto-show section saat load — biarkan IntersectionObserver yang handle
    // (Hero section akan otomatis terdeteksi karena langsung visible)
});


/* ==================== PILL NAVBAR ACTIVE LINK ==================== */
(function () {
    const pillNav = document.getElementById('pillNav');
    if (!pillNav) return;

    // Buat sliding indicator element
    const indicator = document.createElement('div');
    indicator.className = 'pill-nav-indicator';
    pillNav.appendChild(indicator);

    const navLinks = pillNav.querySelectorAll('.pill-nav-link');

    // Gerakkan indicator ke link tertentu
    function moveIndicator(link) {
        if (!link) {
            indicator.style.opacity = '0';
            return;
        }
        indicator.style.opacity = '1';
        indicator.style.width  = link.offsetWidth + 'px';
        indicator.style.left   = link.offsetLeft + 'px';
    }

    // Saat link diklik, langsung tampilkan section target
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const targetId = this.getAttribute('href').replace('#', '');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.add('show');
            }
        });
    });

    // Highlight link aktif berdasarkan scroll
    const sections = document.querySelectorAll('section[id], .structure-section[id]');

    function updateActiveLink() {
        const mid = window.innerHeight / 2;
        let current = '';
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            // Section dianggap aktif kalau bagian atasnya sudah melewati tengah layar
            if (rect.top <= mid) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active-link');
            }
        });
        const activeLink = pillNav.querySelector('.pill-nav-link.active-link');
        moveIndicator(activeLink);
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    indicator.style.transition = 'none';
    updateActiveLink();
    requestAnimationFrame(() => {
        indicator.style.transition = '';
    });

    window.addEventListener('resize', () => {
        indicator.style.transition = 'none';
        updateActiveLink();
        requestAnimationFrame(() => { indicator.style.transition = ''; });
    });
})();


/* ==================== SCROLL ANIMATION ==================== */
const sections = document.querySelectorAll("section");

// Saat link navbar diklik, langsung show semua elemen
document.querySelectorAll('.pill-nav-link').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('section').forEach(sec => {
            sec.classList.add('show');
            sec.classList.remove('hide');
        });
        document.querySelectorAll('.card, .footer-col, .glh2, .title, .student-card, .ot-node').forEach(el => {
            el.classList.add('show');
            el.classList.remove('hide');
        });
    });
});

// ---- OBSERVER UNTUK SECTION ----
// Gallery (#gallery) dikecualikan dari opacity animation karena slider-nya
// sudah punya opacity sendiri per-slide. Hanya non-gallery sections.
const nonGallerySections = document.querySelectorAll("section:not(#gallery)");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            entry.target.classList.remove("hide");
        } else {
            entry.target.classList.remove("show");
            entry.target.classList.add("hide");
        }
    });
}, { threshold: 0.05 });

nonGallerySections.forEach(sec => observer.observe(sec));

// Gallery section selalu terlihat (opacity diatur oleh CSS .show saja)
const gallerySection = document.querySelector("#gallery");
if (gallerySection) {
    const galleryVisObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gallerySection.classList.add("show");
                gallerySection.classList.remove("hide");
            } else {
                gallerySection.classList.remove("show");
                gallerySection.classList.add("hide");
            }
        });
    }, { threshold: 0.05 });
    galleryVisObserver.observe(gallerySection);
}

// ---- OBSERVER UNTUK ELEMEN INDIVIDUAL ----
const animateElements = document.querySelectorAll('.card, .footer-col, .glh2, .title, .student-card, .ot-node');

const elementObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            entry.target.classList.remove("hide");
        } else {
            entry.target.classList.remove("show");
            entry.target.classList.add("hide");
        }
    });
}, { threshold: 0.08 });

animateElements.forEach(el => elementObserver.observe(el));


/* ==================== STRUCTURE / PIKET TAB SWITCHER ==================== */
(function () {
    const switchBtns = document.querySelectorAll('.tab-switch-btn');
    const panels     = document.querySelectorAll('.tab-panel');
    const indicator  = document.querySelector('.tab-switch-indicator');

    function moveIndicator(btn) {
        if (!indicator || !btn) return;
        indicator.style.width  = btn.offsetWidth + 'px';
        indicator.style.left   = btn.offsetLeft + 'px';
    }

    function activateTab(targetTab) {
        switchBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.tab-switch-btn[data-tab="${targetTab}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        moveIndicator(activeBtn);

        panels.forEach(panel => {
            if (panel.id === 'tab-' + targetTab) {
                panel.classList.add('animating');
                panel.offsetHeight;
                panel.classList.add('active');
                setTimeout(() => panel.classList.remove('animating'), 400);
            } else {
                panel.classList.remove('active', 'animating');
            }
        });
    }

    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });

    window.addEventListener('load', () => {
        const activeBtn = document.querySelector('.tab-switch-btn.active');
        moveIndicator(activeBtn);
    });

    window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.tab-switch-btn.active');
        moveIndicator(activeBtn);
    });
})();


/* ==================== SCHEDULE & PIKET HARIAN ==================== */
(function () {

    const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const schedules = {
        0: [ // Senin
            { subject: 'IPAS',  time: '1' },
            { subject: 'IPAS',  time: '2' },
            { subject: 'IPAS',  time: '3' },
            { subject: 'IPAS',  time: '4' },
            { subject: 'DDP3',  time: '5' },
            { subject: 'DDP3',  time: '6' },
            { subject: 'DDP3',  time: '7' },
            { subject: 'DDP3',  time: '8' },
        ],
        1: [ // Selasa
            { subject: 'BINA',          time: '1' },
            { subject: 'BINA',          time: '2' },
            { subject: 'BINA',          time: '3' },
            { subject: 'BINA',          time: '4' },
            { subject: 'BP BK',         time: '5' },
            { subject: 'Bahasa Jepang', time: '6' },
            { subject: 'BING',          time: '7' },
            { subject: 'BING',          time: '8' },
            { subject: 'BING',          time: '9' },
            { subject: 'BING',          time: '10' },
        ],
        2: [ // Rabu
            { subject: 'Informatika',     time: '1' },
            { subject: 'Informatika',     time: '2' },
            { subject: 'Informatika',     time: '3' },
            { subject: 'Informatika',     time: '4' },
            { subject: 'IPAS',            time: '5' },
            { subject: 'IPAS',            time: '6' },
            { subject: 'Mulok Produktif', time: '7' },
            { subject: 'Mulok Produktif', time: '8' },
        ],
        3: [ // Kamis
            { subject: 'Penjas Orkes', time: '1' },
            { subject: 'Penjas Orkes', time: '2' },
            { subject: 'Penjas Orkes', time: '3' },
            { subject: 'Seni Budaya',  time: '4' },
            { subject: 'Seni Budaya',  time: '5' },
            { subject: 'Matematika',   time: '6' },
            { subject: 'Matematika',   time: '7' },
            { subject: 'Matematika',   time: '8' },
            { subject: 'Matematika',   time: '9' },
            { subject: 'PGRI',         time: '10' },
        ],
        4: [ // Jumat
            { subject: 'DDP2', time: '1' },
            { subject: 'DDP2', time: '2' },
            { subject: 'DDP2', time: '3' },
            { subject: 'DDP2', time: '4' },
            { subject: 'DDP1', time: '5' },
            { subject: 'DDP1', time: '6' },
            { subject: 'DDP1', time: '7' },
            { subject: 'DDP1', time: '8' },
        ],
        5: [ // Sabtu
            { subject: 'PPKN',       time: '1' },
            { subject: 'PPKN',       time: '2' },
            { subject: 'Bahasa Jawa', time: '4' },
            { subject: 'PABP',       time: '5' },
            { subject: 'PABP',       time: '6' },
            { subject: 'PABP',       time: '7' },
            { subject: 'Sejarah',    time: '9' },
            { subject: 'Sejarah',    time: '10' },
        ],
    };

    const piketData = {
        0: [ // Senin
            { name: 'Helsa Tanaya' },
            { name: 'Firiyal Anggaraputra' },
            { name: 'Choiruliza Firdausyfa' },
            { name: 'Ardan Elistyan' },
            { name: 'Ibnu Abi Zakaria' },
            { name: 'Bunga Cinta Awalida' },
        ],
        1: [ // Selasa
            { name: 'Clara Meyvita Syahrani' },
            { name: 'Anindita Nafisah Farras' },
            { name: 'Alatha Barnet Yusad' },
            { name: 'Anif Fakturesa Ravael' },
            { name: 'Alicea Syamsa Atta' },
            { name: 'Dinda Intan Alfaiz' },
        ],
        2: [ // Rabu
            { name: 'Jasmine Assel Arditania' },
            { name: 'Ahmad Nouval Alvino' },
            { name: 'Hanif Akbar' },
            { name: 'Aura Cahaya Fernanda' },
            { name: 'Hilda Tri Ananta' },
            { name: 'Dhini Mareytha Amire' },
        ],
        3: [ // Kamis
            { name: 'Cheryl Lista Feby Erviana' },
            { name: 'Christian Pramudyo Adi' },
            { name: 'Nefi Aeka Maharani' },
            { name: 'Dela Permata Ayuni Indah' },
            { name: 'Halimatus Sa\'adah' },
            { name: 'Andika Febrianto' },
        ],
        4: [ // Jumat
            { name: 'Atta Alfarizi' },
            { name: 'Eliza Ayu Alfabeth' },
            { name: 'Anevali Redya Viola' },
            { name: 'Fikri Eka Widyadhana' },
            { name: 'Havana Ega Rianto' },
            { name: 'Fadani Trisna Diaby' },
        ],
        5: [ // Sabtu
            { name: 'Faridatul Maysaroh', crossed: true },
            { name: 'Agustina Pratiwi' },
            { name: 'Dony Dwi Ristanto' },
            { name: 'Christian Maulana Al' },
            { name: 'Avelya Maulidia Zahra' },
            { name: 'Alena Fressilia' },
        ],
    };

    const titleEl   = document.getElementById('scheduleDayTitle');
    const schedBody = document.getElementById('scheduleBody');
    const piketBody = document.getElementById('piketBody');

    if (!titleEl || !schedBody || !piketBody) return;

    function getTodayIndex() {
        // Paksa timezone WIB (UTC+7)
        const wib = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const jsDay = wib.getDay(); // 0=Min,1=Sen,2=Sel,3=Rab,4=Kam,5=Jum,6=Sab
        const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
        return map[jsDay]; // 6 = Minggu (libur)
    }

    function renderToday() {
        const dayIdx = getTodayIndex();

        // Hari Minggu = libur
        if (dayIdx === 6) {
            titleEl.textContent = 'Minggu';
            schedBody.innerHTML = `<tr><td colspan="2" class="libur-row">🎉 Libur</td></tr>`;
            piketBody.innerHTML = `<tr><td class="libur-row">—</td></tr>`;
            return;
        }

        titleEl.textContent = dayNames[dayIdx];

        // Gabungkan pelajaran yang sama berurutan
        const sched = schedules[dayIdx] || [];
        const grouped = [];
        sched.forEach(row => {
            const last = grouped[grouped.length - 1];
            if (last && last.subject === row.subject && !row.rest) {
                last.timeTo = row.time;
            } else {
                grouped.push({ ...row, timeFrom: row.time, timeTo: row.time });
            }
        });
        schedBody.innerHTML = grouped.map(row => {
            const jamLabel = row.rest ? row.time
                : row.timeFrom === row.timeTo ? `Jam ${row.timeFrom}`
                : `Jam ${row.timeFrom}–${row.timeTo}`;
            return `<tr class="${row.rest ? 'istirahat-row' : ''}">
                <td>${row.subject}</td>
                <td>${jamLabel}</td>
            </tr>`;
        }).join('');

        const piket = piketData[dayIdx] || [];
        piketBody.innerHTML = piket.map(item =>
            `<tr><td><span class="${item.crossed ? 'piket-crossed' : ''}">${item.name}</span></td></tr>`
        ).join('');
    }

    // Tampilkan hari ini saat load
    renderToday();

    // Auto refresh rekursif setiap tengah malam
    function scheduleMidnightRefresh() {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
        const msUntil = midnight - now;
        setTimeout(() => {
            renderToday();
            scheduleMidnightRefresh();
        }, msUntil);
    }

    scheduleMidnightRefresh();

})();


/* ==================== TABS ==================== */
const buttons = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById("tab" + btn.dataset.tab).classList.add("active");
    });
});


/* ==================== STUDENTS SECTION ==================== */
const studentsContainer = document.querySelector('.students-container');
const studentsWrapper = document.querySelector('.students-wrapper');
const studentsDotsContainer = document.getElementById('studentsDots');

if (studentsContainer && studentsWrapper) {
    const originalCards = Array.from(studentsWrapper.querySelectorAll('.student-card'));
    const totalStudents = originalCards.length;
    const cardsPerPage = 5;
    const totalPages = Math.ceil(totalStudents / cardsPerPage);
    let currentPage = 0;
    let autoScrollInterval;
    let isUserInteracting = false;
    let isJumping = false;

    // ── Clone cards untuk infinite loop ──
    // Clone set sebelum dan sesudah
    const clonesBefore = originalCards.map(c => {
        const cl = c.cloneNode(true);
        cl.setAttribute('aria-hidden', 'true');
        return cl;
    });
    const clonesAfter = originalCards.map(c => {
        const cl = c.cloneNode(true);
        cl.setAttribute('aria-hidden', 'true');
        return cl;
    });

    clonesBefore.reverse().forEach(cl => studentsWrapper.prepend(cl));
    clonesAfter.forEach(cl => studentsWrapper.append(cl));

    // Hitung lebar per card (termasuk gap)
    function getCardWidth() {
        const card = studentsWrapper.querySelector('.student-card');
        if (!card) return 200;
        const gap = parseFloat(getComputedStyle(studentsWrapper).gap) || 20;
        return card.offsetWidth + gap;
    }

    // Posisi scroll awal = offsetLeft card pertama dari set asli (setelah clone kiri)
    function getOriginalStart() {
        const allCards = studentsWrapper.querySelectorAll('.student-card');
        const firstOriginal = allCards[totalStudents];
        if (firstOriginal) return firstOriginal.offsetLeft;
        const paddingLeft = parseFloat(getComputedStyle(studentsWrapper).paddingLeft) || 0;
        return getCardWidth() * totalStudents + paddingLeft;
    }

    // Posisi scroll akhir = offsetLeft card pertama dari clone kanan
    function getOriginalEnd() {
        const allCards = studentsWrapper.querySelectorAll('.student-card');
        const firstCloneAfter = allCards[totalStudents * 2];
        if (firstCloneAfter) return firstCloneAfter.offsetLeft;
        return getOriginalStart() + getCardWidth() * totalStudents;
    }

    // Jump tanpa animasi ke posisi tertentu
    function jumpToPosition(pos) {
        isJumping = true;
        studentsContainer.style.scrollBehavior = 'auto';
        studentsContainer.scrollLeft = pos;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                studentsContainer.style.scrollBehavior = '';
                isJumping = false;
            });
        });
    }

    // Set posisi awal ke cards asli
    function init() {
        jumpToPosition(getOriginalStart());
    }
    init();

    // ── Dots ──
    function createDots() {
        if (!studentsDotsContainer) return;
        studentsDotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => scrollToPage(i));
            studentsDotsContainer.appendChild(dot);
        }
    }

    function updateActiveDot() {
        if (!studentsDotsContainer) return;
        const dots = studentsDotsContainer.querySelectorAll('.dot');
        const page = ((currentPage % totalPages) + totalPages) % totalPages;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === page));
    }

    function scrollToPage(pageIndex) {
        currentPage = pageIndex;
        const cardWidth = getCardWidth();
        const targetScroll = getOriginalStart() + cardWidth * cardsPerPage * pageIndex;
        studentsContainer.style.scrollBehavior = 'smooth';
        studentsContainer.scrollLeft = targetScroll;
        updateActiveDot();
    }

    // ── Auto scroll ──
    function startAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            if (!isUserInteracting && !isJumping) {
                studentsContainer.style.scrollBehavior = 'smooth';
                studentsContainer.scrollLeft += getCardWidth() * cardsPerPage;
            }
        }, 3000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }

    // ── Infinite loop detection saat scroll ──
    studentsContainer.addEventListener('scroll', () => {
        if (isJumping) return;

        const scrollLeft = studentsContainer.scrollLeft;
        const cardWidth = getCardWidth();
        const origStart = getOriginalStart();
        const origEnd = getOriginalEnd();

        // Melewati batas kanan clone → lompat ke kiri
        if (scrollLeft >= origEnd) {
            jumpToPosition(origStart + (scrollLeft - origEnd));
        }
        // Melewati batas kiri clone → lompat ke kanan
        if (scrollLeft < origStart - cardWidth) {
            jumpToPosition(origEnd - (origStart - scrollLeft));
        }

        // Update dots
        const relativeScroll = scrollLeft - origStart;
        const page = Math.round(relativeScroll / (cardWidth * cardsPerPage));
        const normalPage = ((page % totalPages) + totalPages) % totalPages;
        if (normalPage !== currentPage) {
            currentPage = normalPage;
            updateActiveDot();
        }
    });

    // ── Drag scroll dengan mouse ──
    let isDragging = false;
    let startX, scrollLeftStart;
    let clickStartTime, clickStartX;
    let velocity = 0, lastX = 0, lastTime = 0;

    studentsContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        isUserInteracting = true;
        studentsContainer.classList.add('grabbing');
        studentsContainer.style.scrollBehavior = 'auto';
        startX = e.pageX - studentsContainer.offsetLeft;
        scrollLeftStart = studentsContainer.scrollLeft;
        clickStartTime = Date.now();
        clickStartX = e.pageX;
        lastX = e.pageX;
        lastTime = Date.now();
        velocity = 0;
        stopAutoScroll();
        e.preventDefault();
    });

    studentsContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - studentsContainer.offsetLeft;
        studentsContainer.scrollLeft = scrollLeftStart - (x - startX) * 1.5;
        const now = Date.now();
        if (now - lastTime > 0) velocity = (e.pageX - lastX) / (now - lastTime);
        lastX = e.pageX;
        lastTime = now;
    });

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        studentsContainer.classList.remove('grabbing');

        const clickDuration = Date.now() - clickStartTime;
        const clickDistance = Math.abs((e.pageX ?? clickStartX) - clickStartX);
        if (clickDuration < 200 && clickDistance < 5) return;

        // Momentum
        if (Math.abs(velocity) > 0.5) {
            let mv = velocity * 12;
            const decel = 0.94;
            function step() {
                if (Math.abs(mv) > 0.5) {
                    studentsContainer.scrollLeft -= mv;
                    mv *= decel;
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        }

        setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 800);
    }

    studentsContainer.addEventListener('mouseup', endDrag);
    studentsContainer.addEventListener('mouseleave', (e) => endDrag(e));

    // ── Touch scroll ──
    let touchStartX = 0, touchScrollLeft = 0;
    let touchVelocity = 0, lastTouchX = 0, lastTouchTime = 0;

    studentsContainer.addEventListener('touchstart', (e) => {
        isUserInteracting = true;
        studentsContainer.style.scrollBehavior = 'auto';
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = studentsContainer.scrollLeft;
        lastTouchX = e.touches[0].pageX;
        lastTouchTime = Date.now();
        touchVelocity = 0;
        stopAutoScroll();
    }, { passive: true });

    studentsContainer.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        studentsContainer.scrollLeft = touchScrollLeft - (touchX - touchStartX);
        const now = Date.now();
        if (now - lastTouchTime > 0) touchVelocity = (touchX - lastTouchX) / (now - lastTouchTime);
        lastTouchX = touchX;
        lastTouchTime = now;
    }, { passive: true });

    studentsContainer.addEventListener('touchend', () => {
        if (Math.abs(touchVelocity) > 0.5) {
            let mv = touchVelocity * 12;
            const decel = 0.93;
            function touchStep() {
                if (Math.abs(mv) > 0.5) {
                    studentsContainer.scrollLeft -= mv;
                    mv *= decel;
                    requestAnimationFrame(touchStep);
                }
            }
            requestAnimationFrame(touchStep);
        }
        setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 800);
    }, { passive: true });

    // ── Modal ──
    const studentModal = document.querySelector('.student-modal');
    const studentModalImg = document.querySelector('.student-modal-box img');
    const studentModalName = document.querySelector('.student-modal-name');
    const studentCloseBtn = document.querySelector('.student-close');

    const studentImages = {
       '1': 'image/RPL 1_3X4/RPL 1-AGUSTINA PRATIWI.webp',
'2': 'image/RPL 1_3X4/RPL 1-AHMAD NOUVAL ALVINO.webp',
'3': 'image/RPL 1_3X4/RPL 1-ALATHA BARNET YUSAD PERMANA.webp',
'4': 'image/RPL 1_3X4/RPL 1-ALENA FRESSILIA.webp',
'5': 'image/RPL 1_3X4/RPL 1-ALICEA SYAMSA ATTA BELLATRIX.webp',
'6': 'image/RPL 1_3X4/RPL 1-ANDIKA FEBRIANTO.webp',
'7': 'image/RPL 1_3X4/RPL 1-ANEVALI REDYA VIOLA.webp',
'8': 'image/RPL 1_3X4/RPL 1-ANIF FAKTURESA RAVAEL.webp',
'9': 'image/RPL 1_3X4/RPL 1-ANINDITA NAFISAH FARRAS PUTRI.webp',
'10': 'image/RPL 1_3X4/RPL 1-ARDAN ELISTYAN.webp',
'11': 'image/RPL 1_3X4/RPL 1-ATTA ALFARIZI.webp',
'12': 'image/RPL 1_3X4/RPL 1-AURA CAHAYA FERNANDA.webp',
'13': 'image/RPL 1_3X4/RPL 1-AVELYA MAULIDIA ZAHRA.webp',
'14': 'image/RPL 1_3X4/RPL 1-BUNGA CINTA AWALIDA.webp',
'15': 'image/RPL 1_3X4/RPL 1-CHERYL LISTA FEBY ERVIANA.webp',
'16': 'image/RPL 1_3X4/RPL 1-CHOIRULIZA FIRDAUSYFA.webp',
'17': 'image/RPL 1_3X4/RPL 1-CHRISTIAN MAULANA AL HAQIQI.webp',
'18': 'image/RPL 1_3X4/RPL 1-CHRISTIAN PRAMUDYO ADI PRABOWO.webp',
'19': 'image/RPL 1_3X4/RPL 1-CLARA MEYVITA SYAHRANI.webp',
'20': 'image/RPL 1_3X4/RPL 1-DHINI MAREYTHA AMIRE.webp',
'21': 'image/RPL 1_3X4/RPL 1-DINDA INTAN ALFAIZ.webp',
'22': 'image/RPL 1_3X4/RPL 1-DONY DWI RISTANTO.webp',
'23': 'image/RPL 1_3X4/RPL 1-ELIZA AYU ALFABETH.webp',
'24': 'image/RPL 1_3X4/RPL 1-FADANI TRISNA DIABY.webp',
'25': 'image/RPL 1_3X4/RPL 1-FIKRI EKA WIDYADHANA.webp',
'26': 'image/RPL 1_3X4/RPL 1-FIRIYAL ANGGARAPUTRA.webp',
'27': 'image/RPL 1_3X4/RPL 1-HALIMATUS SA\'ADAH.webp',
'28': 'image/RPL 1_3X4/RPL 1-HANIF AKBAR KUSUMANDYOKO.webp',
'29': 'image/RPL 1_3X4/RPL 1-HAVANA EGA RIANTO.webp',
'30': 'image/RPL 1_3X4/RPL 1-HELSA TANAYA.webp',
'31': 'image/RPL 1_3X4/RPL 1-HILDA TRI ANANTA.webp',
'32': 'image/RPL 1_3X4/RPL 1-IBNU ABI ZAKARIA.webp',
'33': 'image/RPL 1_3X4/RPL 1-JASMINE ASSEL ARDITANIA.webp',
'34': 'image/RPL 1_3X4/RPL 1-NEFI AEKA MAHARANI.webp',
    };

    // Hanya original cards yang bisa buka modal
    originalCards.forEach(card => {
        card.addEventListener('click', function () {
            if (isDragging) return;
            const studentId = this.dataset.student;
            const studentName = this.querySelector('.student-name').textContent;
            const studentImg = studentImages[studentId] || 'image/logo.jpeg';

            studentModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // ✅ FIX: Reset gambar dulu sebelum set yang baru
            studentModalImg.classList.remove('loaded');
            studentModalImg.src = '';

            setTimeout(() => {
                studentModal.classList.add('active');
                studentModalImg.src = studentImg;
                studentModalName.textContent = studentName;
            }, 10);
            stopAutoScroll();
        });
    });

    // ✅ FIX: Tambah event onload untuk student modal image
    if (studentModalImg) {
        studentModalImg.onload = () => studentModalImg.classList.add('loaded');
        studentModalImg.onerror = () => studentModalImg.classList.add('loaded');
    }

    function closeStudentModal() {
        studentModal.classList.remove('active');
        setTimeout(() => {
            studentModal.style.display = 'none';
            document.body.style.overflow = '';
            // ✅ FIX: Reset gambar dan class loaded saat modal ditutup
            studentModalImg.classList.remove('loaded');
            studentModalImg.src = '';
        }, 500);
        setTimeout(() => {
            if (!isUserInteracting) startAutoScroll();
        }, 600);
    }

    studentCloseBtn?.addEventListener('click', closeStudentModal);
    studentModal?.addEventListener('click', (e) => {
        if (e.target === studentModal) closeStudentModal();
    });
    document.querySelector('.student-modal-box')?.addEventListener('click', e => e.stopPropagation());
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && studentModal?.classList.contains('active')) closeStudentModal();
    });

    // Init
    createDots();
    startAutoScroll();
}


/* ==================== GALLERY SLIDER ==================== */
// Inisialisasi Variabel
const slidesWrap = document.getElementById("slides");
const allSlides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

let currentIndex = 0;
const totalSlides = allSlides.length;

// ✅ FIX: Tambah event onload untuk lightbox image
if (lightboxImg) {
    lightboxImg.onload = () => lightboxImg.classList.add('loaded');
    lightboxImg.onerror = () => lightboxImg.classList.add('loaded');
}

// Update Gallery Display (Left-Right Navigation)
function updateGallery() {
    allSlides.forEach((slide, i) => {
        slide.classList.remove("active", "prev-slide", "next-slide");
        
        if (i === currentIndex) {
            slide.classList.add("active");
        } else if (i === (currentIndex - 1 + totalSlides) % totalSlides) {
            slide.classList.add("prev-slide");
        } else if (i === (currentIndex + 1) % totalSlides) {
            slide.classList.add("next-slide");
        }
    });

    updateDots();
}

// Create and Update Dots
function updateDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === currentIndex) dot.classList.add("active");
        dot.onclick = () => { 
            currentIndex = i; 
            updateGallery(); 
        };
        dotsContainer.appendChild(dot);
    }
}

// Slide Click Handler
allSlides.forEach((slide) => {
    slide.addEventListener("click", function(e) {
        const img = this.querySelector("img");
        if (!img) return; // safety check
        
        // If clicked slide is not active, navigate to it
        if (!this.classList.contains('active')) {
            currentIndex = Array.from(allSlides).indexOf(this);
            updateGallery();
            startAutoplay();
            return;
        }
        
        // ✅ FIX: Reset gambar lightbox dulu sebelum set src baru
        lightboxImg.classList.remove('loaded');
        lightboxImg.src = '';
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // disable scroll
        stopAutoplay();
    });
});


/* ==================== LIGHTBOX ==================== */
// Close Lightbox when clicking overlay (not image)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        // ✅ FIX: Reset gambar saat lightbox ditutup
        lightboxImg.classList.remove('loaded');
        lightboxImg.src = '';
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // restore scroll
        startAutoplay();
    }
});

// Prevent closing when clicking image
lightboxImg.addEventListener('click', (e) => e.stopPropagation());

// Close with Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        // ✅ FIX: Reset gambar saat ditutup dengan Escape
        lightboxImg.classList.remove('loaded');
        lightboxImg.src = '';
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        startAutoplay();
    }
});


/* ==================== SWIPE/DRAG LOGIC ==================== */
let startX = 0;
let startY = 0;
let isDragging = false;
let isHorizontalSwipe = null; // null = belum ditentukan, true = horizontal, false = vertical

slidesWrap.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    isHorizontalSwipe = null; // reset setiap kali mulai touch baru
});

window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const diffX = startX - e.clientX;
    const diffY = startY - e.clientY;

    // Tentukan arah swipe pertama kali saat sudah bergerak cukup
    if (isHorizontalSwipe === null && (Math.abs(diffX) > 8 || Math.abs(diffY) > 8)) {
        isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    }

    // Hanya proses kalau ini swipe horizontal
    if (isHorizontalSwipe === true && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            currentIndex = (currentIndex + 1) % totalSlides;
        } else {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }
        updateGallery();
        isDragging = false;
        isHorizontalSwipe = null;
    }
}, { passive: true });

window.addEventListener('pointerup', () => {
    isDragging = false;
    isHorizontalSwipe = null;
});


/* ==================== AUTOPLAY ==================== */
let autoplayInterval = null;

function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateGallery();
    }, 3000);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

// Pause autoplay on user interaction
slidesWrap.addEventListener('pointerdown', () => stopAutoplay());
slidesWrap.addEventListener('pointerup', () => { startAutoplay(); });
slidesWrap.addEventListener('mouseenter', () => stopAutoplay());
slidesWrap.addEventListener('mouseleave', () => startAutoplay());

// Initialize gallery
updateGallery();
startAutoplay();


/* ==================== STRUCTURE MODAL ==================== */
const cards = document.querySelectorAll(".card");
const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modal img");
const modalName = document.querySelector(".modal-name");
const modalRole = document.querySelector(".modal-role");
const closeBtn = document.querySelector(".close");

// ✅ FIX: Tambah event onload untuk structure modal image
if (modalImg) {
    modalImg.onload = () => modalImg.classList.add('loaded');
    modalImg.onerror = () => modalImg.classList.add('loaded');
}

cards.forEach(card => {
    card.addEventListener("click", () => {
        const imgSrc = card.dataset.img;
        const roleTxt = card.dataset.role || '';
        const nameTxt = card.querySelector(".name") ? card.querySelector(".name").textContent : '';

        // ✅ FIX: Reset gambar dan class loaded sebelum set src baru
        modalImg.classList.remove('loaded');
        modalImg.src = '';
        modalImg.src = imgSrc;

        modalName.textContent = nameTxt;
        modalRole.textContent = roleTxt;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

// Close button
closeBtn.onclick = () => {
    modal.classList.remove("active");
    // ✅ FIX: Reset gambar saat modal ditutup
    modalImg.classList.remove('loaded');
    modalImg.src = '';
    document.body.style.overflow = ""; // restore scroll
};

// Close when clicking overlay (not the modal box or image)
modal.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
        // ✅ FIX: Reset gambar saat modal ditutup
        modalImg.classList.remove('loaded');
        modalImg.src = '';
        document.body.style.overflow = "";
    }
};

// Close with Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        // ✅ FIX: Reset gambar saat ditutup dengan Escape
        modalImg.classList.remove('loaded');
        modalImg.src = '';
        document.body.style.overflow = '';
    }
});

// Prevent closing when clicking modal content
document.querySelector('.modal-box').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Prevent closing when clicking image
modalImg.addEventListener('click', (e) => {
    e.stopPropagation();
});
