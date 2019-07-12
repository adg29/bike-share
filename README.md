# Bike Share 

## Data schema outline for basic bike sharing system
```
let bike = {
	_id,
	_station, //LastDocked,
	status: ['active', 'docked', 'disabled']
};

let stations = {
	_id,
	lat,
	long,
	name,
	regions
};


let user = {
	_id,
	_bike, //checked out, reference
};

let trip = {
	_user, //reference
	_startStation,
	_endStation,
	_bike,
	startTime,
	endTime
};
```
