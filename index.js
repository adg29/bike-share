let db = require('./seed.js')
let BikeShare = require('./api.js')(db)

let userIds = db.Users.map(user => user._id)
let stationIds = db.Stations.map(station => station._id)
let bikeIds = db.Bikes.map(bike => bike._id)
BikeShare.requestBikeCheckout(userIds[0], stationIds[0], bikeIds[0])