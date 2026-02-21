
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import type { Gig } from '../types';

interface ReceiptModalProps {
  gig: Gig;
  onClose: () => void;
}

const ReceiptModal: React.FC<receiptmodalprops> = ({ gig, onClose }) => {
  const receiptRef = useRef<htmldivelement>(null);

  const laborCost = gig.jobCost || 0;
  const expensesTotal = (gig.expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const subtotal = laborCost + expensesTotal;
  const taxRate = gig.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleDownload = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, { scale: 3, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `receipt-${gig.clientName.replace(/\s+/g, '-')}-${gig.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div style="{{" position:="" 'fixed',="" inset:="" 0,="" backgroundcolor:="" 'rgba(0,0,0,0.85)',="" display:="" 'flex',="" alignitems:="" 'center',="" justifycontent:="" 'center',="" zindex:="" 100,="" padding:="" '1rem'="" }}="" onclick="{onClose}">
      <div style="{{" backgroundcolor:="" 'white',="" maxwidth:="" '600px',="" width:="" '100%',="" borderradius:="" '1rem',="" overflow:="" 'hidden',="" boxshadow:="" '0="" 25px="" 50px="" -12px="" rgba(0,="" 0,="" 0,="" 0.5)'="" }}="" onclick="{e" ==""> e.stopPropagation()}>
        <div style="{{" padding:="" '0',="" overflowy:="" 'auto',="" maxheight:="" '85vh'="" }}="">
          <div ref="{receiptRef}" style="{{" padding:="" '2.5rem',="" color:="" '#111827',="" backgroundcolor:="" 'white'="" }}="">
            <div style="{{" display:="" 'flex',="" justifycontent:="" 'space-between',="" alignitems:="" 'flex-start',="" borderbottom:="" '3px="" solid="" #111827',="" paddingbottom:="" '1.5rem',="" marginbottom:="" '2rem'="" }}="">
              <div>
                <h1 style="{{" fontsize:="" '2.5rem',="" fontweight:="" 900,="" margin:="" 0,="" letterspacing:="" '-0.025em'="" }}="">RECEIPT</h1>
                <p style="{{" color:="" '#6b7280',="" margin:="" '0.25rem="" 0="" 0="" 0',="" fontsize:="" '0.875rem'="" }}="">My GiG Jobs Official Document</p>
              </div>
              <div style="{{" textalign:="" 'right'="" }}="">
                <p style="{{" fontweight:="" 700,="" margin:="" 0="" }}="">Date: {new Date(gig.date.replace(/-/g, '/')).toLocaleDateString()}</p>
                <p style="{{" fontsize:="" '0.75rem',="" color:="" '#9ca3af',="" margin:="" 0="" }}="">REF: {gig.id.substring(0,8).toUpperCase()}</p>
              </div>
            </div>

            <div style="{{" marginbottom:="" '2rem'="" }}="">
              <p style="{{" fontsize:="" '0.75rem',="" fontweight:="" 800,="" color:="" '#9ca3af',="" texttransform:="" 'uppercase',="" marginbottom:="" '0.5rem'="" }}="">Bill To:</p>
              <h2 style="{{" fontsize:="" '1.25rem',="" fontweight:="" 800,="" margin:="" 0="" }}="">{gig.clientName}</h2>
              <p style="{{" margin:="" '0.25rem="" 0'="" }}="">{gig.clientAddress}</p>
              <p style="{{" margin:="" '0.25rem="" 0',="" fontsize:="" '0.875rem',="" color:="" '#4b5563'="" }}="">{gig.clientEmail}</p>
            </div>

            <table style="{{" width:="" '100%',="" bordercollapse:="" 'collapse',="" marginbottom:="" '2rem'="" }}="">
              <thead>
                <tr style="{{" borderbottom:="" '2px="" solid="" #e5e7eb',="" textalign:="" 'left',="" fontsize:="" '0.75rem',="" color:="" '#9ca3af',="" texttransform:="" 'uppercase'="" }}="">
                  <th style="{{" padding:="" '0.75rem="" 0'="" }}="">Description</th>
                  <th style="{{" padding:="" '0.75rem="" 0',="" textalign:="" 'right'="" }}="">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style="{{" borderbottom:="" '1px="" solid="" #f3f4f6'="" }}="">
                  <td style="{{" padding:="" '1rem="" 0'="" }}="">
                    <div style="{{" fontweight:="" 700="" }}="">{gig.jobTitle}</div>
                    {gig.description && (
                      <div style="{{" fontsize:="" '0.875rem',="" color:="" '#4b5563',="" margintop:="" '0.25rem',="" whitespace:="" 'pre-wrap'="" }}="">
                        {gig.description}
                      </div>
                    )}
                    <div style="{{" fontsize:="" '0.75rem',="" color:="" '#9ca3af',="" margintop:="" '0.5rem',="" fontstyle:="" 'italic'="" }}="">Service/Labor Fee</div>
                  </td>
                  <td style="{{" padding:="" '1rem="" 0',="" textalign:="" 'right',="" fontweight:="" 700="" }}="">${laborCost.toFixed(2)}</td>
                </tr>
                {gig.expenses?.map(exp => (
                  <tr key="{exp.id}" style="{{" borderbottom:="" '1px="" solid="" #f9fafb'="" }}="">
                    <td style="{{" padding:="" '0.75rem="" 0',="" fontsize:="" '0.875rem'="" }}="">{exp.description}</td>
                    <td style="{{" padding:="" '0.75rem="" 0',="" textalign:="" 'right',="" fontsize:="" '0.875rem'="" }}="">${exp.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style="{{" display:="" 'flex',="" justifycontent:="" 'flex-end'="" }}="">
              <div style="{{" width:="" '240px'="" }}="">
                <div style="{{" display:="" 'flex',="" justifycontent:="" 'space-between',="" padding:="" '0.5rem="" 0',="" color:="" '#4b5563'="" }}="">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style="{{" display:="" 'flex',="" justifycontent:="" 'space-between',="" padding:="" '0.5rem="" 0',="" color:="" '#4b5563'="" }}="">
                  <span>Tax ({taxRate}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div style="{{" display:="" 'flex',="" justifycontent:="" 'space-between',="" padding:="" '1rem="" 0',="" bordertop:="" '2px="" solid="" #111827',="" fontweight:="" 900,="" fontsize:="" '1.5rem',="" margintop:="" '0.5rem'="" }}="">
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <footer style="{{" margintop:="" '4rem',="" textalign:="" 'center',="" fontsize:="" '0.75rem',="" color:="" '#9ca3af',="" bordertop:="" '1px="" dashed="" #e5e7eb',="" paddingtop:="" '1.5rem'="" }}="">
              <p style="{{" margin:="" '0="" 0="" 0.5rem="" 0',="" fontweight:="" 600,="" color:="" '#4b5563'="" }}="">Thank you for your business!</p>
              <p style="{{" margin:="" 0="" }}="">This receipt is a Gigs and Side Hustles generated form: Copyright (c) 2025</p>
            </footer>
          </div>
        </div>
        <div style="{{" padding:="" '1.25rem',="" bordertop:="" '1px="" solid="" #f3f4f6',="" display:="" 'flex',="" gap:="" '0.75rem',="" backgroundcolor:="" '#f9fafb'="" }}="">
          <button onclick="{onClose}" style="{{" flexgrow:="" 1,="" padding:="" '0.875rem',="" borderradius:="" '0.75rem',="" border:="" '1px="" solid="" #d1d5db',="" backgroundcolor:="" 'white',="" fontweight:="" 600,="" cursor:="" 'pointer'="" }}="">Close</button>
          <button onclick="{handleDownload}" style="{{" flexgrow:="" 1,="" backgroundcolor:="" '#9333ea',="" color:="" 'white',="" padding:="" '0.875rem',="" border:="" 'none',="" borderradius:="" '0.75rem',="" fontweight:="" 700,="" cursor:="" 'pointer',="" boxshadow:="" '0="" 4px="" 6px="" rgba(147,="" 51,="" 234,="" 0.2)'="" }}="">Save as Image</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
