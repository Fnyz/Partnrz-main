(function () {
    var NAV_SELECTORS = ['.pz-sidebar-nav a', '.pz-nav-inner#menu a'];

    function collectLinks(){
        return Array.prototype.slice.call(document.querySelectorAll(NAV_SELECTORS.join(',')));
    }

    function normalizePath(urlLike) {
        try {
            var u = new URL(urlLike, location.origin);
            var p = u.pathname.toLowerCase();
            p = p.replace(/\/+$/, '');
            if (p === '' || p === '/index' || p === '/index.php') p = '/';
            return p;
        } 
        catch (e) {
            return '/';
        }
    }

    function linkPath(a){
        var explicit = a.getAttribute('data-route');
        if (explicit) return normalizePath(explicit);
        var href = a.getAttribute('href') || '';
        if (href === '#' || href.indexOf('javascript:') === 0) return null;
        return normalizePath(a.href);
    }

    function setActiveForPath(path){
        var links = collectLinks();
        links.forEach(function(el){
            el.classList.remove('pz-act-link');
            el.removeAttribute('aria-current');
        });
        links.forEach(function(el){
            var lp = linkPath(el);
            if (lp && lp === path){
                el.classList.add('pz-act-link');
                el.setAttribute('aria-current','page');
            }
        });
    }

    function refresh(){ setActiveForPath(normalizePath(location.href)); }

    refresh();

    document.addEventListener('click', function(e){
        var a = e.target.closest('.pz-sidebar-nav a, .pz-nav-inner#menu a');
        if (!a) return;
        var p = linkPath(a);
        if (p) setActiveForPath(p);
    }, true);

    window.addEventListener('popstate', refresh);

    if (window.jQuery) jQuery(document).on('ajaxComplete', refresh);
    window.addEventListener('route:changed', refresh);

    var mo = new MutationObserver(refresh);
    mo.observe(document.documentElement, {subtree:true, childList:true});
})();
