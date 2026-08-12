import { EventBuilderState } from './types/event-builder';
import { getCartLines, getEstimatedTotal, getPaidExtraTotal, getRequestedExtraLines } from './builder/selectors';

const CATEGORY_LABELS: Record<string, string> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  venue: 'Venue',
  additional_services: 'Additional Services',
};

const CATERING_TIMING_LABELS: Record<string, string> = {
  morning: 'Morning (Breakfast menu)',
  afternoon: 'Afternoon (Lunch menu)',
  evening: 'Evening (Dinner menu)',
};

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function generateQuotationHTML(
  quoteId: string,
  state: EventBuilderState,
  customerName: string = 'Valued Client'
): string {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const lines = getCartLines(state);
  const requestedExtras = getRequestedExtraLines(state);
  const estimatedTotal = getEstimatedTotal(state);
  const paidExtraTotal = getPaidExtraTotal(state);

  const rowsHtml = lines
    .filter((line) => line.origin !== 'requested_extra')
    .map(
      (line) => `
          <tr>
            <td><strong>${CATEGORY_LABELS[line.categoryKey] || line.categoryKey}</strong></td>
            <td>${line.name} ${line.quantity > 1 ? `× ${line.quantity}` : ''} ${line.origin === 'paid_extra' ? '<em>(Paid Extra)</em>' : ''}</td>
            <td style="text-align: right;">${formatCurrency(line.unitPrice * line.quantity)}</td>
          </tr>`
    )
    .join('');

  const requestedRowsHtml = requestedExtras
    .map(
      (line) => `
          <tr>
            <td colspan="2"><strong>${line.name}</strong> (pending vendor approval)</td>
            <td style="text-align: right;">—</td>
          </tr>`
    )
    .join('');

  const cateringSelections = Object.values(state.cateringSelections);
  const cateringMenuRowsHtml = cateringSelections
    .map(
      (line) => `
          <tr>
            <td><strong>${line.categoryName}</strong></td>
            <td>${line.itemName}${line.quantity > 1 ? ` × ${line.quantity}` : ''}</td>
            <td style="text-align: right;">Price on request</td>
          </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>SID Events Package Summary #${quoteId}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #0B0F19;
          background-color: #ffffff;
          padding: 40px;
          margin: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #C9A227;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .brand {
          font-size: 24px;
          font-weight: bold;
          color: #0F172B;
          letter-spacing: 1px;
        }
        .brand span {
          color: #C9A227;
        }
        .meta {
          text-align: right;
          font-size: 14px;
          color: #5C4806;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0F172B;
          border-bottom: 1px solid #F0DFA0;
          padding-bottom: 6px;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 10px 12px;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid #FFF8F0;
        }
        th {
          background-color: #0F172B;
          color: #FFF8F0;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background-color: #FCF8E8;
        }
        .total-row td {
          font-weight: bold;
          font-size: 16px;
          border-top: 2px solid #0F172B;
        }
        .note-box {
          margin-top: 30px;
          background-color: #0F172B;
          color: #FFF8F0;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #C9A227;
        }
        .note-box p {
          margin: 4px 0;
          font-size: 14px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #5C4806;
          border-top: 1px dashed #C9A227;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">SID <span>EVENTS</span></div>
          <div style="font-size: 12px; color: #0F172B; margin-top: 4px;">Davanagere's #1 Event Company</div>
        </div>
        <div class="meta">
          <strong>Reference #:</strong> ${quoteId}<br />
          <strong>Date:</strong> ${dateStr}<br />
          <strong>Client:</strong> ${customerName}<br />
          <strong>Guests:</strong> ${state.eventDetails.guestCount}
          ${state.cateringTiming ? `<br /><strong>Catering Timing:</strong> ${CATERING_TIMING_LABELS[state.cateringTiming]}${state.cateringGuestCounts[state.cateringTiming] ? ` (${state.cateringGuestCounts[state.cateringTiming]} guests)` : ''}` : ''}
        </div>
      </div>

      <div class="section-title">Selected Package Summary</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Selection</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="3">No items selected yet.</td></tr>'}
          ${requestedRowsHtml}
          <tr class="total-row">
            <td colspan="2">Estimated Total${paidExtraTotal > 0 ? ' (includes paid extras)' : ''}</td>
            <td style="text-align: right;">${formatCurrency(estimatedTotal)}</td>
          </tr>
        </tbody>
      </table>

      ${cateringSelections.length > 0 ? `
      <div class="section-title">Catering Menu Selections</div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Dish</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${cateringMenuRowsHtml}
        </tbody>
      </table>
      ` : ''}

      <div class="note-box">
        <p><strong>This is an estimate, not a final invoice.</strong></p>
        <p>Our team will confirm final pricing and availability once you submit your enquiry.</p>
      </div>

      <div class="footer">
        <p>Thank you for choosing SID Events.</p>
        <p>Contact Us: +91 80954 08404 | sideventsdvg@gmail.com</p>
      </div>
    </body>
    </html>
  `;
}

export function downloadQuotationPDF(quoteId: string, state: EventBuilderState, customerName?: string) {
  const htmlContent = generateQuotationHTML(quoteId, state, customerName);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
