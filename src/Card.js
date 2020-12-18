import React, { useEffect, useState } from 'react';
import { useMutation, gql } from "@apollo/client";

const EDIT_TRACKER = gql`
   mutation Update(
      $id: ID!
      $name: String!
      $start: String!
      $end: String!
      $tags: [String!]
   ) {
      editTrack(
         id: $id
         name: $name
         start: $start
         end: $end
         tags: $tags
      ) {
         id
         name
         start
         end
         tags
      }
   }`;

const DELETE_TRACKER = gql`
   mutation Delete($id: ID!) {
      deleteTrack(id: $id) {
      ok
      }
   }`;


const Card = ({cardData, refreshTracker}) => {
   const [info, setInfo] = useState(cardData);

   useEffect(() => {
      setInfo(cardData);
   },[cardData]);

   const [editTrackerInfo] = useMutation(EDIT_TRACKER);
   const [deleteTrackerInfo] = useMutation(DELETE_TRACKER);

   const editTrack = () => {
      editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: info.start,
         end: info.end
      }});
      refreshTracker();
   };

   const deleteTrack = () => {
      deleteTrackerInfo({variables: {id: info.id}});
      refreshTracker();
   };

   const editNameInput = e => {
      if(e.target.value){
         setInfo({
            ...info,
            name: e.target.value
         })
      }
   };

   const deleteCardTag = (index) => {
      const tempTags = [...info.tags];
      tempTags.splice(index, 1);   
      editTagsOfTrack(tempTags);
   };

   const editCardTag = (e, index) => {
      if(e.target.value) {
         const tempTags = [...info.tags];
         tempTags[index] = e.target.value;
         editTagsOfTrack(tempTags);
      }
   };

   const editStartTime = () => {
      const timeStr = new Date().toLocaleString();

      editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: timeStr,
         end: info.end
      }});
      refreshTracker();
   }

   const editEndTime = () => {
      const timeStr = new Date().toLocaleString();

      editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: info.start,
         end: timeStr,
      }});
   }

   const editTagsOfTrack = (tagsArr) => {

      editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: info.start,
         end: info.end,
         tags: tagsArr
      }});
   }

   const addNewTagToTrack = () => {
      const tagsArr = [...info.tags, "New Tag"];

      editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: info.start,
         end: info.end,
         tags: tagsArr
      }});
   }

   return (
      <div className="card" style={{'width': '100%', 'marginTop': '10px'}}>
         <div className="card-body">
            <div className="d-flex justify-content-between">
               <div className="input-group mb-3">
                  <input 
                     type="name"
                     placeholder="Name..."
                     className="form-control col-3"
                     value={info.name}
                     maxLength="20"
                     onChange={editNameInput}/>

                  <div className="input-group-append">
                     <button 
                        className="btn btn-outline-secondary"
                        type="button" 
                        onClick={editTrack}
                        >Save Changes
                     </button>
                  </div>
               </div>
            </div>

               {info.tags.map((val, index) => (
                  <span className="input-group mb-3">
                  <input 
                     type="tag"
                     placeholder="Tag..."
                     className="form-control col-2"
                     value={val}
                     maxLength="10"
                     onChange={(e) => editCardTag(e, index)}/>
   
                  <div className="input-group-append">
                     <button 
                        className="btn btn-outline-secondary"
                        type="button" 
                        onClick={() => deleteCardTag(index)}
                        >X
                     </button>
                  </div>
                  </span>
               ))}


            <button 
               className="btn btn-success" 
               onClick={addNewTagToTrack} 
               disabled={info.tags.length >=5}>
                  Add New Tag +
               </button>

            <h6 className="card-subtitle mb-2 text-muted mt-3">Start: {info.start}</h6>

            <h6 className="card-subtitle mb-2 text-muted mt-3">End: {info.end}</h6>

            <div className="d-flex justify-content-between mt-4">
               <button 
                  className="btn btn-success" 
                  onClick={editStartTime} 
                  disabled={info.start}>
                     Start Time
               </button>

               <button 
                  className="btn btn-info" 
                  onClick={editEndTime} 
                  disabled={!info.start || info.end}>
                     Stop Time
               </button>

               <button 
                  className="btn btn-danger" 
                  onClick={deleteTrack}>
                  Delete Track
               </button>
            </div>
         </div>
      </div>
   )
};

export default Card;