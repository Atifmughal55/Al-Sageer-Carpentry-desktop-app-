import { toWords as convertToWords } from "number-to-words";
import toast from "react-hot-toast";
import { MdPrint } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logosc.png";
import { useState } from "react";
import stampImage from "../assets/stamp.png";

const QuotationPrint = () => {
  const [showStamp, setShowStamp] = useState(false);
  const navigate = useNavigate();
  const { quotationData, quotationItems } = useSelector(
    (state) => state.quotation
  );

  const getItemCalculations = (item) => {
    const quantity = Number(item?.quantity) || 0;
    const unitPrice = Number(item?.unit_price) || 0;
    const baseAmount = unitPrice * quantity;

    return {
      netAmount: baseAmount,
      total: baseAmount,
    };
  };

  const totals = quotationItems.reduce(
    (acc, item) => {
      const calc = getItemCalculations(item);
      acc.net += calc.total;
      acc.quantity += item.quantity;
      return acc;
    },
    { net: 0, quantity: 0 }
  );

  const toWords = (num) => {
    try {
      const words = convertToWords(num);
      return `${words.charAt(0).toUpperCase() + words.slice(1)} dirhams only`;
    } catch {
      return "Invalid number";
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section").innerHTML;

    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print\\:bg-blue-900 {
                background-color: #1e3a8a !important;
              }
              .print\\:text-gray-100 {
                color: #f3f4f6 !important;
              }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    toast.success("Quotation printed successfully");
    navigate("/dashboard");
  };

  return (
    <div className="max-w-[21cm] mx-auto p-6 bg-white text-black text-xs font-sans">
      {/* Print Button */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 font-semibold text-white rounded hover:bg-blue-700 flex items-center gap-2 print:hidden"
        >
          <MdPrint className="text-lg" />
          <span>Print Quotation</span>
        </button>
        <button
          onClick={() => setShowStamp(!showStamp)}
          className="px-2 py-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700 print:hidden"
        >
          <span>{showStamp ? "Remove stamp" : "Print Stamp"}</span>
        </button>
      </div>

      {/* Printable Section */}
      <div id="print-section">
        <div className="print-area text-black print:text-black print:bg-white print:p-0 print:shadow-none">
          {/* HEADER */}
          <div className="text-center mb-2 text-blue-900">
            <h1 className="text-5xl font-bold tracking-wider">
              <span className="text-sm">AL</span> SAGEER CARPENTRY{" "}
              <span className="text-sm">SHOP</span>
            </h1>
            <h1 className="text-3xl font-bold transform scale-x-150">
              <span className="text-sm">محل </span>الصغير للنجارة
            </h1>
            <p className="text-sm my-2">
              All Kind of Woods, Aluminium & Glass Works
              <br />
              <span className="font-semibold">
                جميع أنواع الأخشاب والألمنيوم وأعمال الزجاج
              </span>
            </p>
          </div>

          {/* Watermark */}
          <div className="print:block hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none z-0">
            <img
              src={logo}
              alt="Logo Sageer Carpentry"
              className="w-[800px] max-w-none"
            />
          </div>

          {/* Contact Info */}
          <div className="flex justify-between text-sm mb-4 text-blue-900 border-y py-2">
            <div className="font-bold">
              <div>Mob: 055-6172832</div>
              <div>Mob: 050-6172832</div>
              <div>P.O.Box: 8492</div>
              <div>Abu Dhabi - UAE</div>
            </div>
            <div className="text-center">
              <div className="border-2 py-1 border-blue-900 inline-block font-semibold">
                <h1 className="px-14">عرض أسعار</h1>
                <hr className="border border-blue-900 w-full"></hr>
                <h1>QUOTATION</h1>
              </div>
              <div className="font-bold">Email: tahirmirza8492@gmail.com</div>
              <div className="font-bold text-red-800">TRN: 100477222200003</div>
            </div>
            <div className="text-right font-bold">
              <div>۰۵۵٦١۷۲۸۳۲ :متحرك</div>
              <div>۰۵۰٦١۷۲۸۳۲ :متحرك</div>
              <div>ص.ب: ۸٤۹۲</div>
              <div>:أبوظبي - الإمارات</div>
            </div>
          </div>

          {/* Quotation Info */}
          <div className="flex justify-between items-center text-sm mb-4 text-blue-900">
            <div>
              <div className="font-bold">
                Quotation No: {quotationData?.quotation_no}
              </div>
              <div className="font-bold">
                Project: {quotationData?.project_name}
              </div>
              <div className="font-bold">
                Mr./M/s:{" "}
                <span className="underline">
                  {quotationData?.customer?.name}
                </span>
              </div>
            </div>
            <div>
              <div className="font-bold">
                Date: التاريخ :{" "}
                <span>{new Date().toLocaleDateString("en-GB")}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-2 border-blue-900 border-collapse text-xs mb-6">
            <thead className=" print:bg-blue-900 bg-blue-900 print:text-gray-100 text-gray-100">
              <tr>
                <th className="border-2 border-blue-900 px-1 py-1">Sr No.</th>
                <th className="border-2 border-blue-900 px-28 py-1">
                  DESCRIPTION
                </th>
                <th className="border-2 border-blue-900 px-1 py-1">SIZE</th>
                <th className="border-2 border-blue-900 px-1 py-1">QTY</th>
                <th className="border-2 border-blue-900 px-1 py-1">
                  UNIT PRICE
                </th>
                <th className="border-2 border-blue-900 px-1 py-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {quotationItems.map((item, index) => (
                <tr key={index} className="border-2 border-blue-900 h-12">
                  <td className="border-2 border-blue-900 px-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border-2 border-blue-900 px-2">
                    {item.description}
                  </td>
                  <td className="border-2 border-blue-900 px-2 text-center">
                    {item.size}
                  </td>
                  <td className="border-2 border-blue-900 px-2 text-center">
                    {Number(item.quantity.toFixed(2))}
                  </td>
                  <td className="border-2 border-blue-900 px-2 text-center">
                    {item.unit_price}
                  </td>
                  <td className="border-2 border-blue-900 px-2 text-center font-bold text-blue-900">
                    {`${item.quantity} X ${item.unit_price} = ${item.total_price}`}
                  </td>
                </tr>
              ))}
              <tr className="h-12 border-2 border-blue-900">
                <td
                  colSpan={7}
                  className="px-2 text-sm font-semibold italic text-red-700"
                >
                  {new Date(quotationData?.valid_until) < new Date()
                    ? "This quotation is Expired please create new quotation"
                    : `This Quotation is valid for 15 days from today to ${quotationData?.valid_until}`}
                </td>
              </tr>
              <tr className="h-12">
                <td colSpan={7} className="px-2 text-sm italic">
                  Amount in words:{" "}
                  <strong className="text-blue-900">
                    {toWords(Number(totals.net.toFixed(2)))}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between">
            <div className="text-xs">
              <div>Receiver's Sign توقيع المستلم</div>
              <div className="mt-6 border-t w-40"></div>
            </div>
            <div className="text-sm w-64 border rounded-md p-3 bg-gray-50">
              <div className="flex justify-between">
                <span>Total Quantities</span>
                <span>{totals.quantity} Items</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base text-blue-900">
                <span>Total Amount:</span>
                <span>{Number(totals.net.toFixed(2))} AED</span>
              </div>
            </div>
          </div>

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

export default QuotationPrint;
