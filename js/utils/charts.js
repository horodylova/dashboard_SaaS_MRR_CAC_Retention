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
    }
};