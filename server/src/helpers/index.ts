const average = (arr: number[]): number => arr.reduce((acc, v) => acc + v) / arr.length;
const roundedAverage = (arr: number[]): number => Math.round(average(arr));
const inNumberInRange = (x: number, min: number, max: number): boolean => ((x - min) * (x - max) <= 0);

export { average, roundedAverage, inNumberInRange };
