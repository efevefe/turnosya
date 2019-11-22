import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList, IconButton, Menu, MenuItem } from '../common';
import { DAYS, MONTHS } from '../../constants';
import { formattedMoment } from '../../utils';
import {
    onActiveSchedulesRead,
    onScheduleValueChange,
    onScheduleDelete,
    onNextReservationsDatesRead
} from '../../actions';

class CommerceSchedulesList extends Component {
    state = {
        deleteModalVisible: false,
        optionsVisible: false,
        lastReservationDate: formattedMoment(),
        selectedSchedule: {}
    }

    componentDidMount() {
        this.unsubscribeSchedulesRead = this.props.onActiveSchedulesRead({
            commerceId: this.props.commerceId,
            date: new Date()
        })
    }

    componentWillUnmount() {
        this.unsubscribeSchedulesRead && this.unsubscribeSchedulesRead();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.nextReservationsDates !== this.props.nextReservationsDates) {
            this.props.navigation.isFocused() && this.onScheduleDelete();
        }
    }

    onScheduleEditPress = schedule => {
        this.setState({ optionsVisible: false });

        for (prop in schedule) {
            this.props.onScheduleValueChange({ prop, value: schedule[prop] });
        }

        this.props.navigation.navigate('scheduleRegister', { schedule });
    }

    onScheduleDeletePress = () => {
        const { commerceId } = this.props;
        const { selectedSchedule } = this.state;

        let startDate = formattedMoment();

        if (selectedSchedule.startDate > startDate) startDate = selectedSchedule.startDate;

        this.props.onNextReservationsDatesRead({ commerceId, startDate });
        this.setState({ optionsVisible: false });
    }

    onScheduleDelete = () => {
        const { nextReservationsDates } = this.props;
        let { lastReservationDate } = this.state;

        if (nextReservationsDates.length) {
            lastReservationDate = nextReservationsDates[nextReservationsDates.length - 1].startDate;
        }

        this.setState({
            deleteModalVisible: true,
            lastReservationDate
        });
    }

    onScheduleDeleteConfirm = async () => {
        const { lastReservationDate, selectedSchedule } = this.state;

        await this.props.onScheduleDelete({
            commerceId: this.props.commerceId,
            scheduleId: selectedSchedule.id,
            endDate: lastReservationDate
        });

        this.setState({ deleteModalVisible: false });
    }

    renderDeleteScheduleModal = () => {
        const { lastReservationDate } = this.state;

        return (
            <Menu
                title={
                    'Tienes reservas hasta el ' +
                    `${DAYS[lastReservationDate.day()]} ` +
                    `${lastReservationDate.format('D')} de ` +
                    `${MONTHS[lastReservationDate.month()]}, ` +
                    'por lo que la baja de los horarios de atencion entrará en ' +
                    'vigencia luego de esa fecha. ¿Desea confirmar los cambios?'}
                onBackdropPress={() => this.setState({ deleteModalVisible: false })}
                isVisible={this.state.deleteModalVisible}
            >
                <MenuItem
                    title="Acepar"
                    icon="md-checkmark"
                    onPress={this.onScheduleDeleteConfirm}
                />
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title="Seleccionar fecha"
                    icon="md-calendar"
                    onPress={() => console.log('seleccionar fecha')}
                />
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title="Cancelar"
                    icon="md-close"
                    onPress={() => this.setState({ deleteModalVisible: false })}
                />
            </Menu>
        );
    }

    cardToText = card => {
        const { id, firstShiftStart, firstShiftEnd, secondShiftStart, secondShiftEnd, days } = card;

        let strDays = '';

        days.sort((a, b) => a - b).forEach((day, i) => {
            strDays += DAYS[day] + `${i === (days.length - 1) ? '' : ', '}`
        });

        const strShifts = `${firstShiftStart} a ${firstShiftEnd}` +
            `${secondShiftStart ? ` - ${secondShiftStart} a ${secondShiftEnd}` : ''}`;

        return (
            <Text
                key={id}
                style={{ fontSize: 13, marginBottom: 3 }}
            >
                {`${strDays}\n${strShifts}`}
            </Text>
        );
    }

    renderItem = ({ item }) => {
        const { startDate, endDate, cards } = item;

        return (
            <ListItem
                title={<View>{cards.map(card => this.cardToText(card))}</View>}
                subtitle={`Del ${startDate.format('DD/MM/YYYY')} ` +
                    `${endDate ? `al ${endDate.format('DD/MM/YYYY')}` : 'en adelante'}`
                }
                subtitleStyle={{ fontSize: 12 }}
                rightElement={
                    <IconButton
                        icon='md-more'
                        color='grey'
                        iconSize={22}
                        iconStyle={{ marginLeft: 5, marginRight: 8 }}
                        onPress={() => this.setState({
                            selectedSchedule: item,
                            optionsVisible: true
                        })}
                    />
                }
                onLongPress={() => this.setState({
                    selectedSchedule: item,
                    optionsVisible: true
                })}
                bottomDivider
            />
        )
    }

    render() {
        const { schedules, loading } = this.props;
        const { selectedSchedule } = this.state;

        if (loading) return <Spinner />;

        if (schedules.length) {
            return (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={schedules}
                        renderItem={this.renderItem}
                        keyExtractor={schedule => schedule.id}
                    />

                    <Menu
                        title={'Horarios de Atencion'}
                        onBackdropPress={() => this.setState({ optionsVisible: false })}
                        isVisible={this.state.optionsVisible}
                    >
                        <MenuItem
                            title="Editar"
                            icon="md-create"
                            onPress={this.onScheduleEditPress}
                        />
                        {
                            !selectedSchedule.endDate &&
                            <View>
                                <Divider style={{ backgroundColor: 'grey' }} />
                                <MenuItem
                                    title="Eliminar"
                                    icon="md-trash"
                                    onPress={this.onScheduleDeletePress}
                                />
                            </View>
                        }
                    </Menu>

                    {this.renderDeleteScheduleModal()}
                </View>
            )
        }

        return <EmptyList title='No hay horarios de atencion vigentes' />
    }
}

const mapStateToProps = state => {
    const { schedules, loading } = state.commerceSchedule;
    const { nextReservationsDates } = state.courtReservationsList;
    const { commerceId } = state.commerceData;

    return { schedules, commerceId, loading, nextReservationsDates };
}

export default connect(mapStateToProps, {
    onActiveSchedulesRead,
    onScheduleValueChange,
    onScheduleDelete,
    onNextReservationsDatesRead
})(CommerceSchedulesList);