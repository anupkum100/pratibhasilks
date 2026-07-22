export const PAYMENT_TYPE_OPTIONS = [
    "Inventory",
    "Saree Procurement",
    "Packaging",
    "Logistics",
    "Courier & Shipping",
    "Marketing",
    "Technology",
    "Office",
    "Office Supplies",
    "Travel",
    "Photography",
    "Miscellaneous",
];

export const PAYMENT_CATEGORY_OPTIONS = [
    "Expense",
    "Inventory",
];

export const PAID_VIA_OPTIONS = [
    "Cash",
    "UPI",
    "Bank Transfer",
    "Card",
    "Cheque",
    "Razorpay",
    "Other",
];

export const withCurrentOption = (options, currentValue) => {
    if (!currentValue || options.includes(currentValue)) {
        return options;
    }

    return [currentValue, ...options];
};
