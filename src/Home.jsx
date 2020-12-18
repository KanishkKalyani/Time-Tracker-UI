import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';
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

const Home = ({ tracker, refetchTracker }) => {
   const [name, setName] = useState('')

   useEffect(() => {
      refetchTracker();
   }, [tracker]);

   const [
      addTrackerInfo,
      { loading: mutationLoading, error: mutationError }
   ] = useMutation(ADD_TRACKER);

   return (
      <div className="container">
         {mutationLoading && 
            <div class="d-flex justify-content-center align-items-center add-tracker-spinner">
               <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only">Loading...</span>
               </div>
               <div class="spinner-grow text-success ml-4 mr-4" role="status">
                  <span class="sr-only">Loading...</span>
               </div>
               <div class="spinner-grow text-danger" role="status">
                  <span class="sr-only">Loading...</span>
               </div>
            </div>
         }

         {mutationError && 
            <div class="d-flex justify-content-center align-items-center error-message">
               <h1 className="text-danger">ERROR OCCURED, PLEASE REFRESH THE PAGE</h1>
            </div>
         }

         <h1 className="d-flex justify-content-center mb-3 text-danger">TRACKER</h1>

         <form 
            className="mb-5"
            onSubmit={async (e) => {
               e.preventDefault();
               if (name) {
                  await addTrackerInfo({variables: {name}});
                  await refetchTracker();
                  setName('');
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
            <Card key={info.id} cardData={info} refetchTracker={refetchTracker}/>
         ))}
      </div>
   );
};

export default Home;