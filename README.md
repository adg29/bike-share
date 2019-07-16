# Bike Share 

## Data schema outline for basic bike sharing system

#### Conventions:
1. References are prefixes with an underscore character, e.g. `_user: 'u1'`
2. Enums are defined via an array e.g. `status: ['active', 'docked', 'disabled']`

### Bike

	_id,
	_station, //LastDocked,
	status: ['active', 'docked', 'disabled'],
	_user
### Stations
	_id,
	lat,
	long,
	name,
	regions

### Users
	_id,
	_bike, //checked out

### Trips
	_user, 
	_startStation,
	_endStation,
	_bike,
	startTime,
	endTime

