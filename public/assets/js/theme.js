(function(){
    const KEY = 'partnrz-theme';
    const root = document.documentElement;

    const stored = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startTheme = stored || (prefersDark ? 'dark' : 'light');
    if (root.getAttribute('data-theme') !== startTheme){
        root.setAttribute('data-theme', startTheme);
    }

    const btn = document.getElementById('themeToggle');
    const apply = (t) => {
        root.setAttribute('data-theme', t);
        localStorage.setItem(KEY, t);
        btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    };
    if (btn){
        btn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            apply(next);
        });
        apply(root.getAttribute('data-theme'));
    }
})();