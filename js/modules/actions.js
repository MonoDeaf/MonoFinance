import { financeState, saveState } from '../state.js';

export function initActionHandlers(renderDashboardCallback) {
    window.toggleActionForm = () => {
        const container = document.getElementById('action-form-container');
        if (container) {
            container.classList.toggle('hidden');
        }
    };

    window.addNewAction = (e) => {
        e.preventDefault();
        const form = e.target;
        const action = {
            id: Date.now(),
            type: form.type.value,
            title: form.title.value,
            url: form.type.value === 'url' ? form.url.value : null,
            amount: parseFloat(form.amount.value) || 0
        };

        financeState.actions.push(action);
        saveState();
        renderDashboardCallback();
    };

    window.deleteAction = (id) => {
        financeState.actions = financeState.actions.filter(a => a.id !== id);
        saveState();
        renderDashboardCallback();
    };

    window.triggerAction = (url, id) => {
        const action = financeState.actions.find(a => a.id === id);
        if (!action) return;

        if (action.type === 'basic') {
            financeState.selectedActionId = id;
            financeState.selectedActionUrl = null;
        } else {
            financeState.selectedActionId = null;
            financeState.selectedActionUrl = url;
            
            // Open the URL
            if (window.innerWidth > 1024) {
                window.open(url, 'actionPopup', 'width=1200,height=800,resizable=yes,scrollbars=yes,status=no,location=no');
            } else {
                window.open(url, '_blank');
            }
        }

        renderDashboardCallback();
    };

    window.markActionDone = (id) => {
        const action = financeState.actions.find(a => a.id === id);
        if (!action) return;

        // Add to entries as a debit/expense
        financeState.entries.unshift({
            id: Date.now(),
            type: 'debit',
            label: action.title,
            amount: action.amount || 0,
            date: Date.now()
        });

        // Reset selection or handle feedback? For now just re-render to show entry in ledger
        saveState();
        renderDashboardCallback();
    };
}