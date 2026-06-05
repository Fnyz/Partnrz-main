'use strict';


// ── Background Images ─────────────────────────────────────────────────────────

function initBgImages() {
    $('.pzBg[data-bg]').each(function () {
        $(this).css('background-image', 'url(' + $(this).data('bg') + ')');
    });
}

// ── Slideshow ─────────────────────────────────────────────────────────────────

function initSlideshow() {
    if (!$('.pzSlideshowWrap').length) return;
    var ms = new Swiper('.pzSlideshowWrap .swiper-container', {
        preloadImages: false,
        loop: true,
        speed: 1400,
        spaceBetween: 0,
        effect: 'fade',
        init: false,
        autoplay: { delay: 2500, disableOnInteraction: false },
        pagination: { el: '.pzCardCarouselDots', clickable: true }
    });
    setTimeout(function () { ms.init(); }, 2000);
}

// ── Stat Counters ─────────────────────────────────────────────────────────────

function initStats() {
    var items = document.querySelectorAll('.stats');
    if (!items.length) return;
    var obs = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            var el = entry.target.querySelector('.pzNum');
            if (!el) return;
            var target = parseInt(el.getAttribute('data-num') || '0', 10);
            var start  = performance.now();
            (function tick(now) {
                var t = Math.min((now - start) / 800, 1);
                el.textContent = Math.round(t * target);
                if (t < 1) requestAnimationFrame(tick);
            }(performance.now()));
        });
    }, { threshold: 0 });
    Array.prototype.slice.call(items).forEach(function (el) { obs.observe(el); });
}

// ── Section Counter & Scroll Nav ─────────────────────────────────────────────

function initScrollNav() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('section.pzScrollSec'));
    var totalEl  = document.querySelector('.scTotal');
    if (totalEl) totalEl.textContent = '0' + sections.length;

    var navWrap = document.querySelector('.pzScrollNavWrap');
    if (!navWrap || !sections.length) return;

    navWrap.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        e.preventDefault();
        var target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });

    var links = Array.prototype.slice.call(navWrap.querySelectorAll('a[href^="#"]'));
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = '#' + entry.target.id;
            links.forEach(function (a) {
                a.classList.toggle('pzActSec', a.getAttribute('href') === id);
            });
        });
    }, { threshold: 0.5 });
    sections.forEach(function (sec) { obs.observe(sec); });
}

// ── Custom Scroll Links ───────────────────────────────────────────────────────

function initCustomScrollLinks() {
    $('.custom-scroll-link').on('click', function (e) {
        if (location.pathname.replace(/^\//, '') !== this.pathname.replace(/^\//, '') &&
            location.hostname !== this.hostname) return;
        e.preventDefault();
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (!target.length) return;
        target[0].scrollIntoView({ behavior: 'smooth' });
    });
}

// ── To-Top Button ─────────────────────────────────────────────────────────────

function initToTop() {
    $('.pzTotop').on('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function initProgressBar() {
    var bar = $('.pzJsProgress');
    if (!bar.length) return;
    $(window).on('scroll.progress', function () {
        var docH     = $(document).height();
        var winH     = $(window).height();
        var scrolled = $(window).scrollTop() / (docH - winH) * 100;
        bar.css('stroke-dashoffset', 100 - scrolled);
    });
}

// ── Dynamic Element Sizing ────────────────────────────────────────────────────

function sizeElements() {
    $('.pzMsItem').css({ height: window.innerHeight - 80 });
}

// ── Mobile Filter Toggle ──────────────────────────────────────────────────────

function initMobileFilter() {
    $('.pzActFilter').on('click', function () {
        $('.initHiddenFilter').slideToggle(300);
        return false;
    });
    $('.pzScrollNavWrap ul li a').on('click', function () {
        if ($(window).width() < 565) {
            $('.initHiddenFilter').delay(600).slideUp(300);
        }
    });
}

// ── Navigation Menu ───────────────────────────────────────────────────────────

function initMenu() {
    var nbw  = $('.pzNavButton'),
        nh   = $('.pzNavHolder'),
        nhw  = $('.pzNavHolderWrap'),
        nho  = $('.pzNavOverlay'),
        nhl  = $('.pzNavHolderLine'),
        nnvw = $('nav.pzNavInner'),
        nfw  = $('.pzNavFooter'),
        nhwd = $('.pzNavHolderDec');

    function showMenu() {
        nh.addClass('nhVis');
        nho.fadeIn(500);
        TweenMax.to(nhwd, 0.6, { force3D: true, left: 0,    ease: Expo.easeInOut });
        TweenMax.to(nfw,  0.6, { force3D: true, bottom: 0,  delay: 0.3, ease: Expo.easeInOut });
        TweenMax.to(nhl,  1.2, { force3D: true, top: 0,     delay: 0.3, ease: Expo.easeInOut });
        TweenMax.to(nnvw, 0.8, { force3D: true, opacity: 1, x: 0, delay: 0.6, ease: Expo.easeInOut });
        nhw.removeClass('pzBtnWrap');
        nbw.addClass('cmenu');
    }

    function hideMenu() {
        TweenMax.to(nhl, 0.3, {
            force3D: true, top: '100%', ease: Expo.easeInOut,
            onComplete: function () {
                TweenMax.to(nfw,  0.2, { force3D: true, bottom: '-70px', ease: Expo.easeInOut });
                TweenMax.to(nnvw, 0.4, {
                    force3D: true, opacity: 0, x: '50px', ease: Expo.easeInOut,
                    onComplete: function () {
                        TweenMax.to(nhwd, 0.4, { force3D: true, left: '100%', ease: Expo.easeInOut });
                        nh.removeClass('nhVis');
                        nho.fadeOut(500);
                    }
                });
            }
        });
        nhw.addClass('pzBtnWrap');
        nbw.removeClass('cmenu');
    }

    nbw.on('click', function () {
        nhw.hasClass('pzBtnWrap') ? showMenu() : hideMenu();
    });
    nho.on('click', hideMenu);
}

// ── Share Panel ───────────────────────────────────────────────────────────────

function initSharePanel() {
    var swra  = $('.pzSharePanel'),
        clsh  = $('.pzShareClose'),
        ssbtn = $('.pzShowshare');

    function showShare() {
        ssbtn.addClass('pzShareUncl');
        $('.pzShareContainer').removeClass('pzIsShare');
        TweenMax.to(swra, 0.6, {
            force3D: false, width: '225px', ease: Expo.easeInOut,
            onComplete: function () {
                TweenMax.to(clsh, 0.4, { force3D: true, right: '0' });
                $('.pzShareIcon').each(function (i) {
                    var icon = $(this);
                    setTimeout(function () {
                        TweenMax.to(icon, 1.0, { force3D: false, opacity: 1 });
                    }, 130 * i);
                });
            }
        });
    }

    function hideShare() {
        ssbtn.removeClass('pzShareUncl');
        $('.pzShareContainer').addClass('pzIsShare');
        TweenMax.to($('.pzShareIcon'), 1.0, { force3D: false, opacity: 0 });
        TweenMax.to(clsh, 0.4, {
            force3D: true, right: '-75px',
            onComplete: function () {
                TweenMax.to(swra, 0.6, { force3D: false, delay: 0.2, width: '0', ease: Expo.easeInOut });
            }
        });
    }

    clsh.on('click', hideShare);
    ssbtn.on('click', function () {
        $('.pzShareContainer').hasClass('pzIsShare') ? showShare() : hideShare();
    });
}

// ── Main Per-Page Init ────────────────────────────────────────────────────────

function initPartnrz() {
    initBgImages();
    initSlideshow();
    initStats();
    initScrollNav();
    initCustomScrollLinks();
    initToTop();
    initProgressBar();
    sizeElements();
    initMobileFilter();
    initMenu();
    initSharePanel();
}

// ── Custom Cursor (runs once) ─────────────────────────────────────────────────

if ($('.pzCursorItem').length) {
    var mouse = { x: 0, y: 0 };
    var pos   = { x: 0, y: 0 };
    var ball  = document.querySelector('.pzCursorItem');

    TweenLite.set(ball, { xPercent: -50, yPercent: -50 });

    document.addEventListener('mousemove', function (e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY - (window.pageYOffset || document.documentElement.scrollTop);
    });

    TweenMax.ticker.addEventListener('tick', function () {
        pos.x += (mouse.x - pos.x) * 0.15;
        pos.y += (mouse.y - pos.y) * 0.15;
        TweenMax.set(ball, { x: pos.x, y: pos.y });
    });

    $(document).on({
        mouseenter: function () { $('.pzCursorItem').addClass('pzCursorHover'); },
        mouseleave: function () { $('.pzCursorItem').removeClass('pzCursorHover'); }
    }, 'a, .pzBtn, textarea, input');

    $(document).on({
        mouseenter: function () { $('.pzCursorItem').addClass('pzCursorSwipe'); },
        mouseleave: function () { $('.pzCursorItem').removeClass('pzCursorSwipe'); }
    }, '.swiper-slide');

    $(document).on({
        mouseenter: function () { $('.pzCursorItem').removeClass('pzCursorSwipe'); },
        mouseleave: function () { $('.pzCursorItem').addClass('pzCursorSwipe'); }
    }, '.swiper-slide a');

    $(document).on({
        mouseenter: function () { $('.pzCursorItem').addClass('pzCursorClose'); },
        mouseleave: function () { $('.pzCursorItem').removeClass('pzCursorClose'); }
    }, '.pzNavOverlay');
}

// ── Resize (runs once) ────────────────────────────────────────────────────────

$(window).on('resize load', sizeElements);

// ── Gesture Lock ─────────────────────────────────────────────────────────────

document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

// ── Init ──────────────────────────────────────────────────────────────────────

$(function () {
    initPartnrz();
    if (typeof window.pzInitShare === 'function') window.pzInitShare();
});
