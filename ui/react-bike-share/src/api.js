let BikeShare = (db) => {
    // console.log(`Seeded bike share with ${JSON.stringify(db, null, 5)}`);

    const _ACTIONS = {
            RESERVE: 'reserve',
            RETURN: 'return'
    };
    const _STATUS = {
            DOCKED: 'docked',
            ACTIVE: 'active',
            DISABLED: 'disabled'
    };

    const userIsClear = async (_user) => {
        let user = db.Users.find(user => user._id === _user)
        if (user && !user._bike) {
            return Promise.resolve(user)
        } else {
            return Promise.resolve(false)
        }
    };

    const userIsActive = async (_user, _bike) => {
        let user = db.Users.find(user => user._id === _user);
        if (user && user._bike === _bike) {
            return user;
        } else {
            return false;
        }
    };

    const bikeIsAvailable = async (_bike) => {
        let bikeRequested = db.Bikes.find(bike => bike._id === _bike);
        if (bikeRequested && bikeRequested.status === _STATUS.DOCKED) {
            return Promise.resolve(bikeRequested);
        } else {
            return Promise.resolve(false);
        }
    };

    const bikeIsActive = async (_bike) => {
        let bikeRequested = db.Bikes.find(bike => bike._id === _bike);
        if (bikeRequested && bikeRequested.status === _STATUS.ACTIVE) {
            return bikeRequested;
        } else {
            return false;
        }
    };

    const bikeReservationRequest = async (ACTION, _user, _station, _bike) => {
        let bikeRequested = db.Bikes.find(bike => bike._id === _bike);

        switch (ACTION) {
            case _ACTIONS.RESERVE:
                console.log(`reserving ${_STATUS.ACTIVE}`)
                bikeRequested.status = _STATUS.ACTIVE;
                bikeRequested._user = _user;
                break;
            case _ACTIONS.RETURN:
                bikeRequested.status = _STATUS.DOCKED;
                bikeRequested._user = null;
                break;
            default:
                Promise.reject(new Error(`Error taking reservation action ${ACTION}`))
                break;
        }

        bikeRequested._station = _station;
        console.log(`bikeReservationRequest ${ACTION} return ${JSON.stringify(bikeRequested)}`)
        Promise.resolve(bikeRequested)
    };

    const tripIdFromDB = () => {
        const tripIds = db.Trips.map(t => parseInt(t._id.substring(1)));
        let largestId = Math.max(...tripIds)
        return `t${(largestId + 1)}`
    }

    const tripStart = async (_user, _startStation, _bike) => {
        let tripStartMetadata = {
            _id: tripIdFromDB(),
            _user: _user,
            _startStation: _startStation,
            _bike: _bike,
            startTime: new Date()
        };
        db.Trips.push(tripStartMetadata);
        console.log(`Starting trip ${tripStartMetadata}`);
        return Promise.resolve({trip: tripStartMetadata, trips: db.Trips});
    };

    const tripEnd = async (_user, _endStation, _bike) => {
        const userWithBike = await userIsActive(_user, _bike)
        if (userWithBike) {
            userWithBike._bike = null;
            console.log(`User updated ${JSON.stringify(userWithBike, null, 5)}`)
            let userTrip = db.Trips.find(t => t._user === _user && t._bike === _bike)
            if (userTrip._bike !== _bike) {
                Promise.reject(new Error(`Error associating user ${_user} with bike ${_bike} on existing trip`))
            }
            userTrip._endStation = _endStation
            userTrip._endTime = new Date()
            Promise.resolve(userTrip);
        } else {
            Promise.reject(new Error(`Error returning bike ${_bike} as user ${_user}`))
        }

    };

    const requestBikeCheckout = async (userRequestingCheckoutId, stationRequestingCheckoutId, bikeToCheckoutId) => {
        const bikeAvailable = await bikeIsAvailable(bikeToCheckoutId)
        const userWithAccess = await userIsClear(userRequestingCheckoutId)
        if (!userWithAccess) {
           throw new Error(`User ${userRequestingCheckoutId} is not clear to checkout a bike`)
        } else if (bikeAvailable) {
            userWithAccess._bike = bikeAvailable._id;
            const bikeCheckoutRequest = await bikeReservationRequest(_ACTIONS.RESERVE, userRequestingCheckoutId, stationRequestingCheckoutId, bikeToCheckoutId);
            const tripStartRequest = await tripStart(userRequestingCheckoutId, stationRequestingCheckoutId, bikeToCheckoutId);

            console.log(`User updated ${JSON.stringify(userWithAccess, null, 5)}`)
            console.log(`Bike updated ${JSON.stringify(bikeCheckoutRequest, null, 5)}`)
            console.log(`New trip started ${JSON.stringify(tripStartRequest.trip, null, 5)}`)
            return {
                user: userWithAccess,
                bike: bikeAvailable,
                trip: tripStartRequest.trip
            }
        } else {
            throw new Error(`Bike ${bikeToCheckoutId} is not available for another trip`);
        }
    };

    const requestBikeReturn = async (userRequestingReturnId, stationRequestingReturnId, bikeToReturnId) => {
        const bikeToReturn = await bikeIsActive(bikeToReturnId)
        if (bikeToReturn) {
            const bikeReturnRequest = await bikeReservationRequest(_ACTIONS.RETURN, userRequestingReturnId, stationRequestingReturnId, bikeToReturnId);
            const tripEndRequest = await tripEnd(userRequestingReturnId, stationRequestingReturnId, bikeToReturnId);

            console.log(`Bike updated ${JSON.stringify(bikeReturnRequest, null, 5)}`)
            console.log(`Trip ended ${JSON.stringify(tripEndRequest, null, 5)}`)
            return {
                user: db.Users.find(u => u._id === userRequestingReturnId),
                bike: bikeToReturn,
                trip: tripEndRequest
            }
        } else {
            throw new Error(`Error returning bike ${bikeToReturnId} to station ${stationRequestingReturnId} as user ${userRequestingReturnId}`);
        }
    };

    const api = {
        requestBikeCheckout: requestBikeCheckout,
        requestBikeReturn: requestBikeReturn,
        ACTIONS: _ACTIONS
    };
    return api;

};

module.exports = BikeShare;