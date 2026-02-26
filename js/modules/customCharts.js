import { financeState, saveState } from '../state.js';
import { showToast } from './toast.js';

export function renderCustomCharts(updateCallback) {
    const container = document.getElementById('charts-view-container');
    if (!container) return;

    if (financeState.customCharts.length === 0) {
        container.innerHTML = `
            <div class="card p-12 text-center opacity-50 flex flex-col items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 16V8"/><path d="M11 16V12"/><path d="M15 16V10"/></svg>
                </div>
                <p class="text-sm italic">No custom charts created yet. Start by adding one below.</p>
            </div>
        `;
    } else {
        container.innerHTML = financeState.customCharts.map(chart => {
            const maxValue = Math.max(...chart.dataPoints.map(p => p.value), 1);
            
            return `
            <div class="bg-[var(--bg-card)] border border-[var(--border-main)] rounded mb-8 overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
                <!-- Chart Display (70%) -->
                <div class="lg:w-[70%] w-full p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--border-main)] flex flex-col">
                    <div class="flex justify-between items-start mb-8">
                        <div>
                            <h3 class="text-xl font-bold text-[var(--text-main)]">${chart.title}</h3>
                            <p class="text-gray-500 text-xs mt-1">${chart.description}</p>
                        </div>
                        <button onclick="window.removeCustomChart(${chart.id})" class="text-gray-600 hover:text-red-400 p-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>
                    
                    <div id="chart-scroll-${chart.id}" class="w-full h-[300px] mt-6 mb-4 overflow-x-auto overflow-y-hidden pt-12 pb-12 scrollbar-hide">
                        <div class="h-full flex items-end ${chart.dataPoints.length > 8 ? 'w-max min-w-full px-4 gap-4' : 'w-full px-2 gap-2 sm:gap-4'}">
                            ${chart.dataPoints.length === 0 ? `
                                <div class="w-full h-full flex items-center justify-center text-gray-600 text-[10px] italic border border-dashed border-white/5 rounded-xl">
                                    Add data points to see the visualization
                                </div>
                            ` : chart.dataPoints.map(point => {
                                const height = Math.max((point.value / maxValue) * 100, 2); 
                                const widthClass = chart.dataPoints.length > 8 ? 'w-20 sm:w-28 flex-none' : 'flex-1 min-w-[16px]';
                                return `
                                    <div class="${widthClass} flex flex-col items-stretch group relative h-full justify-end">
                                        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--accent-primary)] text-[var(--btn-text)] text-[9px] font-black px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none scale-0 group-hover:scale-100 origin-bottom duration-200">
                                            $${point.value.toLocaleString()}
                                        </div>
                                        <div class="w-full bg-[var(--accent-primary)] opacity-60 group-hover:opacity-100 transition-all duration-300 rounded-t-xl" style="height: ${height}%"></div>
                                        <span class="text-[9px] text-gray-500 uppercase mt-2 font-bold truncate w-full text-center absolute -bottom-6 tracking-wider group-hover:text-[var(--text-main)] transition-colors">${point.label}</span>
                                        <button onclick="window.removeDataPoint(${chart.id}, ${point.id})" class="absolute -bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-30">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        </button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- Form (30%) -->
                <div class="lg:w-[30%] bg-[var(--bg-input)] p-6 flex flex-col">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Add Data Point</h4>
                    <form onsubmit="window.addDataPoint(event, ${chart.id})" class="space-y-4">
                        <div>
                            <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Label</label>
                            <input type="text" name="label" required class="w-full input-base rounded-lg p-3 text-xs focus:outline-none focus:border-[var(--accent-primary)]/50" placeholder="e.g. Jan, Week 1...">
                        </div>
                        <div>
                            <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Value ($)</label>
                            <input type="number" name="value" step="0.01" required class="w-full input-base rounded-lg p-3 text-xs focus:outline-none focus:border-[var(--accent-primary)]/50" placeholder="0.00">
                        </div>
                        <button type="submit" class="w-full py-3 btn-primary text-[11px] font-bold rounded-lg transition-all">
                            Add Point
                        </button>
                    </form>
                </div>
            </div>
            `;
        }).join('');

        // Auto-scroll to end for charts with many data points
        financeState.customCharts.forEach(chart => {
            if (chart.dataPoints.length > 8) {
                const el = document.getElementById(`chart-scroll-${chart.id}`);
                if (el) {
                    el.scrollLeft = el.scrollWidth;
                }
            }
        });
    }

    // Window global functions for interactivity
    window.removeCustomChart = (id) => {
        financeState.customCharts = financeState.customCharts.filter(c => c.id !== id);
        saveState();
        updateCallback();
        showToast('Custom chart deleted');
    };

    window.addDataPoint = (e, chartId) => {
        e.preventDefault();
        const form = e.target;
        const label = form.label.value;
        const value = parseFloat(form.value.value);
        
        const chart = financeState.customCharts.find(c => c.id === chartId);
        if (chart) {
            chart.dataPoints.push({
                id: Date.now(),
                label,
                value
            });
            saveState();
            updateCallback();
            showToast('Data point added');
        }
    };

    window.removeDataPoint = (chartId, pointId) => {
        const chart = financeState.customCharts.find(c => c.id === chartId);
        if (chart) {
            chart.dataPoints = chart.dataPoints.filter(p => p.id !== pointId);
            saveState();
            updateCallback();
            showToast('Data point removed');
        }
    };

    window.createNewChart = (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;

        financeState.customCharts.push({
            id: Date.now(),
            title,
            description,
            dataPoints: []
        });
        
        saveState();
        form.reset();
        updateCallback();
        showToast('New tracking chart created');
    };
}