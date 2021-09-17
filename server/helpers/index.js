const average = arr => arr.reduce((acc,v) => acc + v) / arr.length
const roundedAverage = arr => Math.round(average(arr))
const inNumberInRange = (x, min, max) => ((x-min)*(x-max) <= 0)

module.exports = { average, roundedAverage, inNumberInRange }
