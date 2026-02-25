import { financeState, saveState } from '../state.js';

// Initialize global click listener once for outside clicks
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    
    if (window.innerWidth <= 1024 && financeState.sidebarOpen && sidebar) {
        // Close if click is outside sidebar AND not on the toggle button itself
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnToggle = toggleBtn && (toggleBtn === e.target || toggleBtn.contains(e.target));
        
        if (!isClickInsideSidebar && !isClickOnToggle) {
            financeState.sidebarOpen = false;
            sidebar.classList.remove('mobile-open');
            // No need to saveState() here as it's purely UI transient
        }
    }
});

export function initSidebarLogic() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggleBtn || !sidebar) return;

    // Handle initial state on load: Force closed on non-desktop
    if (window.innerWidth <= 1024) {
        financeState.sidebarOpen = false;
        sidebar.classList.remove('mobile-open');
    } else {
        // Desktop handling
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
    }

    // Use .onclick to ensure we don't stack multiple listeners on re-renders
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        financeState.sidebarOpen = !financeState.sidebarOpen;
        
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
        saveState();
    };

    window.onresize = () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('mobile-open');
            sidebar.style.display = financeState.sidebarOpen ? 'flex' : 'none';
            sidebar.style.width = financeState.sidebarOpen ? '280px' : '0px';
            sidebar.style.minWidth = financeState.sidebarOpen ? '280px' : '0px';
            sidebar.style.opacity = financeState.sidebarOpen ? '1' : '0';
        } else {
            sidebar.style.width = '';
            sidebar.style.minWidth = '';
            sidebar.style.display = '';
            sidebar.style.opacity = '';
            if (!financeState.sidebarOpen) {
                sidebar.classList.remove('mobile-open');
            }
        }
    };
}