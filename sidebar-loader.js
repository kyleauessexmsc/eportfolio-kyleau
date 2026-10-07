/**
 * sidebar-loader.js
 * Dynamically loads the shared sidebar content into the #sidebar element.
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
            document.getElementById('sidebar').innerHTML = data;
        })
        .catch(error => {
            console.error('Sidebar loading error:', error);
        });
});