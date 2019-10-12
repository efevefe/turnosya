import React, { Component } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { ListItem, ButtonGroup } from "react-native-elements";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { MONTHS, DAYS, MAIN_COLOR } from "../constants";
import { Spinner, EmptyList } from "./common";
import { onClientReservationListRead } from "../actions";
import moment from "moment";

class ClientReservationListItem extends Component {
  constructor(props) {
    super(props);
    props.onClientReservationListRead();
    this.state = {
      selectedIndex: 1,
      filteredList: []
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reservations !== this.props.reservations) {
      this.updateIndex(this.state.selectedIndex);
    }
  }

  OnPressItem = reservation => {
    const navigateAction = NavigationActions.navigate({
      routeName: "reservationsDetail",
      params: reservation
    });
    this.props.navigation.navigate(navigateAction);
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
    const { reservations } = this.props;
    var filteredList = [];
    if (selectedIndex == 0) {
      // turnos pasados
      filteredList = reservations
        .filter(res => res.endDate < moment() && res.state !== "Cancelado")
        .sort((a, b) => a.startDate < b.startDate);
    } else {
      // turnos proximos
      filteredList = reservations.filter(
        res => res.startDate > moment() && res.state !== "Cancelado"
      );
    }
    this.setState({ filteredList });
  };

  renderRow = ({ item }) => {
    const { commerce, startDate, endDate, price } = item;

    return (
      <ListItem
        title={commerce.name}
        rightTitle={`$${price}`}
        subtitle={`${DAYS[startDate.day()]} ${startDate.format("D")} de ${
          MONTHS[startDate.month()]
        }\nDe ${startDate.format("HH:mm")} hs. a ${endDate.format(
          "HH:mm"
        )} hs.`}
        bottomDivider
        onPress={() => this.OnPressItem(item)}
      ></ListItem>
    );
  };

  renderButtonGroup = () => {
    return (
      <View>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={["PASADOS", "PROXIMOS"]}
          containerBorderRadius={0}
          containerStyle={{
            height: 40,
            borderRadius: 0,
            borderWidth: 0,
            borderBottomWidth: 0.5,
            marginBottom: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0
          }}
          selectedButtonStyle={{ backgroundColor: "white" }}
          buttonStyle={{ backgroundColor: MAIN_COLOR }}
          selectedTextStyle={{ color: MAIN_COLOR }}
          textStyle={{ color: "white" }}
          innerBorderStyle={{ width: 0 }}
        />
      </View>
    );
  };

  renderList() {
    const { filteredList } = this.state;

    if (filteredList.length)
      return (
        <View>
          <FlatList
            data={filteredList}
            renderItem={this.renderRow.bind(this)}
            keyExtractor={reservation => reservation.id}
            refreshControl={this.onRefresh()}
          />
        </View>
      );

    return <EmptyList  title="
    
    
    
    No tiene reservas" onRefresh={this.onRefresh()} />;
  }

  onRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={() => this.props.onClientReservationListRead()}
        colors={[MAIN_COLOR]}
        tintColor={MAIN_COLOR}
      />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;
    return (
      <View>
        {this.renderButtonGroup()}

        {this.renderList()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { reservations, loading } = state.clientReservationList;
  return { reservations, loading };
};

export default connect(
  mapStateToProps,
  { onClientReservationListRead }
)(ClientReservationListItem);
