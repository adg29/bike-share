# Bike Share 

## Pseudo Code for Bike Sharing Data model
```
let bike = {
	_id,
	stationLastDocked,
	dockedStatus: ['active', 'docked', 'disabled']
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
	_bikeCheckedOut: {type: 'ref'}
};

let trip = {
	_user: { type: 'ref'},
	_startStation,
	_endStation,
	_bike,

	startTime,
	endTime
};
```
