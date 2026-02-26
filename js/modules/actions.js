import { financeState, saveState } from '../state.js';
import { showToast } from './toast.js';

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
            amountType: form.amountType ? form.amountType.value : 'fixed',
            amount: parseFloat(form.amount.value) || 0,
            impact: form.impact ? form.impact.value : 'deduction'
        };

        financeState.actions.push(action);
        saveState();
        renderDashboardCallback();
        showToast('Action button created');
    };

    window.deleteAction = (id) => {
        financeState.actions = financeState.actions.filter(a => a.id !== id);
        saveState();
        renderDashboardCallback();
        showToast('Quick Action deleted');
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

        let finalAmount = action.amount || 0;
        if (action.amountType === 'variable') {
            const varInput = document.getElementById('variable-amount-input');
            if (varInput) {
                finalAmount = parseFloat(varInput.value) || 0;
            }
        }

        if (finalAmount <= 0 && action.amountType === 'variable') {
            alert('Please enter a valid amount.');
            return;
        }

        // Add to entries
        // Deduction = debit, Addition = savings (generic asset)
        financeState.entries.unshift({
            id: Date.now(),
            type: action.impact === 'addition' ? 'savings' : 'debit',
            label: action.title,
            amount: finalAmount,
            date: Date.now()
        });

        saveState();
        renderDashboardCallback();
        showToast('Action logged successfully');
    };
}