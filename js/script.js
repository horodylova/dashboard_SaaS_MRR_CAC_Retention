
// Wait for DOM and Chart.js to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    initQuantitySpinner();

    // Initialize all charts
    initCharts();


    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
        slidesPerView: 3,
        spaceBetween: 20,
        autoplay: true,
        direction: "vertical",
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    var large_slider = new Swiper(".product-large-slider", {
        slidesPerView: 1,
        autoplay: true,
        spaceBetween: 0,
        effect: 'fade',
        thumbs: {
            swiper: thumb_slider,
        },
    });

});

// Toggle sidebar
document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('hidden');
    document.getElementById('content').classList.toggle('expanded');
});

// Toggle sidebar
document.getElementById('sidebarclose').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('hidden');
    document.getElementById('content').classList.toggle('expanded');
});

// Make sidebar links active when clicked
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});



function initCharts() {
    const revenueChartConfig = {
        type: "bar",
        data: {
            labels: window.saasMetricsData ? window.saasMetricsData.labels.slice(0, 12) : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Monthly Recurring Revenue",
                    data: window.saasMetricsData ? window.saasMetricsData.mrr.slice(0, 12) : [753, 291, 847, 502, 134, 921, 678, 435, 998, 210, 567, 89],
                    backgroundColor: "#88B267",
                    borderColor: "#88B267",
                    borderWidth: 1,
                    order: 2
                },
                {
                    label: "Annual Recurring Revenue",
                    data: window.saasMetricsData ? window.saasMetricsData.arr.slice(0, 12).map(val => val / 12) : [753, 291, 847, 502, 134, 921, 678, 435, 998, 210, 567, 89],
                    borderColor: "#65A1CB",
                    backgroundColor: "#E1F0FA",
                    borderWidth: 2,
                    type: "line",
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1',
                    order: 1
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: true, position: "top" },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const datasetIndex = context.datasetIndex;
                            const value = context.raw;
                            
                            if (value === null) return "No data";
                            
                            if (datasetIndex === 1) { // ARR dataset
                                return "Annual: $" + (value * 12).toLocaleString();
                            }
                            return "Monthly: $" + value.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    suggestedMax: 10000,
                    ticks: {
                        callback: function(value) {
                            return "$" + value.toLocaleString();
                        },
                        stepSize: 1000
                    },
                    title: {
                        display: true,
                        text: 'Monthly Revenue'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    suggestedMax: 10000,
                    ticks: {
                        callback: function(value) {
                            return "$" + value.toLocaleString();
                        },
                        stepSize: 1000
                    },
                    title: {
                        display: true,
                        text: 'Monthly Average (ARR/12)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: { grid: { display: false } },
            },
        },
    };

    createChart("revenueChart", revenueChartConfig);
    
    // Add event listeners for dropdown items
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const period = this.getAttribute('data-period');
            const dropdownButton = document.getElementById('revenueDropdown');
            dropdownButton.textContent = this.textContent;
            
            updateRevenueChart(period);
        });
    });

    createChart("ageChart", {
        type: "doughnut",
        data: {
            labels: ["18-25", "25-30", "30-40", "40-60", "11-18"],
            datasets: [
                {
                    data: [25, 30, 20, 15, 20],
                    backgroundColor: ["#80BE4D", "#4699D3", "#F2D226", "#BC86E7", "#F2A52B"],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "15%",
            plugins: { legend: { position: "bottom" } },
        },
    });

    createChart("genderChart", {
        type: "doughnut",
        data: {
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [65, 35],
                    backgroundColor: ["#F28D6D", "#A4D4EF"],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "15%",
            plugins: { legend: { position: "bottom" } },
        },
    });

    createChart("discountChart", {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "Discount Sales",
                    data: [500, 100, 200, 400, 300, 800],
                    borderColor: "#88B267",
                    backgroundColor: "#EEF3E9",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } },
            },
        },
    });
}

function createChart(id, config) {
    const ctx = document.getElementById(id);
    if (!ctx) {
        console.error(`Canvas element with id '${id}' not found`);
        return;
    }

    if (ctx.chart) {
        ctx.chart.destroy();
    }

    ctx.chart = new Chart(ctx, config);
}

function initQuantitySpinner() {
    const productQtyElements = document.querySelectorAll('.product-qty');

    productQtyElements.forEach(function (productEl) {
      const quantityInput = productEl.querySelector('.quantity');
      const plusButton = productEl.querySelector('.quantity-right-plus');
      const minusButton = productEl.querySelector('.quantity-left-minus');

      plusButton.addEventListener('click', function (e) {
        e.preventDefault();
        let quantity = parseInt(quantityInput.value) || 0;
        quantityInput.value = quantity + 1;
      });

      minusButton.addEventListener('click', function (e) {
        e.preventDefault();
        let quantity = parseInt(quantityInput.value) || 0;
        if (quantity > 0) {
          quantityInput.value = quantity - 1;
        }
      });
    });
  }


function updateRevenueChart(period) {
    if (!window.saasMetricsData) return;
    
    const revenueChart = document.getElementById('revenueChart').chart;
    if (!revenueChart) return;
    
    let labels = [];
    let mrrData = [];
    let arrData = [];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    // Get all data with dates for easier filtering
    const allData = window.saasMetricsData.labels.map((label, index) => {
        const [month, year] = label.split(' ');
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        return {
            label,
            shortLabel: month,
            date: new Date(parseInt(year), monthIndex, 15), // Middle of month as reference
            mrr: window.saasMetricsData.mrr[index],
            arr: window.saasMetricsData.arr[index]
        };
    });
    
    // Filter data based on selected period
    let filteredData = [];
    let isSmallPeriod = false; // Flag for day/week periods with small values
    
    if (period === 'today') {
        isSmallPeriod = true;
        // For demo purposes, generate daily data for current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthData = allData.find(d => 
            d.date.getMonth() === currentMonth && 
            d.date.getFullYear() === currentYear
        );
        
        if (monthData) {
            // Generate daily values based on the month's data
            const baseMRR = monthData.mrr / daysInMonth;
            const baseARR = monthData.arr / daysInMonth;
            
            // Create data for each hour of the current day
            for (let hour = 0; hour < 24; hour += 2) {
                const hourLabel = `${hour}:00`;
                const variation = 0.9 + (Math.random() * 0.2); // 0.9-1.1 variation
                
                labels.push(hourLabel);
                mrrData.push(Math.round(baseMRR * variation / 24 * 2));
                arrData.push(Math.round(baseARR * variation / 24 * 2));
            }
        }
    } else if (period === 'week') {
        isSmallPeriod = true;
        // For demo purposes, generate weekly data for current month
        const monthData = allData.find(d => 
            d.date.getMonth() === currentMonth && 
            d.date.getFullYear() === currentYear
        );
        
        if (monthData) {
            // Generate weekly values based on the month's data
            const baseMRR = monthData.mrr / 4; // Approx 4 weeks in a month
            const baseARR = monthData.arr / 4;
            
            const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            
            // Create data for each day of the week
            weekDays.forEach(day => {
                const variation = 0.85 + (Math.random() * 0.3); // 0.85-1.15 variation
                
                labels.push(day);
                mrrData.push(Math.round(baseMRR * variation / 7));
                arrData.push(Math.round(baseARR * variation / 7));
            });
        }
    } else if (period === 'month') {
        // Get current month data
        const monthData = allData.find(d => 
            d.date.getMonth() === currentMonth && 
            d.date.getFullYear() === currentYear
        );
        
        if (monthData) {
            // Generate daily values for current month
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const baseMRR = monthData.mrr / daysInMonth;
            const baseARR = monthData.arr / daysInMonth;
            
            // Create data for each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const variation = 0.9 + (Math.random() * 0.2); // 0.9-1.1 variation
                
                labels.push(day.toString());
                mrrData.push(Math.round(baseMRR * variation));
                arrData.push(Math.round(baseARR * variation));
            }
        }
    } else if (period === 'year') {
        // Filter current year data
        filteredData = allData.filter(d => d.date.getFullYear() === currentYear);
        
        // For months that don't have data yet, add null values
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = months;
        
        // Initialize arrays with null values
        mrrData = Array(12).fill(null);
        arrData = Array(12).fill(null);
        
        // Fill in available data
        filteredData.forEach(item => {
            const monthIndex = months.indexOf(item.shortLabel);
            if (monthIndex !== -1) {
                mrrData[monthIndex] = item.mrr;
                arrData[monthIndex] = item.arr / 12;
            }
        });
    } else if (period === '2024') {
        // Filter 2024 data
        filteredData = allData.filter(d => d.date.getFullYear() === 2024);
        
        // Use month names as labels
        labels = filteredData.map(item => item.shortLabel);
        mrrData = filteredData.map(item => item.mrr);
        arrData = filteredData.map(item => item.arr / 12);
    } else if (period === '2025') {
        // Filter 2025 data
        filteredData = allData.filter(d => d.date.getFullYear() === 2025);
        
        // For months that don't have data yet, add null values
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = months;
        
        // Initialize arrays with null values
        mrrData = Array(12).fill(null);
        arrData = Array(12).fill(null);
        
        // Fill in available data
        filteredData.forEach(item => {
            const monthIndex = months.indexOf(item.shortLabel);
            if (monthIndex !== -1) {
                mrrData[monthIndex] = item.mrr;
                arrData[monthIndex] = item.arr / 12;
            }
        });
    } else {
        // Default to showing all data
        labels = window.saasMetricsData.labels;
        mrrData = window.saasMetricsData.mrr;
        arrData = window.saasMetricsData.arr.map(val => val / 12);
    }
    
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = mrrData;
    revenueChart.data.datasets[1].data = arrData;
    
    // Adjust y-axis scale based on actual data
    const maxMRR = Math.max(...mrrData.filter(val => val !== null));
    const maxARR = Math.max(...arrData.filter(val => val !== null));
    const maxValue = Math.max(maxMRR, maxARR);
    
    // Set both axes to have similar scale for better comparison
    let suggestedMax;
    
    if (isSmallPeriod) {
        // For day and week views, use a much smaller scale
        suggestedMax = Math.ceil(maxValue * 1.2 / 10) * 10;
        
        // Update step size for smaller values
        revenueChart.options.scales.y.ticks.stepSize = Math.max(1, Math.ceil(suggestedMax / 10));
        revenueChart.options.scales.y1.ticks.stepSize = Math.max(1, Math.ceil(suggestedMax / 10));
        
        // Update chart type for small periods to make it more readable
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].type = undefined; // Use the chart's default type
        revenueChart.data.datasets[1].type = 'line';
        
        // Make bars wider for better visibility
        revenueChart.data.datasets[0].barPercentage = 0.8;
        revenueChart.data.datasets[0].categoryPercentage = 0.9;
        
        // Update tooltips for small values
        revenueChart.options.plugins.tooltip.callbacks.label = function(context) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            
            if (value === null) return "No data";
            
            if (datasetIndex === 1) { // ARR dataset
                return "Daily ARR: $" + value.toLocaleString();
            }
            return "Daily MRR: $" + value.toLocaleString();
        };
    } else {
        // For month/year views, use the original scale
        suggestedMax = Math.ceil(maxValue * 1.2 / 1000) * 1000;
        
        // Reset step size for larger values
        revenueChart.options.scales.y.ticks.stepSize = Math.max(100, Math.ceil(suggestedMax / 10));
        revenueChart.options.scales.y1.ticks.stepSize = Math.max(100, Math.ceil(suggestedMax / 10));
        
        // Reset chart type for larger periods
        revenueChart.config.type = 'bar';
        revenueChart.data.datasets[0].type = undefined; // Use the chart's default type
        revenueChart.data.datasets[1].type = 'line';
        
        // Reset bar width
        revenueChart.data.datasets[0].barPercentage = 0.5;
        revenueChart.data.datasets[0].categoryPercentage = 0.8;
        
        // Reset tooltips for normal values
        revenueChart.options.plugins.tooltip.callbacks.label = function(context) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            
            if (value === null) return "No data";
            
            if (datasetIndex === 1) { // ARR dataset
                return "Annual: $" + (value * 12).toLocaleString();
            }
            return "Monthly: $" + value.toLocaleString();
        };
    }
    
    revenueChart.options.scales.y.suggestedMax = suggestedMax;
    revenueChart.options.scales.y1.suggestedMax = suggestedMax;
    
    // Update axis titles based on period
    if (period === 'today') {
        revenueChart.options.scales.y.title.text = 'Hourly Revenue';
        revenueChart.options.scales.y1.title.text = 'Hourly Average (ARR/365/24)';
    } else if (period === 'week') {
        revenueChart.options.scales.y.title.text = 'Daily Revenue';
        revenueChart.options.scales.y1.title.text = 'Daily Average (ARR/365)';
    } else if (period === 'month') {
        revenueChart.options.scales.y.title.text = 'Daily Revenue';
        revenueChart.options.scales.y1.title.text = 'Daily Average (ARR/365)';
    } else {
        revenueChart.options.scales.y.title.text = 'Monthly Revenue';
        revenueChart.options.scales.y1.title.text = 'Monthly Average (ARR/12)';
    }
    
    revenueChart.update();
}
