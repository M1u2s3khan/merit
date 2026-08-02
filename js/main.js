 document.addEventListener('DOMContentLoaded', function() {

            // ===== PRELOADER =====
            const preloader = document.getElementById('preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 2200);
            }

            // ===== NAVBAR SCROLL EFFECT =====
            const nav = document.getElementById('mainNav');
            if (nav) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 30) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                });
            }

            // ===== HAMBURGER TOGGLE (with animation) =====
            const hamburger = document.getElementById('hamburgerBtn');
            const navMenu = document.getElementById('navMenu');

            if (hamburger && navMenu) {
                hamburger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isOpen = navMenu.classList.contains('show');
                    if (isOpen) {
                        navMenu.classList.remove('show');
                        hamburger.classList.remove('active');
                    } else {
                        navMenu.classList.add('show');
                        hamburger.classList.add('active');
                    }
                });

                // Close menu on link click (mobile)
                document.querySelectorAll('.nav-link-premium, .dropdown-item-premium, .btn-cta-nav')
                    .forEach(function(link) {
                        link.addEventListener('click', function() {
                            if (window.innerWidth < 992) {
                                navMenu.classList.remove('show');
                                hamburger.classList.remove('active');
                            }
                        });
                    });

                // Close menu on outside click (mobile)
                document.addEventListener('click', function(e) {
                    if (window.innerWidth < 992) {
                        const target = e.target;
                        if (!nav.contains(target)) {
                            navMenu.classList.remove('show');
                            hamburger.classList.remove('active');
                        }
                    }
                });
            }

            // ===== MOBILE DROPDOWN TOGGLE (for nested menus) =====
            if (window.innerWidth < 992) {
                document.querySelectorAll('.dropdown-premium > .nav-link-premium').forEach(function(link) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const parent = this.closest('.dropdown-premium');
                        const menu = parent.querySelector('.dropdown-menu-premium');
                        if (menu) {
                            menu.classList.toggle('open');
                            this.classList.toggle('show-dropdown');
                        }
                    });
                });
            }

            // ===== HERO SLIDER =====
            const slides = document.querySelectorAll('.hero-bg-slide');
            const dots = document.querySelectorAll('.h-s-dot');
            let currentSlide = 0;
            let slideInterval;

            function goToSlide(index) {
                slides.forEach(function(s, i) {
                    s.classList.toggle('active', i === index);
                });
                dots.forEach(function(d, i) {
                    d.classList.toggle('active', i === index);
                });
                currentSlide = index;
            }

            function nextSlide() {
                goToSlide((currentSlide + 1) % slides.length);
            }

            if (slides.length > 0) {
                slideInterval = setInterval(nextSlide, 5000);

                dots.forEach(function(dot, idx) {
                    dot.addEventListener('click', function() {
                        clearInterval(slideInterval);
                        goToSlide(idx);
                        slideInterval = setInterval(nextSlide, 5000);
                    });
                });
            }

            // ===== COUNTER ANIMATION =====
            const counters = document.querySelectorAll('.counter');
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseFloat(el.getAttribute('data-target'));
                        if (isNaN(target)) return;
                        const isFloat = target % 1 !== 0;
                        const duration = 2000;
                        const startTime = performance.now();

                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const currentVal = eased * target;
                            if (isFloat) {
                                el.textContent = currentVal.toFixed(1);
                            } else {
                                el.textContent = Math.floor(currentVal);
                            }
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                if (isFloat) {
                                    el.textContent = target.toFixed(1);
                                } else {
                                    el.textContent = target;
                                }
                            }
                        }
                        requestAnimationFrame(updateCounter);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function(c) { observer.observe(c); });

            // ===== PROJECT SLIDER =====
            const track = document.getElementById('projTrack');
            const prevBtn = document.getElementById('projPrev');
            const nextBtn = document.getElementById('projNext');
            const dotsContainer = document.getElementById('projDots');

            if (track && prevBtn && nextBtn && dotsContainer) {
                let currentIndex = 0;
                const cards = track.querySelectorAll('.proj-card');
                const totalCards = cards.length;
                let visibleCount = 3;

                function getVisibleCount() {
                    const w = window.innerWidth;
                    if (w < 576) return 1;
                    if (w < 992) return 2;
                    return 3;
                }

                function updateSlider() {
                    visibleCount = getVisibleCount();
                    const totalVisible = Math.min(visibleCount, totalCards);
                    const cardWidth = cards[0]?.offsetWidth || 0;
                    const gap = 24;
                    const offset = currentIndex * (cardWidth + gap);
                    track.style.transform = 'translateX(-' + offset + 'px)';
                    updateDots();
                }

                function updateDots() {
                    const totalDots = Math.max(1, totalCards - visibleCount + 1);
                    dotsContainer.innerHTML = '';
                    for (let i = 0; i < totalDots; i++) {
                        const dot = document.createElement('button');
                        dot.className = 'proj-dot' + (i === currentIndex ? ' active' : '');
                        dot.setAttribute('data-index', i);
                        dot.addEventListener('click', function() {
                            currentIndex = i;
                            updateSlider();
                        });
                        dotsContainer.appendChild(dot);
                    }
                }

                function nextSlideProj() {
                    const maxIndex = Math.max(0, totalCards - visibleCount);
                    if (currentIndex < maxIndex) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateSlider();
                }

                function prevSlideProj() {
                    const maxIndex = Math.max(0, totalCards - visibleCount);
                    if (currentIndex > 0) {
                        currentIndex--;
                    } else {
                        currentIndex = maxIndex;
                    }
                    updateSlider();
                }

                nextBtn.addEventListener('click', nextSlideProj);
                prevBtn.addEventListener('click', prevSlideProj);

                window.addEventListener('resize', function() {
                    updateSlider();
                });

                // init
                setTimeout(updateSlider, 100);
            }

            // ===== FAQ ACCORDION =====
            document.querySelectorAll('.faq-q').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const parent = this.closest('.faq-item');
                    if (!parent) return;
                    const isActive = parent.classList.contains('active');

                    // close all
                    document.querySelectorAll('.faq-item').forEach(function(item) {
                        item.classList.remove('active');
                    });

                    if (!isActive) {
                        parent.classList.add('active');
                    }
                });
            });

            // ===== BACK TO TOP =====
            const btt = document.getElementById('btt');
            if (btt) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 500) {
                        btt.classList.add('visible');
                    } else {
                        btt.classList.remove('visible');
                    }
                });
                btt.addEventListener('click', function() {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            // ===== TOAST =====
            const toast = document.getElementById('toast');

            // ===== CONTACT FORM =====
            const form = document.getElementById('contactForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(function() {
                            toast.classList.remove('show');
                        }, 5000);
                    }
                    form.reset();
                });
            }

        });

//  about page js start

        document.addEventListener('DOMContentLoaded', function() {

            // ===== PRELOADER =====
            const preloader = document.getElementById('preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 2000);
            }

            // ===== NAVBAR SCROLL EFFECT =====
            const nav = document.getElementById('mainNav');
            if (nav) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 30) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                });
            }

            // ===== HAMBURGER TOGGLE =====
            const hamburger = document.getElementById('hamburgerBtn');
            const navMenu = document.getElementById('navMenu');

            if (hamburger && navMenu) {
                hamburger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const isOpen = navMenu.classList.contains('show');
                    if (isOpen) {
                        navMenu.classList.remove('show');
                        hamburger.classList.remove('active');
                    } else {
                        navMenu.classList.add('show');
                        hamburger.classList.add('active');
                    }
                });

                document.querySelectorAll('.nav-link-premium, .dropdown-item-premium, .btn-cta-nav')
                    .forEach(function(link) {
                        link.addEventListener('click', function() {
                            if (window.innerWidth < 992) {
                                navMenu.classList.remove('show');
                                hamburger.classList.remove('active');
                            }
                        });
                    });

                document.addEventListener('click', function(e) {
                    if (window.innerWidth < 992) {
                        const target = e.target;
                        if (!nav.contains(target)) {
                            navMenu.classList.remove('show');
                            hamburger.classList.remove('active');
                        }
                    }
                });
            }

            // ===== MOBILE DROPDOWN TOGGLE =====
            if (window.innerWidth < 992) {
                document.querySelectorAll('.dropdown-premium > .nav-link-premium').forEach(function(link) {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const parent = this.closest('.dropdown-premium');
                        const menu = parent.querySelector('.dropdown-menu-premium');
                        if (menu) {
                            menu.classList.toggle('open');
                            this.classList.toggle('show-dropdown');
                        }
                    });
                });
            }

            // ===== COUNTER ANIMATION =====
            const counters = document.querySelectorAll('.counter');
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseFloat(el.getAttribute('data-target'));
                        if (isNaN(target)) return;
                        const isFloat = target % 1 !== 0;
                        const duration = 2000;
                        const startTime = performance.now();

                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const currentVal = eased * target;
                            if (isFloat) {
                                el.textContent = currentVal.toFixed(1);
                            } else {
                                el.textContent = Math.floor(currentVal);
                            }
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                if (isFloat) {
                                    el.textContent = target.toFixed(1);
                                } else {
                                    el.textContent = target;
                                }
                            }
                        }
                        requestAnimationFrame(updateCounter);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function(c) { observer.observe(c); });

            // ===== BACK TO TOP =====
            const btt = document.getElementById('btt');
            if (btt) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 500) {
                        btt.classList.add('visible');
                    } else {
                        btt.classList.remove('visible');
                    }
                });
                btt.addEventListener('click', function() {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

        });
   {/* about page js close  */}

        