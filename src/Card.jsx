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


const Card = ({cardData, refetchTracker}) => {
   const [info, setInfo] = useState(cardData);

   useEffect(() => {
      setInfo(cardData);
   },[cardData]);

   const [
      editTrackerInfo,
      { loading: editMutationLoading, error: editMutationError }
   ] = useMutation(EDIT_TRACKER);

   const [
      deleteTrackerInfo,
      { loading: deleteMutationLoading, error: deleteMutationError }
   ] = useMutation(DELETE_TRACKER);

   const editTrack = async () => {
      await editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: info.start,
         end: info.end
      }});

      refetchTracker();
   };

   const deleteTrack = async () => {
      await deleteTrackerInfo({variables: {id: info.id}});
      refetchTracker();
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

   const editCardTag = (index) => {
         editTagsOfTrack(info.tags);
   };

   const editStartTime = async () => {
      const timeStr = new Date().toLocaleString();

      await editTrackerInfo({variables: {
         id: info.id,
         name: info.name,
         start: timeStr,
         end: info.end
      }});

      refetchTracker();
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
         { (deleteMutationLoading || editMutationLoading) && 
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
         }

         {(deleteMutationError|| editMutationError) && 
            <div className="d-flex justify-content-center align-items-center error-message">
               <h1 className="text-danger">ERROR OCCURED, PLEASE REFRESH THE PAGE</h1>
            </div>
         }

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
                  <span key={index} className="input-group mb-3">
                  <input 
                     type="tag"
                     placeholder="Tag..."
                     className="form-control col-2"
                     value={val}
                     maxLength="10"
                     minLength="1"
                     onChange={(e) => {
                        const tempTags = [...info.tags];
                        tempTags[index] = e.target.value;

                        setInfo({
                           ...info,
                           tags: tempTags
                        });
                     }}/>
   
                  <div className="input-group-append">
                     <button 
                        className="btn btn-outline-secondary"
                        type="button" 
                        onClick={() => editCardTag(index)}
                        >Save
                     </button>
                  </div>

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
               disabled={info.tags.length >= 4}>
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
                  disabled={!info.start || !info.end}
                  onClick={deleteTrack}>
                  Delete Track
               </button>
            </div>
         </div>
      </div>
   )
};

export default Card;