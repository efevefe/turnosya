import firebase from 'firebase/app';
import 'firebase/firestore';
import { ON_COMMERCE_REVIEW_VALUE_CHANGE } from './types';

export const commerceReviewValueChange = (prop, value) => {
  return { type: ON_COMMERCE_REVIEW_VALUE_CHANGE, payload: { prop, value } };
};

export const createCommerceReview = commerceId => {
  /*
  const db = firebase.firestore();

  // Get a new write batch
  let batch = db.batch();

  // Set the value of 'NYC'
  let nycRef = db.collection("cities").doc("NYC");
  batch.set(nycRef, {name: "New York City"});

  // Update the population of 'SF'
  let sfRef = db.collection("cities").doc("SF");
  batch.update(sfRef, {"population": 1000000});

  // Delete the city 'LA'
  let laRef = db.collection("cities").doc("LA");
  batch.delete(laRef);

  // Commit the batch
  batch.commit().then(function () {
      // ...
  });


  // option 2
  // Create a ref with auto-generated ID
  var newCityRef = db.collection('cities').doc();

  // ...

  // Add it in the batch
  batch.set(newCityRef, { name: 'New York City' });*/
};
