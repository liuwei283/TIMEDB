
// find the valid bound
export function findBound(x, power, sigDigit) {
    if (x <= 0) {
        console.log("Only accept positive values");
        return;
    }
    if (x < Math.pow(10, sigDigit - 1))
        return findBound(10 * x, power + 1, sigDigit);
    else if (x > Math.pow(10, sigDigit))
        return findBound(x / 10, power - 1, sigDigit);
    else
        return Math.ceil(x) / Math.pow(10, power);
}