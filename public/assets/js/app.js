(function () {
    'use strict';

    function show(el) { el.style.display = 'block'; }
    function hide(el) { el.style.display = ''; }

    // ── Theme ─────────────────────────────────────────────────────────────────

    function initTheme() {
        var STORAGE_KEY = 'partnrz-theme';
        var root = document.documentElement;

        var stored = localStorage.getItem(STORAGE_KEY);
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var startTheme = stored || (prefersDark ? 'dark' : 'light');

        if (root.getAttribute('data-theme') !== startTheme) {
            root.setAttribute('data-theme', startTheme);
        }

        function applyTheme(theme) {
            root.setAttribute('data-theme', theme);
            localStorage.setItem(STORAGE_KEY, theme);
            var btn = document.getElementById('themeToggle');
            if (btn) {
                btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
            }
            setTimeout(function () {
                if (typeof window.pzInitShare === 'function') window.pzInitShare();
            }, 0);
        }

        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                applyTheme(next);
            });
            applyTheme(root.getAttribute('data-theme'));
        }
    }

    // ── Active Nav Links ──────────────────────────────────────────────────────

    function initNav() {
        var NAV_SELECTORS = ['.pzSidebarNav a', '.pzNavInner#menu a'];

        function collectLinks() {
            return Array.prototype.slice.call(document.querySelectorAll(NAV_SELECTORS.join(',')));
        }

        function normalizePath(urlLike) {
            try {
                var u = new URL(urlLike, location.origin);
                var p = u.pathname.toLowerCase().replace(/\/+$/, '');
                if (p === '' || p === '/index' || p === '/index.php') p = '/';
                return p;
            } catch (e) {
                return '/';
            }
        }

        function linkPath(a) {
            var explicit = a.getAttribute('data-route');
            if (explicit) return normalizePath(explicit);
            var href = a.getAttribute('href') || '';
            if (href === '#' || href.indexOf('javascript:') === 0) return null;
            return normalizePath(a.href);
        }

        function setActiveForPath(path) {
            var links = collectLinks();
            links.forEach(function (el) {
                el.classList.remove('pzActLink');
                el.removeAttribute('aria-current');
            });
            links.forEach(function (el) {
                var lp = linkPath(el);
                if (lp && lp === path) {
                    el.classList.add('pzActLink');
                    el.setAttribute('aria-current', 'page');
                }
            });
        }

        function refresh() { setActiveForPath(normalizePath(location.href)); }

        refresh();

        document.addEventListener('click', function (e) {
            var a = e.target.closest('.pzSidebarNav a, .pzNavInner#menu a');
            if (!a) return;
            var p = linkPath(a);
            if (p) setActiveForPath(p);
        }, true);

        window.addEventListener('popstate', refresh);
        if (window.jQuery) jQuery(document).on('ajaxComplete', refresh);
        window.addEventListener('route:changed', refresh);

        var mo = new MutationObserver(refresh);
        mo.observe(document.documentElement, { subtree: true, childList: true });
    }

    // ── Cookie Consent ────────────────────────────────────────────────────────

    function initCookies() {
        function setCookie(name, value, days) {
            var d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax;Secure';
        }

        function getCookie(name) {
            var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
            return m ? decodeURIComponent(m[1]) : null;
        }

        function emitConsent(val) {
            try { window.dispatchEvent(new CustomEvent('cookie:consent-changed', { detail: { analytics: !!val } })); } catch (e) {}
        }

        var banner      = document.getElementById('cookieBanner');
        var btnAccept   = document.getElementById('cbAccept');
        var btnReject   = document.getElementById('cbReject');
        var btnPrefs    = document.getElementById('cbPrefs');
        var modal       = document.getElementById('cookiePrefsModal');
        var modalClose  = modal ? modal.querySelector('.cpmClose') : null;
        var modalSave   = document.getElementById('cpmSave');
        var modalReject = document.getElementById('cpmReject');
        var chkAnalytics = document.getElementById('consentAnalytics');
        var openPrefsBtn = document.getElementById('openCookiePrefs');

        var consent   = getCookie('analytics_consent');
        var isOpen    = false;
        var lastFocus = null;
        var FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

        function trapFocus(e) {
            if (!isOpen || e.key !== 'Tab') return;
            var nodes = modal.querySelectorAll(FOCUSABLE);
            if (!nodes.length) return;
            var first = nodes[0], last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }

        function showBannerIfNeeded() {
            if (consent === null && banner) show(banner);
        }

        function openModal() {
            if (!modal) return;
            consent = getCookie('analytics_consent');
            chkAnalytics.checked = consent === '1';
            lastFocus = document.activeElement;
            show(modal);
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            isOpen = true;
            setTimeout(function () {
                var el = modal.querySelector('#cpmSave') || modal.querySelector(FOCUSABLE);
                if (el) el.focus();
            }, 0);
        }

        function closeModal() {
            if (!modal) return;
            hide(modal);
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            isOpen = false;
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        }

        function acceptAll() {
            setCookie('analytics_consent', '1', 180);
            consent = '1';
            if (banner) hide(banner);
            closeModal();
            emitConsent(true);
        }

        function rejectAll() {
            setCookie('analytics_consent', '0', 180);
            consent = '0';
            if (banner) hide(banner);
            closeModal();
            emitConsent(false);
        }

        function savePrefs() {
            setCookie('analytics_consent', chkAnalytics.checked ? '1' : '0', 180);
            consent = getCookie('analytics_consent');
            if (banner) hide(banner);
            closeModal();
            emitConsent(consent === '1');
        }

        if (btnAccept)   btnAccept.addEventListener('click', acceptAll);
        if (btnReject)   btnReject.addEventListener('click', rejectAll);
        if (btnPrefs)    btnPrefs.addEventListener('click', openModal);
        if (openPrefsBtn) openPrefsBtn.addEventListener('click', openModal);
        if (modalClose)  modalClose.addEventListener('click', closeModal);
        if (modalSave)   modalSave.addEventListener('click', savePrefs);
        if (modalReject) modalReject.addEventListener('click', function () { chkAnalytics.checked = false; savePrefs(); });

        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) { e.stopPropagation(); e.preventDefault(); }
            });
        }

        document.addEventListener('keydown', function (e) {
            if (!isOpen) return;
            if (e.key === 'Escape') { e.preventDefault(); return; }
            trapFocus(e);
        });

        showBannerIfNeeded();
    }

    // ── Social Share ──────────────────────────────────────────────────────────

    function buildShareLinks() {
        var u    = window.location.href;
        var enc  = encodeURIComponent(u);
        var ttl  = encodeURIComponent(document.title);
        var metaDesc = document.querySelector('meta[name="description"]');
        var desc = encodeURIComponent((metaDesc ? metaDesc.content : '').substring(0, 250));

        var networks = [
            { name: 'facebook',  url: 'https://www.facebook.com/share.php?u=' + enc },
            { name: 'pinterest', url: 'https://pinterest.com/pin/create/button/?url=' + enc + '&description=' + desc },
            { name: 'twitter',   url: 'https://x.com/intent/post?url=' + enc + '&text=' + ttl },
            { name: 'linkedin',  url: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc },
            { name: 'tumblr',    url: 'https://www.tumblr.com/share?v=3&u=' + enc + '&t=' + ttl }
        ];

        var $container = $('.pzShareContainer').empty();
        networks.forEach(function (n) {
            $('<a>', { href: n.url, 'class': 'pop pzShareIcon pzShare' + n.name[0].toUpperCase() + n.name.slice(1) }).appendTo($container);
        });

        $container.find('.pop').off('click').on('click', function () {
            window.open($(this).attr('href'), 't', 'toolbar=0,resizable=1,status=0,width=640,height=528');
            return false;
        });
    }

    window.pzInitShare = buildShareLinks;

    // ── Theme-aware Images ────────────────────────────────────────────────────

    function initThemeImages() {
        function applyThemeImages() {
            var theme = (document.documentElement.getAttribute('data-theme') || 'dark').toLowerCase();
            document.querySelectorAll('picture.themePicture > img').forEach(function (img) {
                var url = (theme === 'light') ? img.getAttribute('data-src-light') : img.getAttribute('data-src-dark');
                if (url && img.src !== url) img.src = url;
            });
        }

        applyThemeImages();
        new MutationObserver(applyThemeImages).observe(document.documentElement, {
            attributes: true, attributeFilter: ['data-theme']
        });
    }

    // ── Scroll to Target ──────────────────────────────────────────────────────

    function initScrollButtons() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.jsScroll');
            if (!btn) return;
            e.preventDefault();
            var target = document.querySelector(btn.getAttribute('data-target') || '#sec3');
            if (!target) return;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 16, behavior: 'smooth' });
        });
    }

    // ── Pitch Modal ───────────────────────────────────────────────────────────

    function initPitchModal() {
        var modal = document.getElementById('pitchModal');
        if (!modal) return;

        var overlay  = modal.querySelector('.pitchModalOverlay');
        var bodyEl   = document.getElementById('pitchModalBody');
        var iconEl   = document.getElementById('pitchModalIcon');
        var titleEl  = document.getElementById('pitchModalTitle');
        var okTpl    = document.getElementById('pitchSuccess');
        var errTpl   = document.getElementById('pitchError');

        var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        var lastFocus    = null;
        var modalOpen    = false;
        var prevScrollY  = 0;
        var blockers     = { wheel: null, touch: null };

        function trapFocus(e) {
            if (!modalOpen || e.key !== 'Tab') return;
            var nodes = modal.querySelectorAll(FOCUSABLE);
            if (!nodes.length) return;
            var first = nodes[0], last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
            else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
        }

        function lockScroll() {
            prevScrollY = window.scrollY || document.documentElement.scrollTop || 0;
            document.documentElement.style.setProperty('--scrollY', '-' + prevScrollY + 'px');
            document.documentElement.classList.add('modal-open');
            document.body.classList.add('modal-open', 'scrollLocked');
            blockers.wheel = function (e) { if (modalOpen && !modal.contains(e.target)) e.preventDefault(); };
            blockers.touch = function (e) { if (modalOpen && !modal.contains(e.target)) e.preventDefault(); };
            window.addEventListener('wheel',     blockers.wheel, { passive: false });
            window.addEventListener('touchmove', blockers.touch, { passive: false });
        }

        function unlockScroll() {
            if (blockers.wheel) window.removeEventListener('wheel',     blockers.wheel, { passive: false });
            if (blockers.touch) window.removeEventListener('touchmove', blockers.touch, { passive: false });
            blockers.wheel = blockers.touch = null;
            document.documentElement.style.removeProperty('--scrollY');
            document.body.classList.remove('scrollLocked');
            document.documentElement.classList.remove('modal-open');
            document.body.classList.remove('modal-open');
            window.scrollTo(0, prevScrollY || 0);
        }

        var ICONS = {
            success: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
            error:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        };

        function openModal(type, html) {
            lastFocus  = document.activeElement;
            modalOpen  = true;
            lockScroll();
            modal.classList.add('isOpen');
            modal.setAttribute('aria-hidden', 'false');
            iconEl.className = 'pitchModalIcon ' + (type === 'success' ? 'success' : 'error');
            iconEl.innerHTML  = ICONS[type] || '';
            titleEl.textContent = type === 'success' ? 'Thanks!' : 'Something went wrong';
            bodyEl.innerHTML = html || (type === 'success' ? (okTpl ? okTpl.innerHTML : '') : (errTpl ? errTpl.innerHTML : ''));
            var focusEl = modal.querySelector('.pitchModalClose') || modal.querySelector('[data-close]') || modal;
            focusEl.focus();
        }

        function closeModal() {
            modal.classList.remove('isOpen');
            modal.setAttribute('aria-hidden', 'true');
            modalOpen = false;
            unlockScroll();
            if (lastFocus) { try { lastFocus.focus(); } catch (e) {} }
        }

        modal.addEventListener('click', function (e) {
            if (e.target.closest('[data-close]')) { e.preventDefault(); closeModal(); }
        });

        if (overlay) {
            ['click', 'mousedown', 'mouseup'].forEach(function (evt) {
                overlay.addEventListener(evt, function (e) { e.stopPropagation(); e.preventDefault(); }, true);
            });
        }

        document.addEventListener('keydown', function (e) {
            if (!modalOpen) return;
            if (e.key === 'Escape') e.preventDefault();
            else if (e.key === 'Tab') trapFocus(e);
        });

        window.showPitchModal = function (type, html) { openModal(type, html); };
    }

    // ── Pitch Form ────────────────────────────────────────────────────────────

    function initPitchForm() {
        var f = document.getElementById('pitchForm');
        if (!f) return;

        var submitBtn    = document.getElementById('pitchSubmitBtn');
        var successEl    = document.getElementById('pitchSuccess');
        var errorEl      = document.getElementById('pitchError');
        var maxFileMb    = 25;
        var allowedExts  = ['pdf', 'ppt', 'pptx'];

        function fileExt(name) { return (name.split('.').pop() || '').toLowerCase(); }

        f.addEventListener('submit', function (e) {
            e.preventDefault();
            hide(errorEl); hide(successEl);

            if (f.company_website && f.company_website.value.trim() !== '') {
                errorEl.innerHTML = '<i class="fas fa-times-circle"></i> Spam detected.';
                show(errorEl); return;
            }

            var requiredFields = ['full_name', 'email', 'company', 'stage', 'round_size', 'deck_url', 'consent'];
            for (var i = 0; i < requiredFields.length; i++) {
                var el = f.elements[requiredFields[i]];
                if (!el) continue;
                if ((el.type === 'checkbox' && !el.checked) || (el.value || '').trim() === '') {
                    errorEl.innerHTML = '<i class="fas fa-times-circle"></i> Please fill all required fields.';
                    show(errorEl); el.focus(); return;
                }
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) {
                errorEl.innerHTML = '<i class="fas fa-times-circle"></i> Please enter a valid email address.';
                show(errorEl); f.email.focus(); return;
            }

            var file = f.deck_file && f.deck_file.files && f.deck_file.files[0];
            if (file) {
                if (file.size / (1024 * 1024) > maxFileMb) {
                    errorEl.innerHTML = '<i class="fas fa-times-circle"></i> File too large (max ' + maxFileMb + 'MB).';
                    show(errorEl); return;
                }
                if (!allowedExts.includes(fileExt(file.name))) {
                    errorEl.innerHTML = '<i class="fas fa-times-circle"></i> Invalid file type. Allowed: ' + allowedExts.join(', ');
                    show(errorEl); return;
                }
            }

            var fd = new FormData(f);
            fd.append('ajax', '1');
            submitBtn.setAttribute('disabled', 'disabled');
            var originalLabel = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending\u2026</span>';

            var errorMessages = {
                csrf_failed:          'Session expired. Please reload the page or try again.',
                too_fast:             'Please wait a moment before submitting.',
                rate_limited:         'Too many submissions today. Please try again later.',
                invalid_email:        'Please enter a valid email address.',
                invalid_url:          'One of the URLs looks invalid.',
                file_too_large:       'File too large (max ' + maxFileMb + 'MB).',
                invalid_extension:    'Invalid file type. Allowed: ' + allowedExts.join(', '),
                invalid_mime:         'The uploaded file type is not allowed.',
                spam_detected:        'Spam detected.',
                mkdir_failed:         'Internal storage error. Please email us instead.',
                move_failed:          'Internal storage error. Please email us instead.',
                upload_invalid_tmp:   'Upload failed. Please try again.',
                db_error_rate_limit:  'Temporary database issue while checking rate limit.',
                db_insert_failed:     'Temporary database issue while saving. Please try again.'
            };

            fetch('/api/pitch/submit.php', {
                method: 'POST',
                body: fd,
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
                credentials: 'same-origin'
            })
            .then(function (res) {
                var ct = res.headers.get('content-type') || '';
                if (!ct.includes('application/json')) throw new Error('bad_response');
                return res.json();
            })
            .then(function (json) {
                if (!json || json.ok !== true) throw new Error((json && json.error) ? json.error : 'unknown_error');
                if (json.csrf && f.csrf) f.csrf.value = json.csrf;
                f.deck_url.value = '';
                if (f.demo_url)  f.demo_url.value  = '';
                if (f.summary)   f.summary.value   = '';
                if (f.notes)     f.notes.value     = '';
                if (f.deck_file) f.deck_file.value = '';
                if (f.consent)   f.consent.checked  = false;
                if (window.showPitchModal) window.showPitchModal('success', successEl ? successEl.innerHTML : '');
            })
            .catch(function (e) {
                var msg = errorMessages[e.message] || 'Something went wrong. Please try again or email <a href="mailto:hello@partnrz.com">hello@partnrz.com</a>.';
                if (window.showPitchModal) window.showPitchModal('error', '<i class="fas fa-times-circle"></i> ' + msg);
            })
            .finally(function () {
                submitBtn.removeAttribute('disabled');
                submitBtn.innerHTML = originalLabel;
            });
        });

        var params = new URLSearchParams(location.search);
        var urlErrorMessages = {
            csrf_failed:         'Session expired. Please reload the page or try again.',
            too_fast:            'Please wait a moment before submitting.',
            rate_limited:        'Too many submissions today. Please try again later.',
            invalid_email:       'Please enter a valid email address.',
            invalid_url:         'One of the URLs looks invalid.',
            file_too_large:      'File too large (max 25MB).',
            invalid_extension:   'Invalid file type. Allowed: pdf, ppt, pptx.',
            invalid_mime:        'The uploaded file type is not allowed.',
            spam_detected:       'Spam detected.',
            mkdir_failed:        'Internal storage error. Please email us instead.',
            move_failed:         'Internal storage error. Please email us instead.',
            upload_invalid_tmp:  'Upload failed. Please try again.',
            db_error_rate_limit: 'Temporary database issue while checking rate limit.',
            db_insert_failed:    'Temporary database issue while saving. Please try again.'
        };

        if (params.has('success') && window.showPitchModal) {
            window.showPitchModal('success', successEl ? successEl.innerHTML : '');
        } else if (params.has('error') && window.showPitchModal) {
            var code = params.get('error');
            var msg  = urlErrorMessages[code] || 'Something went wrong. Please try again or email <a href="mailto:hello@partnrz.com">hello@partnrz.com</a>.';
            window.showPitchModal('error', '<i class="fas fa-times-circle"></i> ' + msg);
        }

        if (params.has('success') || params.has('error')) {
            history.replaceState({}, '', location.pathname);
        }
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    initTheme();
    initNav();
    initCookies();
    buildShareLinks();
    initThemeImages();
    initScrollButtons();
    initPitchModal();
    initPitchForm();

})();
