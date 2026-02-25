import { financeState, saveState } from '../state.js';

export function initWidgetBgControls(renderDashboardCallback) {
    window.setWidgetBg = (type) => {
        financeState.widgetBgType = type;
        saveState();
        renderDashboardCallback();
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
        };
        reader.readAsDataURL(file);
    };
}