export function createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (canvas && typeof Chart !== 'undefined') {
        return new Chart(canvas, config);
    }
    return null;
}

export const chartConfigs = {
    getRevenueChartConfig() {
        return {
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
                                
                                if (datasetIndex === 1) {
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
    },
    
    getAgeChartConfig() {
        return {
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
        };
    },
    
    getGenderChartConfig() {
        return {
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
        };
    },
    
    getDiscountChartConfig() {
        return {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: "Discount",
                        data: [10, 15, 8, 12, 7, 16, 9, 6, 14, 11, 9, 13],
                        borderColor: "#F2A52B",
                        backgroundColor: "rgba(242, 165, 43, 0.2)",
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
                    y: { beginAtZero: true, grid: { display: true } },
                    x: { grid: { display: false } },
                },
            },
        };
    }
};