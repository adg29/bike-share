import React, { useState } from 'react';
import './App.css';
import db from './seed.js';
import BikeShareAPI from './api.js'

const BikeShare = BikeShareAPI(db);

const User = ({user, isActiveUser, activeTrip, selectActiveUser}) => {
    let classNames = ["user", "item"]
    let selectActiveUserButtonLabel = null
    if (isActiveUser) {
        selectActiveUserButtonLabel = "Reserving"
    } else {
        selectActiveUserButtonLabel = "Start trip"
    }
    if (isActiveUser) classNames.push("active")
    return (
        <div className={classNames.join(" ")}>
            ID: {user._id}
            <br/>
            <br/>
            {
                (user._bike && user._trip) ?
                    (`Current bike ${user._bike}`) : ''
            }
            <br/>
            <button 
                onClick={() => selectActiveUser(user)}
                disabled={(activeTrip && activeTrip._user !== user._id) ? 'disabled' : ''}
            >
                {selectActiveUserButtonLabel} as {user._id}
            </button>
        </div>
    )
}

const Bike = ({bike, index, isActiveBike, activeUser, activeTrip, updateBikeReservation}) => {
  let classNames = ["bike", "item"]
  if (isActiveBike) classNames.push("active")
  return (
    <div className={classNames.join(" ")}>
      ID: {bike._id}
      <br/>
      <br/>
      {
        bike.status === "active" ?
        `Checked out from` : `Docked`
      } @ Station {bike._station}
      <br/>
      {
        (activeUser && !activeTrip && bike.status === "docked") ? 
          (<button onClick={() => updateBikeReservation(BikeShare.ACTIONS.RESERVE, bike, index)}>Reserve as {activeUser._id}</button>)
          : ''
      }
      {
        (activeUser && bike.status === "active") ? 
          (<button onClick={() => updateBikeReservation(BikeShare.ACTIONS.RETURN, bike, index)}>Return as {activeUser._id}</button>)
          : ''
      }
    </div>
  )
}

const Station = ({station, index}) => (
  <div className="station item">
    <pre>
      {JSON.stringify(station, null, 5)}
    </pre>
  </div>
)

const Trip = ({trip, index, isActiveTrip, activeUser}) => {
    let classNames = ["trip", "item"]
    if (isActiveTrip) classNames.push("active")
    return (
        <div className={classNames.join(" ")}>
            <pre>
            {JSON.stringify(trip, null, 5)}
            </pre>
        </div>
    )
}

function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [activeBike, setActiveBike] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);

  const [users, setUsers] = useState(db.Users);
  const [bikes, setBikes] = useState(db.Bikes);
  const [stations, setStations] = useState(db.Stations);
  const [trips, setTrips] = useState(db.Trips);

  const selectActiveUser = (user) => {
    console.log(`selectActiveUser ${JSON.stringify(user)}`)
    // const lookupSelectedUser = users.find(u => u._id === user._id)
    if (user) {
      // console.log(`found user ${JSON.stringify(lookupSelectedUser)}`)
      let newActiveUser = {...user}
      setActiveUser(newActiveUser)
    } else {
      throw new Error(`User ${user._id} not found`)
    }
  }

  const updateBikeReservation = async (ACTION, bike, index) => {
    console.log(`updateBikeReservation ${ACTION} ${JSON.stringify(bike)}`)
    const lookupSelectedBike = bikes.find(b => b._id === bike._id)
    if (lookupSelectedBike) {
      console.log(`found bike ${JSON.stringify(lookupSelectedBike)}`)
      let stationForAction = null
      let bikeReserveRequest = null
      if (ACTION === BikeShare.ACTIONS.RESERVE) {
        stationForAction = bike._station
        bikeReserveRequest =  await BikeShare.requestBikeCheckout(activeUser._id, stationForAction, bike._id)
      } else {
        stationForAction = stations[Math.floor(Math.random() * stations.length)]._id
        bikeReserveRequest =  await BikeShare.requestBikeReturn(activeUser._id, stationForAction, bike._id)
      }

      if (bikeReserveRequest) {
        console.log('bikeReserveRequest')
        console.log(bikeReserveRequest)

        const updatedBikes = [...bikes]
        updatedBikes[index] = bikeReserveRequest.bike

        if (ACTION === BikeShare.ACTIONS.RESERVE) {
          setActiveBike(lookupSelectedBike)
          setActiveTrip(bikeReserveRequest.trip)
        } else if (ACTION === BikeShare.ACTIONS.RETURN) {
          setActiveBike(null)
          setActiveTrip(null)
        }

        let updatedUsers = [...users]
        updatedUsers[activeUser.index] = bikeReserveRequest.user

        let updatedTrips = [...db.Trips]

        console.log('users', updatedUsers, 'bikes', updatedBikes, 'trips', updatedTrips)
        setUsers(updatedUsers)
        setBikes(updatedBikes)
        setTrips(updatedTrips)

        setActiveUser(bikeReserveRequest.user)
      }
    } else {
      throw new Error(`Bike ${bike._id} not found`)
    }
  }

  return (
    <div className="app">
      <h2>
        User:
      </h2>
      <div className="users list">
        {
          users.map((user, index) => {
          let isActiveUser = activeUser && user._id === activeUser._id ? true : false;
          return (
            <User
              key={index}
              index={index}
              user={user}
              isActiveUser={isActiveUser}
              selectActiveUser={selectActiveUser}
              activeTrip={activeTrip}
            />
          )})
        }
      </div>
      <h2>
      Bikes
      </h2>
      <div className="bikes list">
        {bikes.map((bike, index) => {
          let isActiveBike = activeBike && bike._id === activeBike._id ? true : false
          return (
            <Bike
              key={index}
              index={index}
              bike={bike}
              isActiveBike={isActiveBike}
              activeUser={activeUser}
              activeTrip={activeTrip}
              updateBikeReservation={updateBikeReservation}
            />
          )})
      }
      </div>
        <h2>
        Trips
        </h2>
        <div className="trips list">
        {trips.sort((ta,tb) => tb._id.substring(1) - ta._id.substring(1)).map((trip, index) => {
            let isActiveTrip = activeTrip && trip._id === activeTrip._id ? true : false
            return (
                <Trip
                    key={index}
                    index={index}
                    trip={trip}
                    isActiveTrip={isActiveTrip}
                    activeUser={activeUser}
                />
            )})
        }
      </div>
    </div>
  );
}
export default App;
