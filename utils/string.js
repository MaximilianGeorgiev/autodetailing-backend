exports.capitalizeFirstChar = (inputString) => {
    return inputString.length > 0 ? inputString[0].toUpperCase() + inputString.substring(1) : "";
};