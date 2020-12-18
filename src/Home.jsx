import React, { useState } from 'react';
import Card from './Card';
import { useMutation, gql } from "@apollo/client";

const ADD_TRACKER = gql`
   mutation Create($name: String!) {
      addTrack(
         name: $name
      ) {
         id
         name
         start
         end
         tags
      }
   }`

const Home = ({ tracker, refreshTracker }) => {
   const [name, setName] = useState('')

   const [addTrackerInfo] = useMutation(ADD_TRACKER);

   return (
      <div className="container">
         <h1 className="d-flex justify-content-center mb-3 text-danger">TRACKER</h1>

         <form 
            className="mb-5"
            onSubmit={(e) => {
               e.preventDefault();
               if (name) {
                  addTrackerInfo({variables: {name}});
                  refreshTracker();
                  setName('')
               }
            }}>
            <div className="form-group">
               <label>Name:</label>
               <input type="name" className="form-control" placeholder="Enter Tracker name..."
               value={name}
               onChange={e => (setName(e.target.value))}/>
               <small className="form-text text-muted">Add the name of track</small>
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
         </form>

         {tracker.map( (info) => (
            <Card key={info.id} cardData={info} refreshTracker={refreshTracker}/>
         ))}
      </div>
   );
};

export default Home;