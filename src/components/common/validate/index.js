export const validateValueType = (type, value) => {
    switch (type) {
        case 'number':
            return !isNaN(parseFloat(value)) && !isNaN(value - 0);
        case 'string':
            return value.length > 0 && value.trim();

        default:
            return null;
    }
};
