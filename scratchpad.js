let BikeShare = (db) => {
	console.log(`Seeded bike share with ${JSON.stringify(db, null, 5)}`);

    const userIsClear = async (_user) => {
        let user = db.Users.find(user => user._id == _user);
        if (user && !user._bike) {
        	return user;	
        } else {
        	return false;
        }
    };

	const bikeIsAvailable = async (_bike) => {
		let bikeRequested = db.Bikes.find(bike => bike._id == _bike);
		if (bikeRequested && bikeRequested.status == 'docked') {
			return bikeRequested;
		} else {
			return false;
		}
	};

	const bikeCheckout = async (_user, _startStation, _bike) => {
		let bikeRequested = db.Bikes.find(bike => bike._id == _bike);
		bikeRequested.status = 'active';
        bikeRequested._station = _startStation;
        bikeRequested._user = _user;
		return bikeRequested;
	};

	const tripStart = async (_user, _startStation, _bike) => {
		let tripStartMetadata = {
			_user: _user,
			_startStation: _startStation,
			_bike: _bike,
			startTime: new Date()
		};
		db.Trips.push(tripStartMetadata);
		console.log(tripStartMetadata);
		return Promise.resolve({trip: tripStartMetadata, trips: db.Trips});
	};

    const requestBikeCheckout = async (userRequestingCheckoutId, bikeToCheckoutId) => {
        const bikeAvailable = await bikeIsAvailable(bikeToCheckoutId);
        const userWithAccess = await userIsClear(userRequestingCheckoutId);
        if (!userWithAccess) {
            throw new Error(`User ${userRequestingCheckoutId} is not clear to checkout a bike`);``
        } else if (bikeAvailable) {
            userWithAccess._bike = bikeAvailable._id;
            const bikeCheckoutRequest = await bikeCheckout('u1', 's1', 'b1');
            const tripStartRequest = await tripStart('u1', 's1', 'b1');

            console.log(`User updated ${JSON.stringify(userWithAccess, null, 5)}`)
            console.log(`Bike updated ${JSON.stringify(bikeAvailable, null, 5)}`)
            console.log(`New trip started ${JSON.stringify(tripStartRequest.trip, null, 5)}`)
        } else {
            throw new Error(`Bike ${bikeToCheckoutId} is not available for another trip`);
        }
    };

    const api = {
    	requestBikeCheckout: requestBikeCheckout
    };
    return api;

};

module.exports = BikeShare;