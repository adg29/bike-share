

const main = async () => {
	let db = require('./seed.js');
	console.log(`Seeded bike share with ${JSON.stringify(db, null, 5)}`);

	const getTripData = async (_trip) => {
		let userForTrip = await findUserTrip(_trip);
	};

	const findUserForTrip = (_trip) => {
		// return db.Trips.find((_trip) => _user._id === _idLookup).populate('_user');
	}

	const userCheckoutBike = async (_user, _startStation, _bike) => {
		let userInitiatingCheckout = db.Users.find(user => user._id === _user);
		if (userInitiatingCheckout && !userInitiatingCheckout._bikeCheckedOut) {
			let tripStartMetadata = {
				_user: _user,
				_startStation: _startStation,
				_bike: _bike,
				startTime: new Date()
			};

			db.Trips.push(tripStartMetadata);
			console.log(tripStartMetadata);
			return Promise.resolve({trip: tripStartMetadata, trips: db.Trips});
		} else {
			return Promise.reject(new Error('Not authorized to checkout bikes and initiate trip'));
		}
	};

	const checkoutRequest = await userCheckoutBike('u1', 's1', 'b1');
	console.log(`New trip started`);
	console.log(`${JSON.stringify(checkoutRequest.trip, null, 5)}`);

};

main();
