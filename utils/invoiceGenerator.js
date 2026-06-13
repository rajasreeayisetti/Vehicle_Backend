const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice = (booking, vehicle, customer, path) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path));

    doc.fontSize(25).text('DriveEase Invoice', 100, 80);
    doc.fontSize(12).text(`Invoice date: ${new Date().toLocaleDateString()}`, 100, 110);
    doc.text(`Booking ID: ${booking._id}`, 100, 125);

    doc.moveDown();
    doc.text(`Customer Name: ${customer.name}`);
    doc.text(`Vehicle: ${vehicle.vehicleName} (${vehicle.vehicleType})`);
    doc.text(`Rental Period: ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`);

    doc.moveDown();
    doc.fontSize(18).text(`Total Amount Paid: $${booking.totalAmount}`, { bold: true });

    doc.moveDown();
    doc.text('Thank you for choosing DriveEase!', { align: 'center' });

    doc.end();
};

module.exports = generateInvoice;
