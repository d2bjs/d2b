//----Divided line code  ----
 //https://bl.ocks.org/emeeks/03396c05b39b8198685f3e46942c87e3
 const dividedLine = (parameters, points, searchIterations) => {
   let currentParameters = parameters(points[0], 0)
   let currentPointsArray = []
   let dividedLinesData = [ { key: currentParameters, points: currentPointsArray } ]
   points.forEach((point, pointI) => {

     const newParameters = parameters(point, pointI)
     let matchingParams = newParameters === currentParameters;

     if (typeof currentParameters === "object") {
       matchingParams = JSON.stringify(newParameters) === JSON.stringify(currentParameters)
     }

     if (matchingParams) {
       currentPointsArray.push(point)
     } else {
       const lastPoint = currentPointsArray[currentPointsArray.length - 1];
       let pointA = lastPoint;
       let pointB = point;

       for (let x = 0; x < searchIterations; x++) {
         const keys = Object.keys(pointA)
         const findPoints = simpleSearchFunction(pointA, pointB, currentParameters, parameters, keys)
         pointA = findPoints[0]
         pointB = findPoints[1]
       }
       currentPointsArray.push(pointB)
       currentPointsArray = [ pointB, point ]
       dividedLinesData.push({ key: newParameters, points: currentPointsArray })
       currentParameters = newParameters
     }
   })
   return dividedLinesData
 }

 function simpleSearchFunction(pointA, pointB, current, parameters, keys) {
   const betweenPoint = { };
   keys.forEach(key => {
     betweenPoint[key] = typeof pointA[key] === "number" ? (pointA[key] + pointB[key]) / 2 : pointB[key]
   })

   if (JSON.stringify(parameters(betweenPoint)) === JSON.stringify(current)) {
     return [ betweenPoint, pointB ]
   }
   return [ pointA, betweenPoint ]
 }

 function parameters(point) {
   const steve = new Date("7/9/1997")
   if (new Date(point.Date) < steve) {
     return "AAPL Before Steve Jobs Returns"
   }
   if (point.Close > 100) {
     return "AAPL Above $100"
   }
   return "AAPL"
 }

 //----Finish divided line----
