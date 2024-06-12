export const formatPrice = (price: number): string => {
    if (!isNaN(price)) { // Ensure 'price' is a valid number
        // Convert the price to a string with fixed decimal precision
        const priceString = Number(price).toFixed(2);

        // Split the string into integer and decimal parts
        const [integerPart, decimalPart] = priceString.split('.');

        // Add commas for thousand separators to the integer part
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Concatenate the formatted integer part, decimal part, and currency symbol
        const formattedPrice = `Rp ${formattedIntegerPart},${decimalPart}`;

        return formattedPrice;
    } else {
        // Handle undefined, NaN, or non-numeric inputs
        return 'N/A'; // Or any default value or error message you prefer
    }
};
