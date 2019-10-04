import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { ListItem, ButtonGroup } from 'react-native-elements';
import moment from 'moment';
import { connect } from 'react-redux';
import { Calendar, Spinner, EmptyList } from './common';
import { onCommerceCourtReservationsRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class CommerceCourtReservations extends Component {
    state = { selectedDate: moment(), selectedIndex: 1, filteredList: [] };

    componentDidMount() {
        this.onDateSelected(moment());
    }

    onDateSelected = date => {
        const { commerceId } = this.props;
        var selectedDate = moment([date.year(), date.month(), date.date(), 0, 0, 0]);

        this.setState({ selectedDate });
        this.props.onCommerceCourtReservationsRead({ commerceId, selectedDate });
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

    renderList = ({ item }) => {
        return (
            <ListItem
                rightIcon={{
                    name: 'ios-arrow-forward',
                    type: 'ionicon',
                    color: 'black'
                }}
                title={`${item.startDate.format('HH:mm')} a ${item.endDate.format('HH:mm')}`}
                subtitle={item.courtType}
                rightTitle={`$${item.price}`}
                rightTitleStyle={{ fontWeight: 'bold', color: 'black' }}
                rightSubtitle={item.light ? 'Con Luz' : 'Sin Luz'}
                rightSubtitleStyle={{ color: 'grey' }}
                bottomDivider
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
                //refreshControl={this.onRefresh()}
                />
            );
        } else {
            return (
                <EmptyList
                    title='No hay turnos'
                //refreshControl={this.onRefresh()}
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
                /*maxDate={moment().add(this.props.reservationDayPeriod, 'days')}
                datesWhitelist={[
                    {
                        start: moment(),
                        end: moment().add(this.props.reservationDayPeriod, 'days')
                    }
                ]}
                */
                />
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.state.selectedIndex}
                    buttons={['PASADOS', 'EN CURSO', 'PROXIMOS']}
                    containerBorderRadius={0}
                    containerStyle={{ height: 40, borderRadius: 0, borderWidth: 0, marginTop: 0, marginLeft: 0, marginRight: 0 }}
                    selectedButtonStyle={{ backgroundColor: MAIN_COLOR }}
                    selectedTextStyle={{ color: 'white' }}
                    textStyle={{ color: MAIN_COLOR }}
                    innerBorderStyle={{ width: 0 }}
                    buttonStyle={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
                />
                {
                    this.props.loading
                        ? <Spinner style={{ position: 'relative' }} />
                        : this.renderItems()
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { commerceId } = state.commerceData;
    const { reservations, loading } = state.courtReservationsList;

    return { commerceId, reservations, loading };
}

export default connect(mapStateToProps, { onCommerceCourtReservationsRead })(CommerceCourtReservations);