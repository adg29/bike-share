import React, { useState } from 'react';
import './App.css';
import db from './seed.js';


function App() {
  console.log(db);
  const [users, setUsers] = useState(db.Users);
  const [bikes, setBikes] = useState(db.Bikes);
  const [trips, setTrips] = useState(db.Trips);

  const Bike = ({bike}) => (
    <div className="bike item">
      ID: {bike._id}
      <br/>
      {/*Status: {bike.status}*/}
      <br/>
      {
        bike.status === "active" ?
        `Last Seen` : `Docked`
      } @ Station {bike._station}
    </div>
  )
  

  const Trip = ({trip}) => (
    <div className="trip item">
      <pre>
        {JSON.stringify(trip, null, 5)}
      </pre>
    </div>
  )

  return (
    <div className="app">
      <h2>
      Bikes
      </h2>
      <div className="bikes list">
      {bikes.map((bike, index) => (
        <Bike
          key={index}
          index={index}
          bike={bike}
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
