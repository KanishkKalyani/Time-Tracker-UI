import React, { useEffect } from 'react';
import { useQuery, gql } from "@apollo/client";
import Home from './Home';

const GET_TRACKER = gql`
{
   tracker {
      id
      name
      start
      end
      tags
   }
}
`;

const Tracker = () => {
   const { loading, error, data, refetch } = useQuery(GET_TRACKER);

   useEffect(() => {
      refetch();
   }, [data, refetch]);

   if (loading)   return (
      <div className="d-flex justify-content-center align-items-center add-tracker-spinner">
         <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
         </div>
         <div className="spinner-grow text-success ml-4 mr-4" role="status">
            <span className="sr-only">Loading...</span>
         </div>
         <div className="spinner-grow text-danger" role="status">
            <span className="sr-only">Loading...</span>
         </div>
      </div>
   );

   if (error)  return (
      <div className="d-flex justify-content-center align-items-center error-message">
         <h1 className="text-danger">ERROR OCCURED, PLEASE REFRESH THE PAGE</h1>
      </div>
   );

   if (data)   return <Home tracker={data.tracker} refetchTracker={refetch}/>;
};

export default Tracker;