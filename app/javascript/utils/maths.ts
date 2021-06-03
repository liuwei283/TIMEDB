import {minmax} from "crux/dist/utils/math"
// find the valid bound
export function findBound(x, power = 0, sigDigit) {
    if (x < 0) {
        console.log("Only accept positive values");
        return;
    }
    if (x === 0) return 0;
    if (x < Math.pow(10, sigDigit - 1))
        return findBound(10 * x, power + 1, sigDigit);
    else if (x > Math.pow(10, sigDigit))
        return findBound(x / 10, power - 1, sigDigit);
    else {
        const numTen = 10 * Math.floor(x / 10);
        const dig = x - numTen;
        return (numTen + (dig > 5 ? 10 : dig === 0 ? 0 : 5)) / Math.pow(10, power);
    }
}

export function findLowerBound(x, power, sigDigit) {
    if (x < 0) {
        console.log("Only accept positive values");
        return;
    }
    if (x === 0) return 0;
    if (x < Math.pow(10, sigDigit - 1))
        return findLowerBound(10 * x, power + 1, sigDigit);
    else if (x > Math.pow(10, sigDigit))
        return findLowerBound(x / 10, power - 1, sigDigit);
    else
        return Math.floor(x) / Math.pow(10, power);
}

export function computeLog(number, base): number {
    return Math.log(number) / Math.log(base);
}

export function findBoundsForValues(values: number[], sigDigit,
    isSym: boolean = false, padding: number = 0) {
    let [min, max] = minmax(values);
    if (padding !== 0) {
        const range = max - min;
        min = min - range * padding;
        max = max + range * padding;
    }
    let lowerBound, upperBound;
    if (min < 0 && max >0) {
        if (isSym) {
            const bound = findBound( max > -min ? max :-min , 0, sigDigit);
            return [-bound, bound];
        } else {
            upperBound = findBound(max, 0, sigDigit);
            lowerBound = Math.sign(min)*findBound(Math.abs(min), 0, sigDigit);
        }
    } else if (max > 0) {
        upperBound = findBound(max, 0, sigDigit);
        lowerBound = findLowerBound(min, 0, sigDigit);
    } else if (max < 0) {
        upperBound = -findLowerBound(-max, 0, sigDigit);
        lowerBound = findLowerBound(min, 0, sigDigit);
    }
    return [lowerBound, upperBound];
}