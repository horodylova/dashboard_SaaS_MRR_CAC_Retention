
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
    
    if (period === '2024') {
        // Filter data for 2024 only
        const year2024Data = window.saasMetricsData.labels
            .map((label, index) => ({ 
                label, 
                mrr: window.saasMetricsData.mrr[index],
                arr: window.saasMetricsData.arr[index]
            }))
            .filter(item => item.label.includes('2024'));
        
        labels = year2024Data.map(item => item.label.split(' ')[0]); // Just month name
        mrrData = year2024Data.map(item => item.mrr);
        arrData = year2024Data.map(item => item.arr.map(val => val / 12));
    } else {
        // Default to showing all data or implement other period filters
        labels = window.saasMetricsData.labels.slice(0, 12);
        mrrData = window.saasMetricsData.mrr.slice(0, 12);
        arrData = window.saasMetricsData.arr.slice(0, 12).map(val => val / 12);
    }
    
    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = mrrData;
    revenueChart.data.datasets[1].data = arrData;
    
    // Adjust y-axis scale based on actual data
    const maxMRR = Math.max(...mrrData);
    const maxARR = Math.max(...arrData);
    const maxValue = Math.max(maxMRR, maxARR);
    
    // Set both axes to have similar scale for better comparison
    const suggestedMax = Math.ceil(maxValue * 1.2 / 1000) * 1000;
    
    revenueChart.options.scales.y.suggestedMax = suggestedMax;
    revenueChart.options.scales.y1.suggestedMax = suggestedMax;
    
    revenueChart.update();
}
