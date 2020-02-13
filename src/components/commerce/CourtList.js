import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, StyleSheet } from 'react-native';
import { Fab } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Spinner, EmptyList, IconButton } from '../common';
import CourtListItem from './CourtListItem';
import { onCourtFormOpen } from '../../actions';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../../constants';
import { SearchBar } from 'react-native-elements';
import Constants from 'expo-constants';

class CourtList extends Component {
  state = { search: '', searchVisible: false, courtsSearching: [] };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcons: this.renderRightButtons(),
      header: undefined
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcons'),
      header: navigation.getParam('header')
    };
  };

  renderRightButtons = () => {
    return (
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        <IconButton icon="md-search" containerStyle={{ paddingRight: 0 }} onPress={this.onSearchPress} />
      </View>
    );
  };

  onSearchPress = () => {
    this.props.navigation.setParams({ header: null });
    this.setState({ searchVisible: true });
  };

  onCancelPress = () => {
    this.props.navigation.setParams({ header: undefined });
    this.setState({ searchVisible: false, search: '' });
  };

  onAddPress = () => {
    this.props.onCourtFormOpen();
    this.props.navigation.navigate('courtForm');
  };

  isCourtDisabled = court => {
    const { disabledTo, disabledFrom } = court;
    return disabledFrom && (!disabledTo || disabledTo >= moment());
  };

  renderRow({ item }) {
    return (
      <CourtListItem
        court={{
          ...item,
          disabled: this.isCourtDisabled(item)
        }}
        commerceId={this.props.commerceId}
        navigation={this.props.navigation}
      />
    );
  }

  renderList = () => {
    if (this.props.courts.length) {
      return (
        <FlatList
          data={this.state.search === '' ? this.props.courts : this.state.courtsSearching}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={court => court.id}
          contentContainerStyle={{ paddingBottom: 95 }}
        />
      );
    }

    return <EmptyList title="No hay ninguna cancha" />;
  };

  courtsFilter(text) {
    this.setState({ search: text });

    this.setState({
      courtsSearching: this.props.courts.filter(
        court =>
          court.name
            .toLowerCase()
            .trim()
            .includes(text.toLowerCase().trim()) || court.court.toLowerCase().includes(text.toLowerCase())
      )
    });
  }

  renderSearchBar = () => {
    if (this.state.searchVisible === true) {
      return (
        <View style={styles.mainContainer}>
          <SearchBar
            placeholder="Buscar servicios.."
            value={this.state.search}
            onChangeText={text => this.courtsFilter(text)}
            platform="android"
            containerStyle={styles.searchBarContainer}
            inputStyle={{ marginTop: 1, marginLeft: 12, marginRight: 0 }}
            onCancel={() => this.onCancelPress()}
            searchIcon={{ color: MAIN_COLOR }}
            cancelIcon={{ color: MAIN_COLOR }}
            clearIcon={{ color: MAIN_COLOR }}
            loadingProps={{ color: MAIN_COLOR }}
            selectionColor={MAIN_COLOR}
            autoFocus
          />
        </View>
      );
    }
  };
  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        {this.renderSearchBar()}

        {this.renderList()}
        <Fab style={{ backgroundColor: MAIN_COLOR }} position="bottomRight" onPress={() => this.onAddPress()}>
          <Ionicons name="md-add" />
        </Fab>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: NAVIGATION_HEIGHT + Constants.statusBarHeight,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: MAIN_COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  searchBarContainer: {
    alignSelf: 'stretch',
    height: NAVIGATION_HEIGHT,
    paddingTop: 4,
    paddingRight: 5,
    paddingLeft: 5,
    marginTop: Constants.statusBarHeight
  }
});

const mapStateToProps = state => {
  const { courts, loading } = state.courtsList;
  const { commerceId } = state.commerceData;

  return { courts, loading, commerceId };
};

export default connect(mapStateToProps, { onCourtFormOpen })(CourtList);
