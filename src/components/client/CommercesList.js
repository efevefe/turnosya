import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { InstantSearch, Configure } from 'react-instantsearch/native';
import { IconButton } from '../common';
import getEnvVars from '../../../environment';
import ConnectedHits from './CommercesList.SearchHits';
import ConnectedSearchBox from './CommercesList.SearchBox';
import ConnectedStateResults from './CommercesList.StateResults';
import { readFavoriteCommerces } from '../../actions';

import MapSearch from './PruebaLocaDou';
import { Fab } from 'native-base';
import { MAIN_COLOR } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

const { appId, searchApiKey, commercesIndex } = getEnvVars().algoliaConfig;

class CommercesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areaName: props.navigation.state.params.areaName, // Mover esto a Redux
      searchVisible: false,
      showingMap: false
    };
  }

  componentDidMount() {
    this.props.readFavoriteCommerces();

    this.props.navigation.setParams({
      rightIcons: this.renderRightButtons(),
      header: undefined
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Buscar negocios',
      headerRight: navigation.getParam('rightIcons'),
      header: navigation.getParam('header')
    };
  };

  renderRightButtons = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        <IconButton icon="md-search" onPress={this.onSearchPress} />
        <IconButton icon="ios-funnel" onPress={this.onFiltersPress} />
      </View>
    );
  };

  onSearchPress = async () => {
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
      return (
        <ConnectedSearchBox
          autoFocus={true}
          showLoadingIndicator
          onCancel={this.onCancelPress}
        />
      );
    }
  };

  obtainFacetProps = () => {
    if (this.state.areaName && this.props.provinceNameFilter)
      return {
        filters: `areaName:\'${this.state.areaName}\' AND provinceName:\'${this.props.provinceNameFilter}\'`
      };
    else if (this.state.areaName)
      return { filters: `areaName:\'${this.state.areaName}\'` };
    else if (this.props.provinceNameFilter)
      return { filters: `provinceName:\'${this.props.provinceNameFilter}\'` };
    else return null;
  };

  obtainGeolocationProps = () => {
    return this.props.locationEnabled
      ? {
          aroundLatLng: `${this.props.latitude}, ${this.props.longitude}`,
          aroundRadius: Math.round(1000 * this.props.locationRadiusKms)
        }
      : null;
  };

  onMapFabPress = () => {
    this.setState({ showingMap: !this.state.showingMap });
  };

  renderResults = () => {
    return this.state.showingMap ? <MapSearch /> : <ConnectedHits />;
  };

  render() {
    return (
      <InstantSearch
        appId={appId}
        apiKey={searchApiKey}
        indexName={commercesIndex}
        stalledSearchDelay={0}
        root={{
          Root: View, // component to render as the root of InstantSearch
          props: { style: { flex: 1 } } // props that will be applied on the root component aka View
        }}
      >
        {this.renderAlgoliaSearchBar()}
        <Configure
          {...{ ...this.obtainFacetProps(), ...this.obtainGeolocationProps() }}
        />
        <ConnectedStateResults />
        {/* <MapSearch /> */}
        {/* <ConnectedHits /> */}
        {this.renderResults()}
        <Fab
          style={{ backgroundColor: MAIN_COLOR }}
          position="bottomRight"
          onPress={this.onMapFabPress}
        >
          <Ionicons name="md-pin" />
        </Fab>
      </InstantSearch>
    );
  }
}

const mapStateToProps = state => {
  const {
    refinement,
    favoriteCommerces,
    provinceNameFilter,
    locationEnabled,
    locationRadiusKms
  } = state.commercesList;
  const { latitude, longitude } = state.locationData;

  return {
    refinement,
    favoriteCommerces,
    provinceNameFilter,
    locationEnabled,
    locationRadiusKms,
    latitude,
    longitude
  };
};

export default connect(
  mapStateToProps,
  { readFavoriteCommerces }
)(CommercesList);
