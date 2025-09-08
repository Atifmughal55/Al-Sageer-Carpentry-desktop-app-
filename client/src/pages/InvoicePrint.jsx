import { toWords as convertToWords } from "number-to-words";
import toast from "react-hot-toast";
import { MdPrint } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logosc.png";
import stampImage from "../assets/stamp.png";
import { useState } from "react";

const InvoicePrint = () => {
  const [showStamp, setShowStamp] = useState(false);
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
    totalAmount,
    date,
    discount,
    quotationNo,
    quotationDate,
  } = state || {};

  const getItemCalculations = (item) => {
    const SingleUnitVatAmount = (item.unitPrice * item.vat) / 100;
    const netAmount = item.unitPrice * item.quantity;
    return { netAmount, SingleUnitVatAmount };
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
    toast.success("Invoice printed successfully");
    navigate("/dashboard");
  };

  const toWords = (num) => {
    try {
      const words = convertToWords(num);
      return `${words.charAt(0).toUpperCase() + words.slice(1)} dirhams only`;
    } catch {
      return "Invalid number";
    }
  };

  return (
    <div className="max-w-[21cm] mx-auto p-6 bg-white text-xs font-sans">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <MdPrint className="text-lg" />
          <span>Print Invoice</span>
        </button>
        <button
          onClick={() => setShowStamp(!showStamp)}
          className="px-2 py-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          <span>{showStamp ? "Remove Stamp" : "Print Stamp"}</span>
        </button>
      </div>

      {/* Printable Section */}
      <div id="print-section">
        <div className="print-area">
          {/* Header */}
          <div className="text-center mb-2 text-blue-900">
            <h1 className="text-5xl font-bold tracking-wider">
              <span className="text-sm">AL</span> SAGEER CARPENTRY{" "}
              <span className="text-sm">SHOP</span>
            </h1>
            <h1 className="text-3xl font-bold transform scale-x-150">
              <span className="text-sm">محل </span>الصغير للنجارة
            </h1>
            <p className="text-sm my-2">
              All Kind of Woods, Aluminium & Glass Works <br />
              <span className="font-semibold">
                جميع أنواع الأخشاب والألمنيوم وأعمال الزجاج
              </span>
            </p>
          </div>

          {/* Watermark */}
          <div className="print:block hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none z-0">
            <img src={logo} alt="Logo" className="w-[800px] max-w-none" />
          </div>

          {/* Contact Info */}
          <div className="flex justify-between text-sm mb-4 border-y py-2 text-blue-900">
            <div className="font-bold">
              <div>Mob: 055-6172832</div>
              <div>Mob: 050-6172832</div>
              <div>P.O.Box: 8492</div>
              <div>Abu Dhabi - UAE</div>
            </div>
            <div className="text-center">
              <div className="border-2 border-blue-900 inline-block font-semibold">
                <h1 className="px-14">فاتورة ضريبية</h1>
                <hr className="border border-t-blue-900" />
                <h1 className="px-14">TAX INVOICE</h1>
              </div>
              <div className="font-semibold">
                Email: tahirmirza8492@gmail.com
              </div>
              <div className="text-red-500 font-semibold">
                TRN: 100477222200003
              </div>
            </div>
            <div className="text-right font-bold">
              <div>۰۵۵٦١۷۲۸۳۲ :متحرك</div>
              <div>۰۵۰٦١۷۲۸۳۲ :متحرك</div>
              <div>ص.ب: ۸٤۹۲</div>
              <div>:أبوظبي - الإمارات</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex justify-between items-center text-sm mb-4 text-blue-900">
            <div>
              <div className="font-bold">LPO No: ____________</div>
              <div className="font-bold">Invoice No: {invoiceNo}</div>
              <div className="font-bold">Project: {projectName}</div>
              <div className="font-bold">
                Mr./M/s: <span className="underline">{customerName}</span>
              </div>
            </div>
            <div className="text-center">
              <div>
                Customer TRN: <strong>{trn}</strong>
              </div>
              <p className="border-2 border-blue-900 py-1 px-6">
                Ref No. {quotationNo}/{quotationDate?.split(" ")[0]}
              </p>
            </div>
            <div className="font-bold">
              <div>Date: {new Date().toLocaleDateString("en-GB")} التاريخ:</div>
              <div>السيـد / السـادة</div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-2 border-blue-900 border-collapse text-xs mb-6">
            <thead
              style={{
                backgroundColor: "#1e3a8a",
                color: "white",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              <tr>
                <th className="border-2 border-blue-900 px-1 py-1">Sr No.</th>
                <th className="border-2 border-blue-900 px-28 py-1">
                  DESCRIPTION
                </th>
                <th className="border-2 border-blue-900 px-1 py-1">QTY</th>
                <th className="border-2 border-blue-900 px-1 py-1">
                  UNIT PRICE
                </th>
                <th className="border-2 border-blue-900 px-1 py-1">VAT 5%</th>
                <th className="border-2 border-blue-900 px-1 py-1">Net Amt</th>
                <th className="border-2 border-blue-900 px-1 py-1">
                  Total VAT
                </th>
                <th className="border-2 border-blue-900 px-1 py-1">TOTAL</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const calc = getItemCalculations(item);
                return (
                  <tr key={index} className="border-2 border-blue-900 h-12">
                    <td className="border-2 border-blue-900 px-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-2 border-blue-900 px-2">
                      {item.description}
                    </td>
                    <td className="border-2 border-blue-900 px-2 text-center">
                      {item.quantity.toFixed(2)}
                    </td>
                    <td className="border-2 border-blue-900 px-2 text-center">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border-2 border-blue-900 px-2 text-center">
                      {calc.SingleUnitVatAmount.toFixed(2)}
                    </td>
                    <td className="border-2 border-blue-900 px-2 text-center">
                      {calc.netAmount.toFixed(2)}
                    </td>
                    <td className="border-2 border-blue-900 px-2 text-center">
                      {item.vatAmount.toFixed(2)}
                    </td>
                    <td className="border-2 border-blue-900 px-2 text-center font-bold text-blue-900">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr className="h-12 border-t-2 border-blue-900">
                <td
                  colSpan={8}
                  className="border-2 border-blue-900 px-2 text-sm italic text-blue-900"
                >
                  Amount in words: <strong>{toWords(totals?.total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-between">
            <div className="text-xs font-semibold">
              <div>Receiver's Sign توقيع المستلم</div>
              <div className="mt-6 border-t w-40"></div>
            </div>
            <div className="text-sm w-64 border rounded-md p-3 bg-gray-50">
              <div className="flex justify-between text-blue-900">
                <span>Total Quantities</span>
                <span>
                  {items.reduce((acc, curr) => acc + curr.quantity, 0)} Items
                </span>
              </div>
              <div className="flex justify-between text-blue-900">
                <span>Total Amount</span>
                <span>{totals?.base} AED</span>
              </div>
              <div className="flex justify-between text-blue-900">
                <span>Total VAT (5%)</span>
                <span>{totals?.vat?.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between text-blue-900 font-semibold">
                <span>Total with VAT</span>
                <span>{totals?.total} AED</span>
              </div>
              <div className="flex justify-between text-blue-900 font-semibold">
                <span>Discount:</span>
                <span>{discount} AED</span>
              </div>
              <div className="flex justify-between text-green-900 font-semibold">
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
                <span>{totalAmount?.toFixed(2)} AED</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-right text-sm">
            <div className="text-blue-900">Al Sageer Carpentry</div>
            <div className="text-blue-900">Best Regards</div>
            {showStamp && (
              <img
                src={stampImage}
                alt="Official Stamp"
                width={300}
                className="inline-block -mt-24 -mr-12 rotate-[-10deg]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
