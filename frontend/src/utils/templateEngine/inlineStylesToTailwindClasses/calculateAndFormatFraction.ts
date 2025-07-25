/**
 * Calculates the result of a fraction string and formats it as 'result'
 *
 * @param {string} fractionString - A string representing a fraction (e.g., '3/2').
 * @param {number} [decimalPlaces=2] - The number of decimal places to round to if not a whole number. Defaults to 2.
 * Note: For repeating decimals (e.g., 1/3), this will be capped at 2.
 * @returns {string} A string with the calculated result enclosed in square brackets (e.g., '1.5').
 * Returns an error message if the input is not a valid fraction string or
 * if division by zero occurs.
 */
export default function calculateAndFormatFraction(fractionString: string, decimalPlaces = 2) {
    try {
        const parts = fractionString.split('/');
        const numerator = parseFloat(parts[0]);
        const denominator = parseFloat(parts[1]);

        // check if division is applicabale
        if (!fractionString.includes('/')) {
            return "[Error: Invalid fraction format - missing '/' ]";
        }
        if (parts.length !== 2) {
            return '[Error: Invalid fraction format - unexpected number of parts]';
        }
        if (isNaN(numerator) || isNaN(denominator)) {
            return '[Error: Invalid fraction format - non-numeric values]';
        }
        if (denominator === 0) {
            return '[Error: Division by zero]';
        }

        // Perform the division
        const result = numerator / denominator;

        let formattedResult;

        // integer
        if (Number.isInteger(result)) {
            formattedResult = result.toString();
        } else {
            const resultString = result.toString();
            // check for decimals
            const decimalPart = resultString.includes('.') ? resultString.split('.')[1] : '';

            if (decimalPart.length > 6 && decimalPlaces > 2) {
                formattedResult = result.toFixed(2);
            } else {
                formattedResult = parseFloat(result.toFixed(decimalPlaces)).toString();
            }
        }

        return `${formattedResult}`;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return `[Error: An unexpected error occurred - ${error.message}]`;
        }
        return `[Error: An unexpected error occurred - ${String(error)}]`;
    }
}
