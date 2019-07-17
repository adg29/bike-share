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
        if (user && !user._bike && !user._trip) {
            return user
        } else {
            return false
        }
    };

    const userIsActive = async (_user, bike) => {
        let user = db.Users.find(user => user._id === _user);
        if (user && user._bike === bike._id && user._trip === bike._trip) {
            return user;
        } else {
            return false;
        }
    };

    const bikeIsAvailable = async (_bike) => {
        let bikeRequested = db.Bikes.find(bike => bike._id === _bike);
        if (bikeRequested && bikeRequested.status === _STATUS.DOCKED) {
            return bikeRequested;
        } else {
            return false;
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
                bikeRequested.status = _STATUS.ACTIVE
                bikeRequested._user = _user
                break;
            case _ACTIONS.RETURN:
                bikeRequested.status = _STATUS.DOCKED
                bikeRequested._user = null
                break
            default:
                return new Error(`Error taking reservation action ${ACTION}`)
                break
        }

        bikeRequested._station = _station;
        console.log(`bikeReservationRequest ${ACTION} return ${JSON.stringify(bikeRequested)}`)
        return bikeRequested
    };

    const tripIdFromDB = () => {
        const tripIds = db.Trips.map(t => parseInt(t._id.substring(1)))
        let largestId = Math.max(...tripIds)
        return `t${(largestId + 1)}`
    }

    const tripStart = async (user, _startStation, bike) => {
        let tripStartMetadata = {
            _id: tripIdFromDB(),
            _user: user._id,
            _startStation: _startStation,
            _bike: bike._id,
            startTime: new Date()
        };
        db.Trips.push(tripStartMetadata);

        user._bike = tripStartMetadata._bike
        user._trip = tripStartMetadata._id

        bike._trip = tripStartMetadata._id

        console.log(`Trip started ${tripStartMetadata}`)
        console.log(`User trip updated ${tripStartMetadata._id}`)
        console.log(`Bike trip updated ${tripStartMetadata._id}`)
        return tripStartMetadata
    };

    const tripEnd = async (_user, _endStation, bike) => {
        const userWithBike = await userIsActive(_user, bike)
        if (userWithBike) {
            let userTrip = db.Trips.find(t => t._id === bike._trip)
            userTrip._endStation = _endStation
            userTrip._endTime = new Date()

            userWithBike._bike = null;
            userWithBike._trip = null;
            console.log(`User bike and trip updated ${JSON.stringify(userWithBike, null, 5)}`)
            return userTrip;
        } else {
            return new Error(`Error associating user ${_user} with bike ${bike._id} on existing trip`)
        }

    };

    const requestBikeCheckout = async (userRequestingCheckoutId, stationRequestingCheckoutId, bikeToCheckoutId) => {
        const bikeAvailable = await bikeIsAvailable(bikeToCheckoutId)
        const userWithAccess = await userIsClear(userRequestingCheckoutId)
        if (!userWithAccess) {
           throw new Error(`User ${userRequestingCheckoutId} is not clear to checkout a bike`)
        } else if (bikeAvailable) {
            const bikeCheckoutRequest = await bikeReservationRequest(_ACTIONS.RESERVE, userRequestingCheckoutId, stationRequestingCheckoutId, bikeToCheckoutId);
            const tripStartRequest = await tripStart(userWithAccess, stationRequestingCheckoutId, bikeAvailable);

            console.log(`Bike updated ${JSON.stringify(bikeCheckoutRequest, null, 5)}`)
            console.log(`New trip started ${JSON.stringify(tripStartRequest, null, 5)}`)
            return {
                user: db.Users.find(u => u._id === userRequestingCheckoutId),
                bike: bikeAvailable,
                trip: tripStartRequest
            }
        } else {
            throw new Error(`Bike ${bikeToCheckoutId} is not available for another trip`);
        }
    };

    const requestBikeReturn = async (userRequestingReturnId, stationRequestingReturnId, bikeToReturnId) => {
        const bikeToReturn = await bikeIsActive(bikeToReturnId)
        if (bikeToReturn) {
            const bikeReturnRequest = await bikeReservationRequest(_ACTIONS.RETURN, userRequestingReturnId, stationRequestingReturnId, bikeToReturnId);
            const tripEndRequest = await tripEnd(userRequestingReturnId, stationRequestingReturnId, bikeReturnRequest);

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