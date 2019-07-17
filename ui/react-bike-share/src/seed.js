let Seed = {
    Stations: [],
    Bikes: [
        {
            _id: 'b1',
            _station: 's1',
            status: 'docked',
            _user: null,
            _trip: null
        },
        {
            _id: 'b2',
            _station: 's1',
            status: 'docked',
            _user: null,
            _trip: null
        },
        {
            _id: 'b3',
            _station: 's2',
            status: 'docked',
            _user: null,
            _trip: null
        },
        {
            _id: 'b4',
            _station: 's2',
            status: 'docked',
            _user: null,
            _trip: null
        }
    ],
    Users: [
        {
            _id: 'u1',
            _trip: null
        },
        {
            _id: 'u2',
            _trip: null
        }
    ],
    Trips: [
        {
            _id: 't1',
            _user: 'u1',
            _startStation: 's1',
            _endStation: 's2',
            _bike: 'b1',
            startDateTime: Date.UTC(2019, 7, 11),//  09:00'
            endDateTime: Date.UTC(2019, 7, 12)//  10:00'
        },
        {
            _id: 't2',
            _user: 'u1',
            _startStation: 's1',
            _endStation: 's2',
            _bike: 'b1',
            startDateTime: Date.UTC(2019, 7, 1),//  21:00'
            endDateTime: Date.UTC(2019, 7, 2)//  22:00'
        }
    ]
};

Seed.Stations = Array(10).fill({})
for (let i in Seed.Stations) {
    Seed.Stations[i] = {
        _id: `s${i}`,
        lat: 54,
        long: 63,
        name: `Station ${i}`
    }
}

module.exports = Seed;