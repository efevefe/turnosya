import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { InstantSearch, Configure } from 'react-instantsearch/native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import algoliasearch from 'algoliasearch';
import { MAIN_COLOR } from '../../constants';
import { IconButton } from '../common';
import getEnvVars from '../../../environment';
import ConnectedHits from './CommercesList.SearchHits';
import ConnectedSearchBox from './CommercesList.SearchBox';
import ConnectedStateResults from './CommercesList.StateResults';
import { onFavoriteCommercesRead, onCommercesListValueChange, onSelectedLocationChange } from '../../actions';

const { appId, searchApiKey, commercesIndex } = getEnvVars().algoliaConfig;

const searchClient = algoliasearch(appId, searchApiKey, { _useRequestCache: true });

class CommercesList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
          <IconButton
            icon="md-search"
            containerStyle={{ paddingRight: 0 }}
            onPress={navigation.getParam('onSearchPress')}
          />
          <IconButton icon="ios-funnel" onPress={navigation.getParam('onFiltersPress')} />
        </View>
      ),
      header: navigation.getParam('header')
    };
  };

  state = { areaName: this.props.navigation.state.params.areaName, searchVisible: false };

  componentDidMount() {
    this.props.navigation.setParams({
      onSearchPress: this.onSearchPress,
      onFiltersPress: this.onFiltersPress,
      header: undefined
    });

    this.props.onFavoriteCommercesRead();
    if (this.props.provinceNameFilter == null) {
      this.props.onCommercesListValueChange({ provinceNameFilter: this.props.provinceClientName });
    }
  }

  componentWillUnmount() {
    this.onFiltersClear();
  }

  onFiltersClear = () => {
    this.props.onCommercesListValueChange({
      locationButtonIndex: 0,
      provinceNameFilter: this.props.provinceClientName ? this.props.provinceClientName : ''
    });
    this.props.onSelectedLocationChange();
  };

  onSearchPress = () => {
    this.props.navigation.setParams({ header: null });
    this.setState({ searchVisible: true });
  };

  onFiltersPress = () => {
    this.props.navigation.navigate('commercesFiltersScreen');
  };

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false });
  };

  renderAlgoliaSearchBar = () => {
    if (this.state.searchVisible) {
      return <ConnectedSearchBox autoFocus={true} showLoadingIndicator onCancel={this.onCancelPress} />;
    }
  };

  obtainFacetProps = () => {
    if (this.state.areaName && this.props.provinceNameFilter)
      return { filters: `areaName:\'${this.state.areaName}\' AND provinceName:\'${this.props.provinceNameFilter}\'` };
    else if (this.state.areaName) return { filters: `areaName:\'${this.state.areaName}\'` };
    else if (this.props.provinceNameFilter) return { filters: `provinceName:\'${this.props.provinceNameFilter}\'` };
    else return null;
  };

  obtainGeolocationProps = () => {
    return this.props.selectedLocation.latitude
      ? {
          aroundLatLng: `${this.props.selectedLocation.latitude}, ${this.props.selectedLocation.longitude}`,
          aroundRadius: Math.round(1000 * this.props.locationRadiusKms)
        }
      : null;
  };

  onMapFabPress = () => {
    this.props.navigation.navigate('commercesListMap');
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <InstantSearch searchClient={searchClient} indexName={commercesIndex} stalledSearchDelay={0}>
          {this.renderAlgoliaSearchBar()}
          <Configure {...{ ...this.obtainFacetProps(), ...this.obtainGeolocationProps() }} />
          <ConnectedStateResults />
          <ConnectedHits />
          <Fab style={{ backgroundColor: MAIN_COLOR }} position="bottomRight" onPress={this.onMapFabPress}>
            <Ionicons name="md-compass" />
          </Fab>
        </InstantSearch>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { refinement, favoriteCommerces, provinceNameFilter, locationRadiusKms } = state.commercesList;
  const { address, city, provinceName, country, latitude, longitude, selectedLocation } = state.locationData;

  return {
    refinement,
    favoriteCommerces,
    provinceNameFilter,
    locationRadiusKms,
    address,
    city,
    provinceName,
    country,
    latitude,
    longitude,
    selectedLocation,
    provinceClientName: state.clientData.province.name
  };
};

export default connect(mapStateToProps, {
  onFavoriteCommercesRead,
  onCommercesListValueChange,
  onSelectedLocationChange
})(CommercesList);
