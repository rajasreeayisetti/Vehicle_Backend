const PDFDocument = require('pdfkit');
const fs = require('fs');
const generateInvoice = (booking, vehicle, customer, filePath) => {
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));
    // Registration number fallback
    const regNo = vehicle.regNumber || (`DE-` + String(vehicle._id).slice(-6).toUpperCase());
    // Calculate Days
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const bookingDateStr = booking.createdAt 
        ? new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const startDateStr = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const endDateStr = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    // Primary Color: #2563eb (DriveEase Blue)
    const primaryColor = '#2563eb';
    const darkTextColor = '#1e293b';
    const lightGray = '#f8fafc';
    const borderColor = '#cbd5e1';
    // Top Header Banner
    doc.rect(50, 40, 512, 60).fill(primaryColor);
    doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('DriveEase', 70, 52);
    doc.fontSize(12).font('Helvetica').text('CAR RENTAL RECEIPT & INVOICE', 70, 78);
    // Invoice Meta (Top Right)
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text(`RECEIPT #: ${String(booking._id).slice(-8).toUpperCase()}`, 380, 55, { align: 'right', width: 160 });
    doc.text(`Date: ${bookingDateStr}`, 380, 72, { align: 'right', width: 160 });
    doc.moveDown(3);
    // Section 1: Customer & Booking Info Box
    const startY = 120;
    doc.rect(50, startY, 512, 85).fillAndStroke(lightGray, borderColor);
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('CUSTOMER & BOOKING DETAILS', 65, startY + 12);
    doc.fillColor(darkTextColor).fontSize(10).font('Helvetica');
    doc.text(`Customer Name: ${customer.name || 'N/A'}`, 65, startY + 32);
    doc.text(`Email: ${customer.email || 'N/A'}`, 65, startY + 48);
    doc.text(`Phone: ${customer.phone || 'N/A'}`, 65, startY + 64);
    doc.text(`Booking ID: ${booking._id}`, 310, startY + 32);
    doc.text(`Booking Date: ${bookingDateStr}`, 310, startY + 48);
    doc.text(`Payment Status: ${booking.paymentStatus || 'Paid'}`, 310, startY + 64);
    // Section 2: Vehicle & Rental Details Box
    const vehicleY = 220;
    doc.rect(50, vehicleY, 512, 100).fillAndStroke(lightGray, borderColor);
    doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('VEHICLE & RENTAL DATES', 65, vehicleY + 12);
    doc.fillColor(darkTextColor).fontSize(10).font('Helvetica');
    doc.text(`Vehicle Name / Model: ${vehicle.vehicleName} (${vehicle.vehicleType})`, 65, vehicleY + 32);
    doc.text(`Registration Number: ${regNo}`, 65, vehicleY + 48);
    doc.text(`Rental Duration: ${days} Day(s)`, 65, vehicleY + 64);
    doc.text(`Pick-up Date: ${startDateStr}`, 310, vehicleY + 32);
    doc.text(`Return Date: ${endDateStr}`, 310, vehicleY + 48);
    // Section 3: Billing Table
    const tableY = 340;
    // Table Header
    doc.rect(50, tableY, 512, 25).fill(primaryColor);
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('Item Description', 65, tableY + 7);
    doc.text('Rate / Day', 280, tableY + 7);
    doc.text('Days', 380, tableY + 7);
    doc.text('Amount', 480, tableY + 7, { align: 'right', width: 70 });  
    // Table Row
    const rowY = tableY + 25;
    doc.rect(50, rowY, 512, 35).fillAndStroke('#ffffff', borderColor);
    doc.fillColor(darkTextColor).fontSize(10).font('Helvetica');
    doc.text(`Vehicle Rental - ${vehicle.vehicleName}`, 65, rowY + 10);
    doc.text(`INR ${vehicle.pricePerDay}`, 280, rowY + 10);
    doc.text(`${days}`, 380, rowY + 10);
    doc.text(`INR ${booking.totalAmount}`, 480, rowY + 10, { align: 'right', width: 70 });
    // Total Amount Box
    const totalY = rowY + 45;
    doc.rect(310, totalY, 252, 45).fillAndStroke('#dcfce7', '#166534');
    doc.fillColor('#166534').fontSize(12).font('Helvetica-Bold');
    doc.text('TOTAL AMOUNT PAID:', 320, totalY + 15);
    doc.text(`INR ${booking.totalAmount}`, 440, totalY + 15, { align: 'right', width: 110 });
    // Payment Status Stamp / Badge
    doc.rect(65, totalY, 120, 35).fillAndStroke('#dcfce7', '#166534');
    doc.fillColor('#166534').fontSize(14).font('Helvetica-Bold').text('PAID IN FULL', 75, totalY + 10);
    // Footer
    const footerY = 520;
    doc.font('Helvetica').fontSize(10).fillColor('#64748b');
    doc.text('Thank you for choosing DriveEase!', 50, footerY, { align: 'center', width: 512 });
    doc.text('For support or queries, contact support@driveease.com', 50, footerY + 15, { align: 'center', width: 512 });
    doc.end();
};
module.exports = generateInvoice;
