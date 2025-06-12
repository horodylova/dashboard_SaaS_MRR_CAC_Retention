import { createChart, chartConfigs } from './charts.js';

export function initRevenueChart() {
    const revenueChart = createChart("revenueChart", chartConfigs.getRevenueChartConfig());
    
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const period = this.getAttribute('data-period');
            const dropdownButton = document.getElementById('revenueDropdown');
            dropdownButton.textContent = this.textContent;
            
            updateRevenueChart(period, revenueChart);
        });
    });
    
    return revenueChart;
}

export function updateRevenueChart(period = 'all', revenueChart) {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDay();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let labels = [];
    let mrrData = [];
    let arrData = [];
    let totalOrders = 0;
    let totalEarnings = 0;
    let totalRefunds = 0;
    let conversionRate = 0;
    
    const allData = window.saasMetricsData.labels.map((label, index) => {
        const parts = label.split(' ');
        const month = parts[0];
        const year = parseInt(parts[1]);
        
        return {
            shortLabel: month,
            date: new Date(year, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month), 1),
            mrr: window.saasMetricsData.mrr[index],
            arr: window.saasMetricsData.arr[index]
        };
    });
    
    let filteredData = [];
    
    if (period === 'today') {
        const hourlyData = [];
        const baseValue = Math.floor(Math.random() * 300) + 100;
        
        for (let hour = 0; hour < 24; hour++) {
            let hourFactor = 1;
            
            if (hour >= 9 && hour <= 17) {
                hourFactor = 1.5 + Math.random();
            } else if (hour >= 18 && hour <= 21) {
                hourFactor = 1.2 + Math.random() * 0.5;
            } else {
                hourFactor = 0.3 + Math.random() * 0.7;
            }
            
            const mrr = Math.round(baseValue * hourFactor);
            const arr = mrr * 12;
            
            hourlyData.push({
                hour,
                mrr,
                arr
            });
        }
        
        labels = hourlyData.map(d => `${d.hour}:00`);
        mrrData = hourlyData.map(d => d.mrr);
        arrData = hourlyData.map(d => d.arr / 12);
        
        const todayTotal = mrrData.reduce((sum, val) => sum + val, 0);
        totalOrders = Math.round(todayTotal / 10);
        totalEarnings = Math.round(todayTotal);
        totalRefunds = Math.round(todayTotal * 0.05);
        conversionRate = 18 + Math.round(Math.random() * 7);
        
        revenueChart.config.type = 'line';
        revenueChart.data.datasets[0].type = 'line';
        revenueChart.data.datasets[0].fill = 'origin';
        revenueChart.data.datasets[0].backgroundColor = 'rgba(136, 178, 103, 0.2)';
        revenueChart.data.datasets[0].tension = 0.4;
        
        revenueChart.data.datasets[1].type = 'line';
        revenueChart.data.datasets[1].fill = false;
        revenueChart.data.datasets[1].backgroundColor = undefined;
        revenueChart.data.datasets[1].tension = 0.4;
        
        revenueChart.options.scales.y.title.text = 'Hourly Revenue ($)';
        revenueChart.options.scales.y1.title.text = 'Hourly ARR ($)';
        
        revenueChart.options.plugins.annotation = {
            annotations: {
                currentHour: {
                    type: 'line',
                    xMin: currentHour,
                    xMax: currentHour,
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        content: 'Current Hour',
                        enabled: true,
                        position: 'top'
                    }
                }
            }
        };
    } else if (period === 'week') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        labels = days;
        
        const dailyData = [];
        const baseValue = Math.floor(Math.random() * 1000) + 500;
        
        for (let day = 0; day < 7; day++) {
            let dayFactor = 1;
            
            if (day >= 1 && day <= 5) {
                dayFactor = 1.2 + Math.random() * 0.8;
            } else {
                dayFactor = 0.6 + Math.random() * 0.4;
            }
            
            const mrr = Math.round(baseValue * dayFactor);
            const arr = mrr * 12;
            
            dailyData.push({
                day,
                mrr,
                arr
            });
        }
        
        mrrData = dailyData.map(d => d.mrr);
        arrData = dailyData.map(d => d.arr / 12);
        
        const weeklyTotal = mrrData.reduce((sum, val) => sum + val, 0);
        totalOrders = Math.round(weeklyTotal / 9);
        totalEarnings = Math.round(weeklyTotal);
        totalRefunds = Math.round(weeklyTotal * 0.08);
        conversionRate = 19 + Math.round(Math.random() * 6);
        
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].type = 'bar';
        revenueChart.data.datasets[0].fill = undefined;
        revenueChart.data.datasets[0].backgroundColor = '#88B267';
        revenueChart.data.datasets[0].tension = undefined;
        
        revenueChart.data.datasets[1].type = 'line';
        revenueChart.data.datasets[1].fill = false;
        revenueChart.data.datasets[1].backgroundColor = undefined;
        revenueChart.data.datasets[1].tension = 0.4;
        
        revenueChart.options.scales.y.title.text = 'Daily Revenue ($)';
        revenueChart.options.scales.y1.title.text = 'Daily ARR ($)';
        
        revenueChart.options.plugins.annotation = {
            annotations: {
                currentDay: {
                    type: 'line',
                    xMin: currentDay,
                    xMax: currentDay,
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        content: 'Current Day',
                        enabled: true,
                        position: 'top'
                    }
                }
            }
        };
    } else if (period === 'month') {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        labels = Array.from({length: daysInMonth}, (_, i) => (i + 1).toString());
        
        const dailyData = [];
        const baseValue = Math.floor(Math.random() * 500) + 200;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayOfWeek = date.getDay();
            let dayFactor = 1;
            
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayFactor = 0.6 + Math.random() * 0.4;
            } else {
                dayFactor = 1.2 + Math.random() * 0.8;
            }
            
            const mrr = Math.round(baseValue * dayFactor);
            const arr = mrr * 12;
            
            dailyData.push({
                day,
                mrr,
                arr
            });
        }
        
        mrrData = dailyData.map(d => d.mrr);
        arrData = dailyData.map(d => d.arr / 12);
        
        const monthlyTotal = mrrData.reduce((sum, val) => sum + val, 0);
        totalOrders = Math.round(monthlyTotal / 8);
        totalEarnings = Math.round(monthlyTotal);
        totalRefunds = Math.round(monthlyTotal * 0.12);
        conversionRate = 20 + Math.round(Math.random() * 5);
        
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].type = 'bar';
        revenueChart.data.datasets[0].fill = undefined;
        revenueChart.data.datasets[0].backgroundColor = '#88B267';
        revenueChart.data.datasets[0].tension = undefined;
        
        revenueChart.data.datasets[1].type = 'line';
        revenueChart.data.datasets[1].fill = false;
        revenueChart.data.datasets[1].backgroundColor = undefined;
        revenueChart.data.datasets[1].tension = 0.4;
        
        revenueChart.options.scales.y.title.text = 'Daily Revenue ($)';
        revenueChart.options.scales.y1.title.text = 'Daily ARR ($)';
        
        const currentDate = new Date().getDate();
        revenueChart.options.plugins.annotation = {
            annotations: {
                currentDay: {
                    type: 'line',
                    xMin: currentDate - 1,
                    xMax: currentDate - 1,
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        content: 'Current Day',
                        enabled: true,
                        position: 'top'
                    }
                }
            }
        };
    } else if (period === 'year' || period === '2024') {
        const yearFilter = period === 'year' ? currentYear : 2024;
        filteredData = allData.filter(d => d.date.getFullYear() === yearFilter);
        
        const yearlyMRR = filteredData.reduce((sum, item) => sum + item.mrr, 0);
        totalOrders = Math.round(yearlyMRR / 8);
        totalEarnings = Math.round(yearlyMRR);
        totalRefunds = Math.round(yearlyMRR * 0.15);
        conversionRate = 21 + Math.round(Math.random() * 4);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = months;
        
        mrrData = Array(12).fill(null);
        arrData = Array(12).fill(null);
        
        filteredData.forEach(item => {
            const monthIndex = months.indexOf(item.shortLabel);
            if (monthIndex !== -1) {
                mrrData[monthIndex] = item.mrr;
                arrData[monthIndex] = item.arr / 12;
            }
        });
        
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].type = 'bar';
        revenueChart.data.datasets[0].fill = undefined;
        revenueChart.data.datasets[0].backgroundColor = '#88B267';
        revenueChart.data.datasets[0].tension = undefined;
        revenueChart.data.datasets[0].barPercentage = 0.5;
        revenueChart.data.datasets[0].categoryPercentage = 0.8;
        
        revenueChart.data.datasets[1].type = 'line';
        revenueChart.data.datasets[1].fill = false;
        revenueChart.data.datasets[1].backgroundColor = undefined;
        revenueChart.data.datasets[1].tension = 0.4;
        
        revenueChart.options.scales.y.title.text = 'Monthly Revenue ($)';
        revenueChart.options.scales.y1.title.text = 'Monthly Average (ARR/12) ($)';
        
        if (period === 'year') {
            revenueChart.options.plugins.annotation = {
                annotations: {
                    currentMonth: {
                        type: 'line',
                        xMin: currentMonth,
                        xMax: currentMonth,
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'Current Month',
                            enabled: true,
                            position: 'top'
                        }
                    }
                }
            };
        } else {
            revenueChart.options.plugins.annotation = {};
        }
    } else {
        labels = window.saasMetricsData.labels;
        mrrData = window.saasMetricsData.mrr;
        arrData = window.saasMetricsData.arr.map(val => val / 12);
        
        const totalMRR = mrrData.reduce((sum, val) => sum + val, 0);
        totalOrders = Math.round(totalMRR / 5);
        totalEarnings = Math.round(totalMRR);
        totalRefunds = Math.round(totalMRR * 0.18);
        conversionRate = 22 + Math.round(Math.random() * 3);
        
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].type = 'bar';
        revenueChart.data.datasets[0].fill = undefined;
        revenueChart.data.datasets[0].backgroundColor = '#88B267';
        revenueChart.data.datasets[0].tension = undefined;
        
        revenueChart.data.datasets[1].type = 'line';
        revenueChart.data.datasets[1].fill = false;
        revenueChart.data.datasets[1].backgroundColor = undefined;
        revenueChart.data.datasets[1].tension = 0.4;
        
        revenueChart.options.scales.y.title.text = 'Revenue ($)';
        revenueChart.options.scales.y1.title.text = 'Monthly Average (ARR/12) ($)';
        
        revenueChart.options.plugins.annotation = {};
    }
    
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = mrrData;
    revenueChart.data.datasets[1].data = arrData;
    
    const maxMRR = Math.max(...mrrData.filter(val => val !== null));
    const maxARR = Math.max(...arrData.filter(val => val !== null));
    const maxValue = Math.max(maxMRR, maxARR);
    
    let suggestedMax = Math.ceil(maxValue * 1.2);
    
    if (suggestedMax < 100) {
        suggestedMax = 100;
    }
    
    if (period === 'today' || period === 'week') {
        revenueChart.options.scales.y.ticks.stepSize = Math.max(1, Math.ceil(suggestedMax / 10));
        revenueChart.options.scales.y1.ticks.stepSize = Math.max(1, Math.ceil(suggestedMax / 10));
    } else {
        revenueChart.options.scales.y.ticks.stepSize = Math.max(100, Math.ceil(suggestedMax / 10));
        revenueChart.options.scales.y1.ticks.stepSize = Math.max(100, Math.ceil(suggestedMax / 10));
    }
    
    revenueChart.options.scales.y.suggestedMax = suggestedMax;
    revenueChart.options.scales.y1.suggestedMax = suggestedMax;
    
    if (period === 'today') {
        revenueChart.options.plugins.tooltip.callbacks.label = function(context) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            
            if (value === null) return 
            
            if (datasetIndex === 1) {
                return "Hourly ARR: $" + value.toLocaleString();
            }
            return "Hourly MRR: $" + value.toLocaleString();
        };
    } else if (period === 'week' || period === 'month') {
        revenueChart.options.plugins.tooltip.callbacks.label = function(context) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            
            if (value === null) return "No data";
            
            if (datasetIndex === 1) {
                return "Daily ARR: $" + value.toLocaleString();
            }
            return "Daily MRR: $" + value.toLocaleString();
        };
    } else {
        revenueChart.options.plugins.tooltip.callbacks.label = function(context) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            
            if (value === null) return "No data";
            
            if (datasetIndex === 1) {
                return "Annual: $" + (value * 12).toLocaleString();
            }
            return "Monthly: $" + value.toLocaleString();
        };
    }
    
    document.getElementById('revenueOrders').textContent = totalOrders.toLocaleString();
    document.getElementById('revenueEarnings').textContent = '$' + totalEarnings.toLocaleString();
    document.getElementById('revenueRefunds').textContent = '$' + totalRefunds.toLocaleString();
    document.getElementById('revenueConversion').textContent = conversionRate + '%';
    
    revenueChart.update();
}