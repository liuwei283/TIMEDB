import {minmax} from "crux/dist/utils/math"
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

export function findLowerBound(x, power, sigDigit) {
    if (x <= 0) {
        console.log("Only accept positive values");
        return;
    }
    if (x < Math.pow(10, sigDigit - 1))
        return findLowerBound(10 * x, power + 1, sigDigit);
    else if (x > Math.pow(10, sigDigit))
        return findLowerBound(x / 10, power - 1, sigDigit);
    else
        return Math.floor(x) / Math.pow(10, power);
}

export function computeLog(number, base):number {
    return Math.log(number) / Math.log(base);
}

export function findBoundsForValues(values: number[], sigDigit, isSym:boolean = false) {
    const [min, max] = minmax(values);
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