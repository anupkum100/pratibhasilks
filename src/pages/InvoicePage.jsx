import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { InvoiceBillingDetails } from "../components/InvoiceBillingDetails";

import InvoiceFooter from "../components/InvoiceFooter";
import InvoiceHeader from "../components/InvoiceHeader";

import { invoices } from "../data/invoices";
// import { products } from "../data/products";
import { getImageFromId } from "../data/util";
const products = []

export default function InvoicePage() {
    const { invoiceId } = useParams();

    const invoiceRef = useRef();

    const invoice = invoices.find(
        (inv) => inv.invoiceId === invoiceId
    );

    const downloadInvoice = async () => {
        const element = invoiceRef.current;

        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

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

    if (!invoice) {
        return (
            <div className="invoice-page">
                <h1 className="text-3xl text-[var(--color-primary)]">
                    Invoice Not Found
                </h1>
            </div>
        );
    }

    const invoiceProducts = invoice.product.map((item) => {
        const productData = products.find(
            (prod) => prod.sku === item.sku
        );

        return {
            ...productData,
            quantity: item.quantity,
            specialRequest: item.specialRequest,
            total:
                (productData?.offerPrice || productData?.price) *
                item.quantity,
        };
    });

    const subtotal = invoiceProducts.reduce(
        (acc, item) => acc + item.total,
        0
    );

    return (
        <div className="invoice-page">

            <div className="invoice-container">

                {/* Downloadable section  */}
                <section ref={invoiceRef}>

                    {/* Header */}
                    <InvoiceHeader invoice={invoice} />

                    {/* Billing + Shipping */}
                    <InvoiceBillingDetails invoice={invoice} />

                    {/* Product Section */}
                    <div className="p-4">

                        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
                            Product Details
                        </h3>

                        <div className="invoice-table-wrapper rounded-xl">

                            <table
                                className="invoice-table"
                                style={{
                                    tableLayout: "fixed",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: "40%" }}>
                                            Product
                                        </th>
                                        <th style={{ width: "20%" }}>
                                            Qty
                                        </th>
                                        <th style={{ width: "20%" }}>
                                            Price
                                        </th>
                                        <th style={{ width: "20%", textAlign: "end" }}>
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {invoiceProducts.map((product) => (

                                        <tr key={product.sku}>

                                            {/* Product */}
                                            <td>

                                                <div className="flex gap-4 items-center">

                                                    <img
                                                        src={getImageFromId(product.mainImageId)}
                                                        alt={product.name}
                                                        className="invoice-product-image"
                                                    />

                                                    <div>
                                                        <h4 className="font-semibold text-[var(--color-primary)]">
                                                            {product.name}
                                                        </h4>
                                                        {product.specialRequest &&
                                                            product.specialRequest !== "NA" && (
                                                                <small className="block mt-2">
                                                                    {product.specialRequest}
                                                                </small>
                                                            )}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Qty */}
                                            <td className="text-[var(--color-primary)]">
                                                {product.quantity}
                                            </td>

                                            {/* Original Price */}
                                            <td className="text-[var(--color-primary)]">
                                                ₹{product.offerPrice}
                                            </td>

                                            {/* Total */}
                                            <td className="text-right font-bold text-[var(--color-primary)]">
                                                ₹{product.total}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        {/* Total Section */}
                        <div className="flex justify-end mt-5">

                            <div className="w-full md:w-96 bg-[var(--color-background)]/20 rounded-xl p-4 border border-[var(--color-border)]">

                                <div className="space-y-4">

                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <b>₹{subtotal}</b>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping</span>

                                        <span className="text-green-600">
                                            FREE
                                        </span>
                                    </div>

                                    <div className="border-t pt-4 flex justify-between text-2xl font-bold text-[var(--color-primary)]">

                                        <span>Total</span>

                                        <span>
                                            ₹{subtotal}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </section>
                {/* Footer */}
                <InvoiceFooter downloadInvoice={downloadInvoice} />
            </div>

        </div>
    );
}