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
        retention: [],
        orders: [],
        customers: [],
        balance: []
    };
    
    let baseCustomers = 100;
    let baseMRR = 5000;
    let baseOrders = 1000;
    let baseBalance = 8000;
    
    for (let year = 2024; year <= 2025; year++) {
        const monthLimit = year === 2025 ? 6 : 12;
        
        for (let month = 0; month < monthLimit; month++) {
            const label = `${months[month]} ${year}`;
            data.labels.push(label);
            
            const growthFactor = 1 + (Math.random() * 0.08 - 0.01);
            baseCustomers = Math.floor(baseCustomers * growthFactor);
            baseMRR = Math.floor(baseMRR * growthFactor);
            baseOrders = Math.floor(baseOrders * growthFactor);
            baseBalance = Math.floor(baseBalance * growthFactor);
            
            const mrr = baseMRR + Math.floor(Math.random() * 500 - 200);
            const arr = mrr * 12;
            const churnRate = Math.random() * 0.03 + 0.01;
            const cac = Math.floor(Math.random() * 300 + 100);
            const retention = Math.random() * 0.15 + 0.8;
            const orders = baseOrders + Math.floor(Math.random() * 200 - 100);
            const customers = baseCustomers + Math.floor(Math.random() * 50 - 20);
            const balance = baseBalance + Math.floor(Math.random() * 1000 - 500);
            
            data.mrr.push(mrr);
            data.arr.push(arr);
            data.churnRate.push(churnRate);
            data.cac.push(cac);
            data.retention.push(retention);
            data.orders.push(orders);
            data.customers.push(customers);
            data.balance.push(balance);
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
        
        const totalOrders = window.saasMetricsData.orders.reduce((sum, current) => sum + current, 0);
        
        const formattedOrders = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(totalOrders);
        
        const firstOrderMonth = window.saasMetricsData.orders[0];
        const lastOrderMonth = window.saasMetricsData.orders[window.saasMetricsData.orders.length - 1];
        const ordersGrowthPercent = Math.round((lastOrderMonth - firstOrderMonth) / firstOrderMonth * 100);
        
        const totalOrdersElement = document.getElementById('totalOrders');
        const ordersChangeElement = document.getElementById('ordersChange');
        
        if (totalOrdersElement) {
            totalOrdersElement.textContent = formattedOrders;
        }
        
        if (ordersChangeElement) {
            const prefix = ordersGrowthPercent >= 0 ? '+' : '';
            ordersChangeElement.textContent = `${prefix}${ordersGrowthPercent}%`;
            ordersChangeElement.className = ordersGrowthPercent >= 0 ? 'change text-success fs-4' : 'change text-danger fs-4';
        }
        
        const totalCustomers = window.saasMetricsData.customers.reduce((sum, current) => sum + current, 0);
        
        const formattedCustomers = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(totalCustomers);
        
        const firstCustomerMonth = window.saasMetricsData.customers[0];
        const lastCustomerMonth = window.saasMetricsData.customers[window.saasMetricsData.customers.length - 1];
        const customersGrowthPercent = Math.round((lastCustomerMonth - firstCustomerMonth) / firstCustomerMonth * 100);
        
        const totalCustomersElement = document.getElementById('totalCustomers');
        const customersChangeElement = document.getElementById('customersChange');
        
        if (totalCustomersElement) {
            totalCustomersElement.textContent = formattedCustomers;
        }
        
        if (customersChangeElement) {
            const prefix = customersGrowthPercent >= 0 ? '+' : '';
            customersChangeElement.textContent = `${prefix}${customersGrowthPercent}%`;
            customersChangeElement.className = customersGrowthPercent >= 0 ? 'change text-success fs-4' : 'change text-danger fs-4';
        }
        
        const totalBalance = window.saasMetricsData.balance.reduce((sum, current) => sum + current, 0);
        
        const formattedBalance = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(totalBalance);
        
        const firstBalanceMonth = window.saasMetricsData.balance[0];
        const lastBalanceMonth = window.saasMetricsData.balance[window.saasMetricsData.balance.length - 1];
        const balanceGrowthPercent = Math.round((lastBalanceMonth - firstBalanceMonth) / firstBalanceMonth * 100);
        
        const totalBalanceElement = document.getElementById('totalBalance');
        const balanceChangeElement = document.getElementById('balanceChange');
        
        if (totalBalanceElement) {
            totalBalanceElement.textContent = formattedBalance;
        }
        
        if (balanceChangeElement) {
            const prefix = balanceGrowthPercent >= 0 ? '+' : '';
            balanceChangeElement.textContent = `${prefix}${balanceGrowthPercent}%`;
            balanceChangeElement.className = balanceGrowthPercent >= 0 ? 'change text-success fs-4' : balanceGrowthPercent < 0 ? 'change text-danger fs-4' : 'change text-black-50 fs-4';
        }
    }
});

export { generateSaaSMetricsData };