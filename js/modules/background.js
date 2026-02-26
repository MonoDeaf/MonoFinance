import { financeState, saveState } from '../state.js';
import { showToast } from './toast.js';

export function initWidgetBgControls(renderDashboardCallback) {
    window.setWidgetBg = (type) => {
        financeState.widgetBgType = type;
        saveState();
        renderDashboardCallback();
        showToast('Background updated');
    };

    window.uploadWidgetBg = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            financeState.widgetBgType = 'custom';
            financeState.customBgData = event.target.result;
            saveState();
            renderDashboardCallback();
            showToast('Custom background uploaded');
        };
        reader.readAsDataURL(file);
    };
}