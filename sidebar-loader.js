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
 * Re-initialise the sidebar menu behaviour (open/close toggles).
 * This replicates the logic from Editorial's main.js for the #menu element.
 */
function reinitSidebar() {
    var $ = window.jQuery;
    if (!$) {
        return;
    }

    var $menu = $('#menu');

    // Re-bind the opener click handlers for collapsible sections
    $menu.find('.opener').each(function () {
        var $opener = $(this);

        // Remove any existing handlers to avoid duplicates
        $opener.off('click');

        $opener.on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            var $li = $opener.parent();
            var $ul = $li.children('ul');

            if ($li.hasClass('active')) {
                $li.removeClass('active');
                $ul.slideUp(200);
            } else {
                $li.addClass('active');
                $ul.slideDown(200);
            }
        });
    });
}