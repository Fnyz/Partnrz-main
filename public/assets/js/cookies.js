(function(){
    function setCookie(name, value, days){
        var d = new Date(); d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires="+ d.toUTCString() + ";path=/;SameSite=Lax;Secure";
    }

    function getCookie(name){
        var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g,'\\$1') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function emitConsent(val){
        try{ window.dispatchEvent(new CustomEvent('cookie:consent-changed',{detail:{analytics:!!val}})); }catch(e){}
    }

    var banner = document.getElementById('cookieBanner');
    var btnAccept = document.getElementById('cbAccept');
    var btnReject = document.getElementById('cbReject');
    var btnPrefs  = document.getElementById('cbPrefs');

    var modal = document.getElementById('cookiePrefsModal');
    var modalClose = modal ? modal.querySelector('.cpm-close') : null;
    var modalSave = document.getElementById('cpmSave');
    var modalReject = document.getElementById('cpmReject');
    var chkAnalytics = document.getElementById('consentAnalytics');
    var openPrefsBtn = document.getElementById('openCookiePrefs');

    var consent = getCookie('analytics_consent');
    var modalOpen = false;
    var lastFocus = null;
    var FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function trapFocus(e){
        if (!modalOpen) return;
        if (e.key !== 'Tab') return;
        var nodes = modal.querySelectorAll(FOCUSABLE);
        if (!nodes.length) return;
        var first = nodes[0], last = nodes[nodes.length-1];
        if (e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    }

    function showBannerIfNeeded(){ if (consent === null && banner) banner.style.display = 'block'; }

    function openModal(){
        if (!modal) return;
        consent = getCookie('analytics_consent');
        chkAnalytics.checked = consent === "1";
        lastFocus = document.activeElement;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden','false');
        document.body.classList.add('modal-open');
        modalOpen = true;

        setTimeout(function(){
            (modal.querySelector('#cpmSave') || modal.querySelector(FOCUSABLE))?.focus();
        }, 0);
    }

    function closeModal(){
        if (!modal) return;
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('modal-open');
        modalOpen = false;
        
        if (lastFocus && typeof lastFocus.focus === 'function') { lastFocus.focus(); }
    }

    function acceptAll(){
        setCookie('analytics_consent', "1", 180);
        consent = "1";
        if (banner) banner.style.display = 'none';
        closeModal();
        emitConsent(true);
    }

    function rejectAll(){
        setCookie('analytics_consent', "0", 180);
        consent = "0";
        if (banner) banner.style.display = 'none';
        closeModal();
        emitConsent(false);
    }

    function savePrefs(){
        setCookie('analytics_consent', chkAnalytics.checked ? "1" : "0", 180);
        consent = getCookie('analytics_consent');
        if (banner) banner.style.display = 'none';
        closeModal();
        emitConsent(consent === "1");
    }

    if (btnAccept) btnAccept.addEventListener('click', acceptAll);
    if (btnReject) btnReject.addEventListener('click', rejectAll);
    if (btnPrefs)  btnPrefs.addEventListener('click', openModal);
    if (openPrefsBtn) openPrefsBtn.addEventListener('click', openModal);

    if (modalClose)   modalClose.addEventListener('click', closeModal);
    if (modalSave)    modalSave.addEventListener('click', savePrefs);
    if (modalReject)  modalReject.addEventListener('click', function(){ chkAnalytics.checked = false; savePrefs(); });

    if (modal) modal.addEventListener('click', function(e){
        if (e.target === modal){ e.stopPropagation(); e.preventDefault(); }
    });

    document.addEventListener('keydown', function(e){
        if (!modalOpen) return;
        if (e.key === 'Escape'){ e.preventDefault(); return; }
        trapFocus(e);
    });

    showBannerIfNeeded();
})();
