import { createChart, chartConfigs } from './utils/charts.js';
import { initQuantitySpinner, initSidebarListeners, initProductSliders } from './utils/ui.js';
import { initRevenueChart } from './utils/revenue.js';

document.addEventListener('DOMContentLoaded', function () {
    initQuantitySpinner();
    initSidebarListeners();
    initProductSliders();
    
    initCharts();
});

function initCharts() {
    initRevenueChart();
    
    createChart("ageChart", chartConfigs.getAgeChartConfig());
    createChart("genderChart", chartConfigs.getGenderChartConfig());
    createChart("discountChart", chartConfigs.getDiscountChartConfig());
}