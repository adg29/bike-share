import React, { useState } from 'react';
import './App.css';
import db from './seed.js';

function User({user, index, selectActiveUser}) {
  return (
    <div className="user item">
      ID: {user._id}
      <br/>
      <br/>
      {
        (user._bike) ?
          'Current bike {user._bike}' :
          <button onClick={(e) => selectActiveUser(e, user)}>Start trip as {user._id}</button>
      }
    </div>
  )
}

const Bike = ({bike, index, activeUser}) => {
  return (
    <div className="bike item">
      ID: {bike._id}
      <br/>
      {/*Status: {bike.status}*/}
      <br/>
      {
        bike.status === "active" ?
        `Last Seen` : `Docked`
      } @ Station {bike._station}
      <br/>
      {
        (activeUser && bike.status === "docked") ? 
          (<button>Reserve as {activeUser._id}</button>)
          : ''
      }
    </div>
  )
}

const Trip = ({trip}) => (
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
  console.log(`app activeUser ${JSON.stringify(activeUser)}`)

  const [users, setUsers] = useState(db.Users);
  const [bikes, setBikes] = useState(db.Bikes);
  const [trips, setTrips] = useState(db.Trips);

  const selectActiveUser = (e, user) => {
    e.preventDefault();
    console.log(`selectActiveUser ${JSON.stringify(user)}`)
    const lookupSelectedUser = users.find(u => u._id === user._id)
    if (lookupSelectedUser) {
      console.log(`found user ${JSON.stringify(lookupSelectedUser)}`)
      let newActiveUser = {...lookupSelectedUser}
      setActiveUser(lookupSelectedUser)
    } else {
      throw new Error(`User ${user._id} not found`)
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
        {users.map((user, index) => (
          <User
            key={index}
            index={index}
            user={user}
            selectActiveUser={selectActiveUser}
          />
        ))}
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
      <h3>
      Log a trip
      </h3>
      <TripForm addTrip={addTrip} />
    </div>
  );
}
export default App;
