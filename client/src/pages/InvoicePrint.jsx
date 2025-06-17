import { toWords as convertToWords } from "number-to-words";
import toast from "react-hot-toast";
import { MdPrint } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const InvoicePrint = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    invoiceNo,
    trn,
    customerName,
    projectName,
    items = [],
    receivedAmount,
    totals,
    balance,
    date,
  } = state || {};

  const getItemCalculations = (item) => {
    const baseAmount = item.unitPrice * item.quantity;

    const discountPerUnit = (item.unitPrice * item.discount) / 100;
    const netUnitPrice = item.unitPrice - discountPerUnit;

    const discountAmount = discountPerUnit * item.quantity;
    const netAmount = netUnitPrice * item.quantity;

    const vatAmount = netUnitPrice * 0.05; // Single unit VAT (5%)
    const totalVat = vatAmount * item.quantity;

    const total = netAmount + totalVat;

    return {
      baseAmount,
      discountAmount,
      netAmount,
      vatAmount, // 🔹 Single unit VAT
      totalVat, // 🔹 Total VAT (unit × qty)
      total,
    };
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) =>
        Array.from(styleSheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join("")
      )
      .join("");

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>${styles}</style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
    printWindow.document.close();
    toast.success("Invoice print Successfully");
    navigate("/dashboard");
  };

  const toWords = (num) => {
    try {
      const words = convertToWords(num);
      return `${words.charAt(0).toUpperCase() + words.slice(1)} dirhams only`;
    } catch (error) {
      return "Invalid number";
    }
  };

  return (
    <div className="max-w-[21cm] mx-auto p-6 bg-white text-black text-xs font-sans">
      {/* Print Button (Hidden During Print) */}
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 print:hidden"
        >
          <MdPrint className="text-lg" />
          <span>Print Invoice</span>
        </button>
      </div>

      <div id="print-section">
        {/* Printable Area */}
        <div className="print-area text-black print:text-black print:bg-white print:p-0 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-xl font-bold">
              <span className="text-sm">AL</span> SAGEER CARPENTRY{" "}
              <span className="text-sm">SHOP</span>
            </h1>
            <h1 className="text-xl font-bold">
              <span className="text-sm">محل </span>الصغير للنجارة
            </h1>
            <p className="text-sm">
              All Kind of Woods, Aluminium & Glass Works
              <br />
              <span className="font-semibold">
                جميع أنواع الأخشاب والألمنيوم وأعمال الزجاج
              </span>
            </p>
          </div>
          <div className="print:block hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-6xl font-bold text-gray-300 opacity-30 pointer-events-none select-none whitespace-nowrap z-0">
            Al Sageer Carpentry
          </div>
          {/* Contact and Info Row */}
          <div className="flex justify-between text-sm mb-4 border-y py-2">
            <div>
              <div>Mob: 055-6172832</div>
              <div>Mob: 050-6172832</div>
              <div>P.O.Box: 8492</div>
              <div>Abu Dhabi - UAE</div>
            </div>
            <div className="text-center">
              <div className="border-2 border-black  inline-block font-semibold">
                <h1 className="px-14">فاتورة ضريبية</h1>
                <hr className="border border-t-black" />
                <h1 className="px-14">TAX INVOICE</h1>
              </div>
              <div>Email: tahirmirza8492@gmail.com</div>
              <div>TRN: 100477222200003</div>
            </div>
            <div className="text-right">
              <div>۰۵۵٦١۷۲۸۳۲ :متحرك</div>
              <div>۰۵۰٦١۷۲۸۳۲ :متحرك</div>
              <div>ص.ب: ۸۴۹۲</div>
              <div>:أبوظبي - الإمارات</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex justify-between items-center text-sm mb-4">
            <div>
              <div>
                Invoice No: <strong>{invoiceNo}</strong>
              </div>
              <div>
                Project: <strong>{projectName}</strong>
              </div>
              <div>
                Mr./M/s: <strong className="underline">{customerName}</strong>
              </div>
            </div>

            <div>
              Customer TRN: <strong>{trn}</strong>
            </div>
            <div>
              <div>
                Date: التاريخ :<strong>{date}</strong>
              </div>
              <div>السيـد / السـادة</div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border text-xs mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-1 py-1">Sr No.</th>
                <th className="border px-1 py-1">DESCRIPTION</th>
                <th className="border px-1 py-1">QTY</th>
                <th className="border px-1 py-1">UNIT PRICE</th>
                <th className="border px-1 py-1">Single Unit VAT 5%</th>
                <th className="border px-1 py-1">Net Amt</th>
                <th className="border px-1 py-1">Total VAT</th>
                <th className="border px-1 py-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const calc = getItemCalculations(item);
                return (
                  <tr key={index} className="border h-12">
                    <td className="border px-2 text-center">{index + 1}</td>
                    <td className="border px-2">{item.description}</td>
                    <td className="border px-2 text-center">
                      {item.quantity.toFixed(2)}
                    </td>
                    <td className="border px-2 text-center">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border px-2 text-center">
                      {calc.vatAmount.toFixed(2)}
                    </td>
                    <td className="border px-2 text-center">
                      {calc.netAmount.toFixed(2)}
                    </td>
                    <td className="border px-2 text-center">
                      {calc.totalVat.toFixed(2)}
                    </td>
                    <td className="border px-2 text-center font-bold">
                      {calc.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {/* Amount in words */}
              <tr className="h-12 border-t">
                <td colSpan={8} className="px-2 text-sm italic">
                  Amount in words: <strong>{toWords(totals?.total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Summary */}
          <div className="flex justify-between">
            <div className="text-xs">
              <div>Receiver's Sign توقيع المستلم</div>
              <div className="mt-6 border-t w-40"></div>
            </div>

            <div className="text-sm w-64 border rounded-md p-3 bg-gray-50">
              <div className="flex justify-between">
                <span>Total Quantities</span>
                <span>
                  {items.reduce((acc, curr) => acc + curr.quantity, 0)} Items
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount:</span>
                <span>{totals?.discount?.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between">
                <span>Total VAT (5%):</span>
                <span>{totals?.vat?.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between">
                <span>Received Amount:</span>
                <span>{receivedAmount?.toFixed(2)} AED</span>
              </div>
              {balance > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Remaining Balance:</span>
                  <span>{balance} AED</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base text-blue-900">
                <span>Net Payable:</span>
                <span>{totals?.total?.toFixed(2)} AED</span>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-right text-sm">
            <div>Al Sageer Carpentry</div>
            <div>Best Regards</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
