import * as sgMail from "@sendgrid/mail";
import { Invoice } from "../entity/Invoice";
import { Client } from "../entity/Client";
import { emailApiKey } from "../secret";

export const sendEmail = async (invoice: Invoice, client: Client) => {



  sgMail.setApiKey(emailApiKey);

  const itemsHtml = invoice.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()} VND</td>
      <td>${(item.quantity * item.price).toLocaleString()} VND</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <div>
      <h2>Invoice</h2>
      <p><strong>Invoice ID:</strong> ${invoice.id}</p>
      <p><strong>Client:</strong> ${client.name || "N/A"}</p>
      <p><strong>Due Date:</strong> ${new Date(
        invoice.dueDate
      ).toDateString()}</p>
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

  const msg = {
    to: client.email,
    from: "khiemdeptrai2911@gmail.com",
    subject: "Invoice",
    html,
  };
  await sgMail.send(msg);
};
