import { createChart, chartConfigs } from './utils/charts.js';
import { initSidebarListeners } from './utils/ui.js';
import { initRevenueChart } from './utils/revenue.js';
import { initPdfExport } from './utils/pdf-export.js';

document.addEventListener('DOMContentLoaded', function () {
    initSidebarListeners();
    
    initCharts();
    initPdfExport();
});

function initCharts() {
    initRevenueChart();
}