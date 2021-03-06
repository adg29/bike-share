let Seed = {
	Stations: [
		{
			_id: 's1',
			lat: 34,
			long: 23,
			name: 'Station 1'
		},
		{
			_id: 's2',
			lat: 54,
			long: 63,
			name: 'Station 2'
		}
	],
	Bikes: [
		{
			_id: 'b1',
			_station: 's1',
			status: 'docked'
		},
		{
			_id: 'b2',
			_station: 's1',
			status: 'docked'
		},
		{
			_id: 'b3',
			_station: 's2',
			status: 'docked'
		},
		{
			_id: 'b4',
			_station: 's2',
			status: 'docked'
		}
	],
	Users: [
		{
			_id: 'u1',
			_bike: null
		},
		{
			_id: 'u2',
			_bike: null
		}
	],
	Trips: [
		{
			_user: 'u1',
			_startStation: 's1',
			_endStation: 's2',
			_bike: 's1',
			startDateTime: '07/11/19 09:00',
			endDateTime: '07/11/19 10:00'
		},
		{
			_user: 'u1',
			_startStation: 's1',
			_endStation: 's2',
			_bike: 's1',
			startDateTime: '07/11/19 21:00',
			endDateTime: '07/11/19 22:00'
		}
	]
};

module.exports = Seed;