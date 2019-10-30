import React, { Component } from 'react';
import { View, Text } from 'react-native';

// ====================================================================================================
//  CUANDO HAGAMOS NUEVA CUENTA EN ALGOLIA ESTE CÓDIGO SE TIENE QUE EJECUTAR PARA ACTUALIZAR EL INDICE
// ====================================================================================================

// import { Button } from './common';

// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import algoliasearch from 'algoliasearch';
// import getEnvVars from '../../environment';

// const { algoliaConfig } = getEnvVars();
// const { appId, searchdApiKey, adminApiKey, commercesIndex } = algoliaConfig;

// const client = algoliasearch(appId, adminApiKey);

// const index = client.initIndex(commercesIndex);

// const buttonPressed = () => {
//   console.log('pressed');
//   const db = firebase.firestore();
//   db.collection('Commerces')
//     .where('softDelete', '==', null)
//     .onSnapshot(snapShot => {
//       snapShot.forEach(docSnapShot => {
//         const id = docSnapShot.id;
//         const doc = docSnapShot.data();
//         index.addObject({
//           objectID: id,
//           address: doc.address,
//           areaName: doc.area.name,
//           profilePicture: doc.profilePicture,
//           description: doc.description,
//           name: doc.name,
//           city: doc.city,
//           provinceName: doc.province.name
//         });
//       });
//     });
// };

class EmptyScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch'
        }}
      >
        <Text style={{ padding: 20, textAlign: 'center' }}>
          Estas pantallas se van a ir reemplazando a medida que vayamos
          agregando las que faltan
        </Text>
        {/* <Button onPress={buttonPressed} /> */}
      </View>
    );
  }
}

export default EmptyScreen;
