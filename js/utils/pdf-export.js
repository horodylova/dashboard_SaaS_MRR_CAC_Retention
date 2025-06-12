export function initPdfExport() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', exportToPdf);
    }
}

export async function exportToPdf() {
    const { jsPDF } = window.jspdf;
    
    try {
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;
        const contentWidth = pageWidth - 2 * margin;
        
        pdf.setFontSize(18);
        pdf.text("Dashboard Report", margin, margin);
        pdf.setFontSize(12);
        pdf.text("Generated on: " + new Date().toLocaleString(), margin, margin + 20);
        
        let currentY = margin + 50;
        
        const statCards = document.querySelector('.row:first-of-type');
        if (statCards) {
            const canvas = await html2canvas(statCards, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 20;
        }
        
        if (currentY > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
        }
        
        const revenueSection = document.querySelector('.card');
        if (revenueSection) {
            pdf.setFontSize(14);
            pdf.text("Revenue Data", margin, currentY);
            currentY += 20;
            
            const canvas = await html2canvas(revenueSection, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (currentY + imgHeight > pageHeight - margin) {
                pdf.addPage();
                currentY = margin;
            }
            
            pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 20;
        }
        
        if (window.saasMetricsData) {
            if (currentY + 300 > pageHeight - margin) {
                pdf.addPage();
                currentY = margin;
            }
            
            pdf.setFontSize(14);
            pdf.text("Complete Data Table", margin, currentY);
            currentY += 20;
            
            const headers = ['Month', 'MRR', 'ARR', 'Orders', 'Customers', 'Balance'];
            const columnWidths = [80, 80, 80, 80, 80, 80];
            const rowHeight = 20;
            
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, currentY, contentWidth, rowHeight, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            
            let xOffset = margin;
            headers.forEach((header, i) => {
                pdf.text(header, xOffset + 5, currentY + 14);
                xOffset += columnWidths[i];
            });
            
            currentY += rowHeight;
            
            pdf.setFontSize(9);
            
            const { labels, mrr, arr, orders, customers, balance } = window.saasMetricsData;
            
            const rowCount = Math.min(labels.length, 18);
            
            for (let i = 0; i < rowCount; i++) {
                if (currentY + rowHeight > pageHeight - margin) {
                    pdf.addPage();
                    currentY = margin;
                    
                    pdf.setFillColor(240, 240, 240);
                    pdf.rect(margin, currentY, contentWidth, rowHeight, 'F');
                    pdf.setTextColor(0, 0, 0);
                    pdf.setFontSize(10);
                    
                    xOffset = margin;
                    headers.forEach((header, i) => {
                        pdf.text(header, xOffset + 5, currentY + 14);
                        xOffset += columnWidths[i];
                    });
                    
                    currentY += rowHeight;
                    pdf.setFontSize(9);
                }
                
                if (i % 2 === 1) {
                    pdf.setFillColor(248, 248, 248);
                    pdf.rect(margin, currentY, contentWidth, rowHeight, 'F');
                }
                
                xOffset = margin;
                
                pdf.text(labels[i], xOffset + 5, currentY + 14);
                xOffset += columnWidths[0];
                
                pdf.text('$' + mrr[i].toLocaleString(), xOffset + 5, currentY + 14);
                xOffset += columnWidths[1];
                
                pdf.text('$' + arr[i].toLocaleString(), xOffset + 5, currentY + 14);
                xOffset += columnWidths[2];
                
                pdf.text(orders[i].toLocaleString(), xOffset + 5, currentY + 14);
                xOffset += columnWidths[3];
                
                pdf.text(customers[i].toLocaleString(), xOffset + 5, currentY + 14);
                xOffset += columnWidths[4];
                
                pdf.text('$' + balance[i].toLocaleString(), xOffset + 5, currentY + 14);
                
                currentY += rowHeight;
            }
        }
        
        pdf.save('dashboard_report.pdf');
    } catch (error) {
        console.error('Error creating PDF:', error);
        alert('An error occurred while creating the PDF');
    }
}