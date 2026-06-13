import { useRef } from "react";

const order = {
    customerName: "Priyanka Haridas",
    addressLine1: "A217, Mayflower Block,",
    addressLine2: "Brigade Millennium Apartments,",
    addressLine3: "Puttenahalli, JP Nagar 7th Phase",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: 560078,
    phone: 8754509493,
    invoiceId: "PS1002"
}

export default function ShippingLabel() {
    return (
        <main className="min-h-screen bg-[#F8F3EC] flex flex-col items-center">
            <section className="shipping-label bg-white text-black">
                <div className="label-section">
                    <p className="label-title">Ship To</p>
                    <hr />
                    <p>{order.customerName}</p>
                    <p>{order.addressLine1}</p>
                    <p>{order.addressLine2}</p>
                    <p>{order.addressLine3}</p>
                    <p>{order.city}</p>
                    <p>
                        {order.state} - {order.pinCode}
                    </p>
                    <p>Phone: {order.phone}</p>
                </div>

                <div className="label-footer">
                    <div>
                        <p className="label-title">Return Address</p>
                        <hr />
                        <p>Deepti Bharti</p>
                        <p>D-801, R7, Life Republic, </p>
                        <p>Marunji, Pune, </p>
                        <p>Maharashtra,411057</p>
                        <p>Phone: 9730880398</p>
                    </div>

                    <p className="label-note">
                        Please handle with care. Do not fold sharply.
                    </p>
                </div>

            </section>
        </main>
    );
}