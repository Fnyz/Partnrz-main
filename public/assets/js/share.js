(function () {
    function buildShareUrl() {
        return window.location.href;
    }

    function initShare() {
        var u   = buildShareUrl();
        var enc = encodeURIComponent(u);
        var ttl = encodeURIComponent(document.title);
        var metaDesc = document.querySelector('meta[name="description"]');
        var desc = encodeURIComponent((metaDesc ? metaDesc.content : '').substring(0, 250));

        var networks = [
            { name: 'facebook',  url: 'https://www.facebook.com/share.php?u=' + enc },
            { name: 'pinterest', url: 'https://pinterest.com/pin/create/button/?url=' + enc + '&description=' + desc },
            { name: 'twitter',   url: 'https://x.com/intent/post?url=' + enc + '&text=' + ttl },
            { name: 'linkedin',  url: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc },
            { name: 'tumblr',    url: 'https://www.tumblr.com/share?v=3&u=' + enc + '&t=' + ttl }
        ];

        var $container = $('.pz-share-container').empty();

        networks.forEach(function (n) {
            $('<a>', {
                href:   n.url,
                'class': 'pop pz-share-icon pz-share-' + n.name
            }).appendTo($container);
        });

        $container.find('.pop').off('click').on('click', function () {
            window.open($(this).attr('href'), 't', 'toolbar=0,resizable=1,status=0,width=640,height=528');
            return false;
        });
    }

    // Expose so main.js readyFunctions() can call it on every page load / AJAX nav
    window.pzInitShare = initShare;

    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            setTimeout(initShare, 0);
        });
    }
})();