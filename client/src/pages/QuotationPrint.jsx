import { toWords as convertToWords } from "number-to-words";
import toast from "react-hot-toast";
import { MdPrint } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const QuotationPrint = () => {
  const navigate = useNavigate();
  const { quotationData, quotationItems } = useSelector(
    (state) => state.quotation
  );
  console.log("QuotationData: ", quotationData);
  console.log("quotationItems: ", quotationItems);
  const getItemCalculations = (item) => {
    const quantity = Number(item?.quantity) || 0;
    const unitPrice = Number(item?.unit_price) || 0;
    const baseAmount = unitPrice * quantity;

    return {
      netAmount: baseAmount,
      total: baseAmount,
    };
  };

  // ✅ Calculate Totals
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
    const styles = Array.from(document.styleSheets)
      .map((s) =>
        Array.from(s.cssRules || [])
          .map((r) => r.cssText)
          .join("")
      )
      .join("");

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head><title>Quotation</title><style>${styles}</style></head>
        <body onload="window.print(); window.close();">${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Quotation printed successfully");
    navigate("/dashboard");
  };

  return (
    <div className="max-w-[21cm] mx-auto p-6 bg-white text-black text-xs font-sans">
      {/* Print Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 print:hidden"
        >
          <MdPrint className="text-lg" />
          <span>Print Quotation</span>
        </button>
      </div>

      {/* Printable Section */}
      <div id="print-section">
        {/* HEADER */}
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

        {/* Contact & Quotation Info */}
        <div className="flex justify-between text-sm mb-4 border-y py-2">
          <div>
            <div>Mob: 055-6172832</div>
            <div>Mob: 050-6172832</div>
            <div>P.O.Box: 8492</div>
            <div>Abu Dhabi - UAE</div>
          </div>
          <div className="text-center">
            <div className="border-2 border-black inline-block font-semibold px-10 py-2">
              QUOTATION
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

        {/* Quotation Details */}
        <div className="flex justify-between items-center text-sm mb-4">
          <div>
            <div>
              Quotation No: <strong>{quotationData?.quotation_no}</strong>
            </div>
            <div>
              Project: <strong>{quotationData?.project_name}</strong>
            </div>
            <div>
              Mr./M/s:{" "}
              <strong className="underline">
                {quotationData?.customer?.name}
              </strong>
            </div>
          </div>
          <div>
            <div>
              Date: التاريخ :<strong>{new Date().toLocaleDateString()}</strong>
            </div>
            <div>السيـد / السـادة</div>
          </div>
        </div>

        {/* Table of Items */}
        <table className="w-full border text-xs mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-1 py-1">Sr No.</th>
              <th className="border px-1 py-1">DESCRIPTION</th>
              <th className="border px-1 py-1">SIZE</th>
              <th className="border px-1 py-1">QTY</th>
              <th className="border px-1 py-1">UNIT PRICE</th>
              <th className="border px-1 py-1">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {quotationItems.map((item, index) => {
              return (
                <tr key={index} className="border h-12">
                  <td className="border px-2 text-center">{index + 1}</td>
                  <td className="border px-2">{item.description}</td>
                  <td className="border px-2 text-center">{item.size}</td>
                  <td className="border px-2 text-center">
                    {Number(item.quantity.toFixed(2))}
                  </td>
                  <td className="border px-2 text-center">{item.unit_price}</td>

                  <td className="border px-2 text-center font-bold">
                    {`${item.quantity} X ${item.unit_price} = ${item.total_price}`}
                  </td>
                </tr>
              );
            })}
            <tr className="h-12 border-t">
              <td colSpan={7} className="px-2 text-sm italic">
                This Quotation is valid for 15 days from today to{" "}
                {quotationData?.valid_until}
              </td>
            </tr>
            <tr className="h-12 border-t">
              <td colSpan={7} className="px-2 text-sm italic">
                Amount in words:{" "}
                <strong>{toWords(Number(totals.net.toFixed(2)))}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals & Footer */}
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
              <span>Net Payable:</span>
              <span>{Number(totals.net.toFixed(2))} AED</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-right text-sm">
          <div>Al Sageer Carpentry</div>
          <div>Best Regards</div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPrint;
