import { financeState, saveState } from '../state.js';

export function initSidebarLogic() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggleBtn || !sidebar) return;

    // Handle initial state on load
    if (window.innerWidth > 1024) {
        // If state is not set, default to open on desktop
        if (financeState.sidebarOpen === undefined) financeState.sidebarOpen = true;

        if (!financeState.sidebarOpen) {
            sidebar.style.width = '0px';
            sidebar.style.minWidth = '0px';
            sidebar.style.opacity = '0';
            sidebar.style.display = 'none';
        } else {
            sidebar.style.width = '280px';
            sidebar.style.minWidth = '280px';
            sidebar.style.opacity = '1';
            sidebar.style.display = 'flex';
        }
    } else {
        if (financeState.sidebarOpen) {
            sidebar.classList.add('mobile-open');
        } else {
            sidebar.classList.remove('mobile-open');
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        financeState.sidebarOpen = !financeState.sidebarOpen;
        saveState();
        
        if (window.innerWidth <= 1024) {
            sidebar.classList.toggle('mobile-open', financeState.sidebarOpen);
        } else {
            if (financeState.sidebarOpen) {
                gsap.to(sidebar, {
                    width: 280,
                    minWidth: 280,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onStart: () => {
                        sidebar.style.display = 'flex';
                    }
                });
            } else {
                gsap.to(sidebar, {
                    width: 0,
                    minWidth: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => {
                        if (!financeState.sidebarOpen) sidebar.style.display = 'none';
                    }
                });
            }
        }
    });

    // Outside click to close on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && financeState.sidebarOpen && !sidebar.contains(e.target) && e.target !== toggleBtn) {
            financeState.sidebarOpen = false;
            sidebar.classList.remove('mobile-open');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('mobile-open');
            sidebar.style.display = financeState.sidebarOpen ? 'flex' : 'none';
            sidebar.style.width = financeState.sidebarOpen ? '280px' : '0px';
            sidebar.style.minWidth = financeState.sidebarOpen ? '280px' : '0px';
            sidebar.style.opacity = financeState.sidebarOpen ? '1' : '0';
        } else {
            sidebar.style.width = '';
            sidebar.style.minWidth = '';
            if (!financeState.sidebarOpen) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
}