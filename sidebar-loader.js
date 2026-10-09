/**
 * sidebar-loader.js
 * Dynamically loads the shared sidebar content into the #sidebar element,
 * then re-initialises Editorial's sidebar interaction logic.
 */
document.addEventListener('DOMContentLoaded', function () {
    fetch('sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load sidebar: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            var sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = data;

            // Re-initialise Editorial's sidebar logic
            reinitSidebar();
        })
        .catch(error => {
            console.error('Sidebar loading error:', error);
        });
});

/**
 * Re-initialise Editorial's sidebar behaviour:
 *  1. Collapsible menu openers
 *  2. Sidebar hide/show toggle (for <= large breakpoints)
 */
function reinitSidebar() {
    var $ = window.jQuery;
    if (!$) {
        return;
    }

    var $sidebar = $('#sidebar');
    var $window = $(window);

    // --- 1. Re-bind the collapsible menu openers ---
    var $menu = $('#menu');
    var $menu_openers = $menu.children('ul').find('.opener');

    $menu_openers.each(function () {
        var $this = $(this);
        $this.off('click');
        $this.on('click', function (event) {
            event.preventDefault();
            $menu_openers.not($this).removeClass('active');
            $this.toggleClass('active');
            $window.triggerHandler('resize.sidebar-lock');
        });
    });

    // --- 2. Re-create the sidebar toggle element ---
    // main.js already appended a .toggle element, but it was overwritten
    // when we replaced #sidebar's innerHTML. We re-create it here.
    var $existingToggle = $sidebar.find('.toggle');
    if ($existingToggle.length === 0) {
        $('<a href="#sidebar" class="toggle">Toggle</a>')
            .appendTo($sidebar)
            .on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                $sidebar.toggleClass('inactive');
            });
    }

    // --- 3. Re-bind link clicks (hide sidebar on <= large before navigating) ---
    $sidebar.on('click', 'a', function (event) {
        // Only apply on smaller breakpoints
        if (window.matchMedia('(min-width: 1281px)').matches) {
            return;
        }

        var $a = $(this);
        var href = $a.attr('href');
        var target = $a.attr('target');

        // Skip the toggle element
        if ($a.hasClass('toggle')) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (!href || href === '#' || href === '') {
            return;
        }

        $sidebar.addClass('inactive');

        setTimeout(function () {
            if (target === '_blank') {
                window.open(href);
            } else {
                window.location.href = href;
            }
        }, 500);
    });

    // --- 4. Re-trigger the sidebar scroll lock ---
    $window.triggerHandler('resize.sidebar-lock');
}