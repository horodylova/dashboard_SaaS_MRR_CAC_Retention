function generateSaaSMetricsData() {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const data = {
        labels: [],
        mrr: [],
        arr: [],
        churnRate: [],
        cac: [],
        retention: []
    };
    
    let baseCustomers = 100;
    let baseMRR = 5000;
    
    for (let year = 2024; year <= 2025; year++) {
        const monthLimit = year === 2025 ? 6 : 12;
        
        for (let month = 0; month < monthLimit; month++) {
            const label = `${months[month]} ${year}`;
            data.labels.push(label);
            
            const growthFactor = 1 + (Math.random() * 0.08 - 0.01);
            baseCustomers = Math.floor(baseCustomers * growthFactor);
            baseMRR = Math.floor(baseMRR * growthFactor);
            
            const mrr = baseMRR + Math.floor(Math.random() * 500 - 200);
            const arr = mrr * 12;
            const churnRate = Math.random() * 0.03 + 0.01;
            const cac = Math.floor(Math.random() * 300 + 100);
            const retention = Math.random() * 0.15 + 0.8;
            
            data.mrr.push(mrr);
            data.arr.push(arr);
            data.churnRate.push(churnRate);
            data.cac.push(cac);
            data.retention.push(retention);
        }
    }
    
    return data;
}

window.saasMetricsData = generateSaaSMetricsData();

document.addEventListener('DOMContentLoaded', function() {
    if (window.saasMetricsData) {
        const totalMRR = window.saasMetricsData.mrr.reduce((sum, current) => sum + current, 0);
        
        const formattedTotal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(totalMRR);
        
        const firstMonth = window.saasMetricsData.mrr[0];
        const lastMonth = window.saasMetricsData.mrr[window.saasMetricsData.mrr.length - 1];
        const growthPercent = Math.round((lastMonth - firstMonth) / firstMonth * 100);
        
        const totalEarningsElement = document.getElementById('totalEarnings');
        const earningsChangeElement = document.getElementById('earningsChange');
        
        if (totalEarningsElement) {
            totalEarningsElement.textContent = formattedTotal;
        }
        
        if (earningsChangeElement) {
            earningsChangeElement.textContent = `+${growthPercent}%`;
        }
        
        if (typeof initCharts === 'function') {
            initCharts();
        }
    }
});