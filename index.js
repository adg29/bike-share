let db = require('./seed.js')
let BikeShare = require('./scratchpad.js')(db)

let userIds = db.Users.map(user => user._id)
let bikeIds = db.Bikes.map(bike => bike._id)
BikeShare.requestBikeCheckout(userIds[0], bikeIds[0])