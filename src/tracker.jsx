import React from 'react';
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
   
   if (loading) return (
      <div className="spinner-border text-primary" role="status">
         <span className="sr-only">Loading...</span>
      </div>
   );
   if (error) return <div>Error...</div>

   return <Home tracker={data.tracker} refreshTracker={refetch}/>;
};

export default Tracker;