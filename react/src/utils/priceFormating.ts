export const formatPrice = (price: number): string => {
    if (typeof price !== 'undefined' && !isNaN(price)) {
        // Format the price using toLocaleString
        return price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR'
        });
    } else {
        // Handle undefined or non-numeric inputs
        return 'N/A'; // Or any default value or error message you prefer
    }
};
