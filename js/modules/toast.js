/**
 * Simple toast notification module (Alert Crumbs)
 */

export function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        // Bottom center positioning
        container.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[9999] pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    // Styling as a small pill with theme-aware colors
    toast.className = 'bg-[var(--accent-primary)] text-[var(--btn-text)] px-6 py-2.5 rounded-full text-[11px] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-2 transform translate-y-8 opacity-0 transition-all duration-500 pointer-events-auto border border-white/10';
    toast.style.backdropFilter = 'blur(8px)';
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);

    // Animate in using requestAnimationFrame to ensure the initial state is painted
    requestAnimationFrame(() => {
        setTimeout(() => {
            toast.classList.remove('translate-y-8', 'opacity-0');
        }, 10);
    });

    // Auto-remove after 3.5 seconds
    const timeoutId = setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 3500);

    // Allow manual dismiss on click
    toast.onclick = () => {
        clearTimeout(timeoutId);
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    };
}