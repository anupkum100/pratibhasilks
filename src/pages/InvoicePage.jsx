import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import InvoiceFooter from "../components/InvoiceFooter";
import InvoiceHeader from "../components/InvoiceHeader";
import { invoices } from "../data/invoices";
import { products } from "../data/products";
import { getImageFromId } from "../data/util";

export default function InvoicePage() {
    const { invoiceId } = useParams();
    const invoiceRef = useRef();

    const downloadInvoice = async () => {
        const element = invoiceRef.current;

        if (!element) return;

        // Store old styles
        const oldTransform = element.style.transform;
        const oldZoom = element.style.zoom;

        // Remove scaling before capture
        element.style.transform = "scale(1)";
        element.style.zoom = "1";

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        // Restore styles
        element.style.transform = oldTransform;
        element.style.zoom = oldZoom;

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight =
            (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            pdfWidth,
            pdfHeight
        );

        pdf.save(`invoice-${invoice.invoiceId}.pdf`);
    };

    const invoice = invoices.find(
        (inv) => inv.invoiceId === invoiceId
    );

    if (!invoice) {
        return (
            <div className="py-6 flex justify-center">
                <h1 className="text-3xl text-[var(--color-primary)]">
                    Invoice Not Found
                </h1>
            </div>
        );
    }

    const invoiceProducts = invoice.product.map((item) => {
        const productData = products.find(
            (prod) => prod.id === item.id
        );

        return {
            ...productData,
            quantity: item.quantity,
            specialRequest: item.specialRequest,
            total:
                (productData.offerPrice || productData.price) *
                item.quantity,
        };
    });

    const subtotal = invoiceProducts.reduce(
        (acc, item) => acc + item.total,
        0
    );

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex justify-center">
            <div className="invoice-scale-wrapper px-4">

                <div
                    ref={invoiceRef}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden invoice-container invoice-scale"
                >
                    <InvoiceHeader invoice={invoice} />

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-8 p-8 border-b border-[var(--color-border)]">

                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
                                Billing Details
                            </h3>

                            <div className="space-y-2 text-[var(--color-text-dark)]">
                                <p className="font-medium">
                                    {invoice.customer}
                                </p>

                                <p>India</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
                                Shipping Details
                            </h3>

                            <div className="space-y-2 text-[var(--color-text-dark)]">
                                <p>Standard Delivery</p>
                                <p>Delivery in 4–7 Business Days</p>
                                <p>Tracking Shared via WhatsApp</p>
                            </div>
                        </div>

                    </div>

                    {/* Products */}
                    <div className="p-4">

                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                            Product Details
                        </h3>

                        <div className="overflow-x-auto border border-[var(--color-border)] rounded-3xl">

                            <table className="w-full border-collapse">

                                {/* Table Header */}
                                <thead className="bg-[var(--color-primary)] text-white">

                                    <tr>
                                        <th className="text-left p-5">
                                            Product
                                        </th>

                                        <th className="text-left p-5">
                                            Fabric
                                        </th>

                                        <th className="text-left p-5">
                                            Qty
                                        </th>

                                        <th className="text-left p-5">
                                            Price
                                        </th>

                                        <th className="text-left p-5">
                                            Offer Price
                                        </th>

                                        <th className="text-right p-5">
                                            Total
                                        </th>
                                    </tr>

                                </thead>

                                {/* Table Body */}
                                <tbody>

                                    {invoiceProducts.map((product, index) => (

                                        <tr
                                            key={product.id}
                                            className={`border-b border-[var(--color-border)] ${index % 2 === 0
                                                ? "bg-white"
                                                : "bg-[var(--color-background)]/10"
                                                }`}
                                        >

                                            {/* Product */}
                                            <td className="p-5 min-w-[320px]">

                                                <div className="flex gap-4 items-center">

                                                    <img
                                                        src={getImageFromId(product.mainImageId)}
                                                        alt={product.name}
                                                        className="w-20 h-24 object-cover rounded-2xl shadow-md"
                                                    />

                                                    <div>

                                                        <h4 className="font-semibold text-lg text-[var(--color-primary)]">
                                                            {product.name}
                                                        </h4>

                                                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                                            {product.description}
                                                        </p>

                                                        {product.specialRequest && <small>
                                                            Special Request: {product.specialRequest}
                                                        </small>
                                                        }

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Fabric */}
                                            <td className="p-5 text-[var(--color-text-dark)]">

                                                <div className="space-y-1 text-sm">

                                                    <p>
                                                        <span className="font-medium">
                                                            Fabric:
                                                        </span>{" "}
                                                        {product.fabric}
                                                    </p>

                                                    <p>
                                                        <span className="font-medium">
                                                            Weave:
                                                        </span>{" "}
                                                        {product.weave}
                                                    </p>

                                                    <p>
                                                        <span className="font-medium">
                                                            Border:
                                                        </span>{" "}
                                                        {product.borderType}
                                                    </p>

                                                    <p>
                                                        <span className="font-medium">
                                                            Length:
                                                        </span>{" "}
                                                        {product.length}
                                                    </p>

                                                </div>

                                            </td>

                                            {/* Quantity */}
                                            <td className="p-5 text-lg font-semibold text-[var(--color-primary)]">
                                                {product.quantity}
                                            </td>

                                            {/* Original Price */}
                                            <td className="p-5 text-gray-400 line-through">
                                                ₹{product.price}
                                            </td>

                                            {/* Offer Price */}
                                            <td className="p-5 font-semibold text-[var(--color-secondary)]">
                                                ₹{product.offerPrice}
                                            </td>

                                            {/* Total */}
                                            <td className="p-5 text-right text-xl font-bold text-[var(--color-primary)]">
                                                ₹{product.total}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        {/* Total Section */}
                        <div className="flex justify-end mt-10">

                            <div className="w-full md:w-96 bg-[var(--color-background)]/20 rounded-3xl p-6 border border-[var(--color-border)]">

                                <div className="space-y-4">

                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">
                                            FREE
                                        </span>
                                    </div>

                                    <div className="flex justify-between hidden">
                                        <span>GST</span>
                                        <span>Included
                                        </span>
                                    </div>

                                    <div className="border-t pt-4 flex justify-between text-2xl font-bold text-[var(--color-primary)]">
                                        <span>Total</span>
                                        <span>₹{subtotal}</span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <InvoiceFooter downloadInvoice={downloadInvoice} />
                </div>
            </div>
        </div>
    );
}