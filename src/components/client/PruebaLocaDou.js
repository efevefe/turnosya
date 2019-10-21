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
      provider={MapView.PROVIDER_GOOGLE}
      initialRegion={{
        latitude: -27.7729,
        longitude: -64.2675,
        latitudeDelta: 0.0382,
        longitudeDelta: LONGITUDE_DELTA
      }}
      showsUserLocation={true}
      style={styles.map}
    >
      {hits.map(hit => {
        <Marker
          key={hit.objectID}
          coordinate={{
            latitude: hit._geoloc.lat,
            longitude: hit._geoloc.lng
          }}
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
