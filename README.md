# Bike Share 

## Data schema outline for basic bike sharing system
```
### Bike

	_id,
	_station, //LastDocked,
	status: ['active', 'docked', 'disabled']
### Stations
	_id,
	lat,
	long,
	name,
	regions

### Users
	_id,
	_bike, //checked out, reference

### Trips
	_user, //reference
	_startStation,
	_endStation,
	_bike,
	startTime,
	endTime
```
