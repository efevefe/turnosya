import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { ListItem, ButtonGroup, Overlay } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { Calendar, Spinner, EmptyList } from './common';
import { onCommerceCourtReservationsListRead } from '../actions';
import { MAIN_COLOR } from '../constants';
import CourtReservationDetails from './CourtReservationDetails';

class CommerceCourtReservations extends Component {
    state = { selectedDate: moment(), selectedIndex: 1, filteredList: [], selectedReservation: {}, detailsVisible: false };

    componentDidMount() {
        this.onDateSelected(moment());
    }

    onDateSelected = date => {
        const { commerceId } = this.props;
        var selectedDate = moment([date.year(), date.month(), date.date(), 0, 0, 0]);

        this.props.onCommerceCourtReservationsListRead({ commerceId, selectedDate });
        this.setState({ selectedDate });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reservations !== this.props.reservations) {
            this.updateIndex(this.state.selectedIndex);
        }
    }

    updateIndex = (selectedIndex) => {
        this.setState({ selectedIndex });

        const { reservations } = this.props;
        var filteredList = [];

        if (selectedIndex == 0) {
            // turnos pasados
            filteredList = reservations.filter(res => res.endDate < moment());
        } else if (selectedIndex == 1) {
            // turnos en curso
            filteredList = reservations.filter(res => (res.startDate <= moment() && res.endDate >= moment()));
        } else {
            // turnos proximos
            filteredList = reservations.filter(res => res.startDate > moment());
        }

        this.setState({ filteredList });
    }

    renderDetails = () => {
        const { client, court, startDate, endDate, price, light } = this.state.selectedReservation;

        return (
            <Overlay
                isVisible={this.state.detailsVisible}
                onBackdropPress={() => this.setState({ detailsVisible: false })}
                overlayStyle={{ borderRadius: 8, paddingBottom: 23 }}
                height='auto'
                animationType="fade"
            >
                    <CourtReservationDetails
                        client={client}
                        court={court}
                        startDate={startDate}
                        endDate={endDate}
                        price={price}
                        light={light}
                        showPrice={true}
                    />
            </Overlay>
        );
    }

    onReservationPress = async reservation => {
        await this.setState({ selectedReservation: reservation });
        this.setState({ detailsVisible: true });
    }

    renderList = ({ item }) => {
        return (
            <ListItem
                rightIcon={{
                    name: 'ios-arrow-forward',
                    type: 'ionicon',
                    color: 'black'
                }}
                title={`${item.startDate.format('HH:mm')} a ${item.endDate.format('HH:mm')}`}
                //subtitle={`${item.client.firstName} ${item.client.lastName}\n${item.court.name} - ${item.courtType} - ${item.court.ground}`}
                subtitle={`${item.client.firstName} ${item.client.lastName}\n${item.court.name}`}
                rightTitle={`$${item.price}`}
                rightTitleStyle={{ fontWeight: 'bold', color: 'black' }}
                rightSubtitle={item.light ? 'Con Luz' : 'Sin Luz'}
                rightSubtitleStyle={{ color: 'grey' }}
                //onPress={() => this.props.navigation.navigate('reservationDetails', { reservation: item })}
                onPress={() => this.onReservationPress(item)}
                bottomDivider
            />
        );
    };

    onRefresh = () => {
        return (
            <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={() => {
                    this.props.onCommerceCourtReservationsListRead({
                        commerceId: this.props.commerceId,
                        selectedDate: this.state.selectedDate
                    });
                }}
                colors={[MAIN_COLOR]}
                tintColor={MAIN_COLOR}
            />
        );
    };

    renderItems = () => {
        const { filteredList } = this.state;

        if (filteredList.length) {
            return (
                <FlatList
                    data={filteredList}
                    renderItem={this.renderList.bind(this)}
                    keyExtractor={reservation => reservation.id}
                    refreshControl={this.onRefresh()}
                />
            );
        } else {
            return (
                <EmptyList
                    title='No hay turnos'
                    refreshControl={this.onRefresh()}
                />
            );
        }
    };

    render() {
        return (
            <View style={{ alignSelf: 'stretch', flex: 1 }}>
                <Calendar
                    onDateSelected={date => this.onDateSelected(date)}
                    startingDate={this.state.selectedDate}
                />
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.state.selectedIndex}
                    buttons={['PASADOS', 'EN CURSO', 'PROXIMOS']}
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
                    selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
                    selectedTextStyle={{ color: 'white' }}
                    textStyle={{ color: MAIN_COLOR }}
                    innerBorderStyle={{ width: 0 }}
                />
                {
                    this.props.loading
                        ? <Spinner style={{ position: 'relative' }} />
                        : this.renderItems()
                }

                {this.renderDetails()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { commerceId } = state.commerceData;
    const { reservations, loading } = state.courtReservationsList;

    return { commerceId, reservations, loading };
}

export default connect(mapStateToProps, { onCommerceCourtReservationsListRead })(CommerceCourtReservations);