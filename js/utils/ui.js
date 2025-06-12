export function initQuantitySpinner() {
    document.querySelectorAll('.quantity-spinner').forEach(spinner => {
        const input = spinner.querySelector('input');
        const btnUp = spinner.querySelector('.quantity-up');
        const btnDown = spinner.querySelector('.quantity-down');
        
        if (input && btnUp && btnDown) {
            btnUp.addEventListener('click', () => {
                const currentValue = parseInt(input.value, 10) || 0;
                input.value = currentValue + 1;
            });
            
            btnDown.addEventListener('click', () => {
                const currentValue = parseInt(input.value, 10) || 0;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });
        }
    });
}

export function initSidebarListeners() {
    document.getElementById('sidebarToggle').addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('hidden');
        document.getElementById('content').classList.toggle('expanded');
    });
    
    document.getElementById('sidebarclose').addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('hidden');
        document.getElementById('content').classList.toggle('expanded');
    });
    
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}