import React, { useState } from 'react';
import './App.css';
import db from './seed.js';
import BikeShareAPI from './api.js'

const BikeShare = BikeShareAPI(db);

function User({user, isActiveUser, selectActiveUser}) {
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
        (user._bike) ?
          'Current bike {user._bike}' :
          <button onClick={() => selectActiveUser(user)}>{selectActiveUserButtonLabel} as {user._id}</button>
      }
    </div>
  )
}

const Bike = ({bike, index, selectBike, activeUser}) => {
  return (
    <div className="bike item">
      ID: {bike._id}
      <br/>
      {/*Status: {bike.status}*/}
      <br/>
      {
        bike.status === "active" ?
        `Checked out from` : `Docked`
      } @ Station {bike._station}
      <br/>
      {
        (activeUser && bike.status === "docked") ? 
          (<button onClick={() => selectBike(bike)}>Reserve as {activeUser._id}</button>)
          : ''
      }
    </div>
  )
}

const Trip = ({trip, index}) => (
  <div className="trip item">
    <pre>
      {JSON.stringify(trip, null, 5)}
    </pre>
  </div>
)

function TripForm({addTrip}) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTrip(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function App() {
  const [activeUser, setActiveUser] = useState(null);

  const [users, setUsers] = useState(db.Users);
  const [bikes, setBikes] = useState(db.Bikes);
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

  const selectBike = async (bike, index) => {
    console.log(`selectBike ${JSON.stringify(bike)}`)
    const lookupSelectedBike = bikes.find(b => b._id === bike._id)
    if (lookupSelectedBike) {
      console.log(`found bike ${JSON.stringify(lookupSelectedBike)}`)
      let bikeReserveRequest =  await BikeShare.requestBikeCheckout(activeUser._id, bike._station, bike._id)
      if (bikeReserveRequest) {
        console.log(bikeReserveRequest)

        const updatedBikes = [...bikes]
        updatedBikes[index] = bikeReserveRequest.bike

        let updatedUsers = [...users]
        updatedUsers[activeUser.index] = bikeReserveRequest.user

        let updatedTrips = [...trips]

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

  const addTrip = tripMeatdata => {
    const newTrips = [...trips, {tripMeatdata}]
    setTrips(newTrips)
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
              selectActiveUser={selectActiveUser}
              isActiveUser={isActiveUser}
            />
          )})
        }
      </div>
      <h2>
      Bikes
      </h2>
      <div className="bikes list">
        {bikes.map((bike, index) => (
          <Bike
            key={index}
            index={index}
            bike={bike}
            activeUser={activeUser}
            selectBike={selectBike}
          />
        ))}
      </div>
      <h2>
        Trips
      </h2>
      <div className="trips list">
        {trips.map((trip, index) => (
          <Trip
            key={index}
            index={index}
            trip={trip}
          />
        ))}
      </div>
    </div>
  );
}
export default App;
