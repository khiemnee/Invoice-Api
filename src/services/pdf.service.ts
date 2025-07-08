import puppeteer from 'puppeteer';
import { Invoice } from '../entity/Invoice';


export const renderInvoiceHtml = (invoice: Invoice) => {
  const itemsHtml = invoice.items.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()} VND</td>
      <td>${(item.quantity * item.price).toLocaleString()} VND</td>
    </tr>
  `).join('');


  return `
    <div>
      <h2>Invoice</h2>
      <p><strong>Invoice ID:</strong> ${invoice.id}</p>
      <p><strong>Client:</strong> ${invoice.client?.name || 'N/A'}</p>
      <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toDateString()}</p>
      <p><strong>Status:</strong> ${invoice.status}</p>

      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p><strong>Total Amount:</strong> ${invoice.totalAmount.toLocaleString()} VND</p>
    </div>
  `;
}

export const generateInvoicePDF = async (invoice: Invoice) => {
  const html = renderInvoiceHtml(invoice);

  const browser = await puppeteer.launch({
   headless : 'shell'
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
   
  });

  await browser.close();
  return pdfBuffer;
}
