import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { connectGeoSearch } from 'react-instantsearch-native';
import MapView, { Marker } from 'react-native-maps';

const { height, width } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04864195044303443;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapSearch = connectGeoSearch(({ hits }) => {
  return (
    <MapView
      ref={map => (this.map = map)}
      loadingEnabled={true}
      initialRegion={{
        latitude: -31.4229,
        longitude: -64.1675,
        latitudeDelta: 0.0382,
        longitudeDelta: LONGITUDE_DELTA
      }}
      showsUserLocation
      style={styles.map}
    >
      {hits.map(hit => {
        console.log(hit);
        <Marker
          key={hit.objectID}
          coordinate={{
            latitude: hit._geoloc.lat,
            longitude: hit._geoloc.lng
          }}
          title={hit.name}
          description={hit.description}
        />;
      })}
    </MapView>
  );
});

export default MapSearch;

const styles = StyleSheet.create({
  map: {
    position: 'relative',
    height: '100%',
    width: '100%'
  }
});
