import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Fab } from 'native-base';
import { HeaderBackButton } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import { Spinner, EmptyList, IconButton, Menu, MenuItem } from '../common';
import { DAYS, MONTHS, MAIN_COLOR } from '../../constants';
import { formattedMoment } from '../../utils';
import {
    onActiveSchedulesRead,
    onScheduleValueChange,
    onScheduleDelete,
    onNextReservationsRead,
    onScheduleDeleteWithReservations,
    onScheduleFormOpen,
    onScheduleRead
} from '../../actions';

class CommerceSchedulesList extends Component {
    state = {
        deleteModalVisible: false,
        deleteConfirmVisible: false,
        optionsVisible: false,
        lastReservationDate: null,
        reservationsToCancel: [],
        selectedSchedule: {}
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: navigation.getParam('leftIcon')
        };
    };

    componentDidMount() {
        this.props.navigation.setParams({
            leftIcon: this.renderBackButton()
        });

        this.props.onActiveSchedulesRead({
            commerceId: this.props.commerceId,
            date: new Date()
        })
    }

    componentDidUpdate(prevProps) {
        this.props.schedules;
        if (prevProps.nextReservations !== this.props.nextReservations) {
            this.props.navigation.isFocused() && this.onScheduleDelete();
        }
    }

    renderBackButton = () => {
        return <HeaderBackButton tintColor='white' title='Volver' onPress={this.onBackPress} />
    }

    onBackPress = () => {
        this.props.onScheduleRead({
            commerceId: this.props.commerceId,
            selectedDate: this.props.navigation.getParam('selectedDate')
        })

        this.props.navigation.goBack();
    }

    onScheduleAddPress = () => {
        this.props.onScheduleFormOpen();
        this.props.navigation.navigate('scheduleRegister');
    }

    onScheduleEditPress = () => {
        const { selectedSchedule } = this.state;
        this.setState({ optionsVisible: false });

        for (prop in selectedSchedule) {
            if (prop === 'startDate' && selectedSchedule[prop] < formattedMoment()) {
                this.props.onScheduleValueChange({ prop, value: formattedMoment() });
            } else {
                this.props.onScheduleValueChange({ prop, value: selectedSchedule[prop] });
            }
        }

        this.props.navigation.navigate('scheduleRegister', { schedule: selectedSchedule });
    }

    onScheduleDeletePress = () => {
        const { commerceId } = this.props;
        const { selectedSchedule } = this.state;

        let startDate = formattedMoment();

        if (selectedSchedule.startDate > startDate) startDate = selectedSchedule.startDate;

        this.props.onNextReservationsRead({ commerceId, startDate, endDate: selectedSchedule.endDate });
        this.setState({ optionsVisible: false, reservationsToCancel: [] });
    }

    onScheduleDelete = () => {
        const { nextReservations } = this.props;
        let { lastReservationDate } = this.state;

        if (nextReservations.length) {
            lastReservationDate = formattedMoment(
                nextReservations[nextReservations.length - 1].startDate
            );
            this.setState({ deleteModalVisible: true, lastReservationDate });
        } else {
            lastReservationDate = formattedMoment();
            this.setState({ deleteConfirmVisible: true, lastReservationDate });
        }
    }

    onCancelReservations = async () => {
        const { nextReservations } = this.props;

        this.setState({
            lastReservationDate: formattedMoment(),
            reservationsToCancel: nextReservations,
            deleteModalVisible: false
        }, this.onScheduleDeleteConfirm)
    }

    onScheduleDeleteConfirm = async () => {
        const { lastReservationDate, selectedSchedule, reservationsToCancel } = this.state;

        await this.props.onScheduleDelete({
            commerceId: this.props.commerceId,
            schedule: selectedSchedule,
            endDate: lastReservationDate,
            reservationsToCancel
        });

        this.setState({ deleteModalVisible: false, deleteConfirmVisible: false });
    }

    renderDeleteScheduleModal = () => {
        const { lastReservationDate, deleteModalVisible } = this.state;

        if (lastReservationDate && deleteModalVisible) {
            return (
                <Menu
                    title={
                        'Tienes reservas hasta el ' +
                        DAYS[lastReservationDate.day()] + ' ' +
                        lastReservationDate.format('D') + ' de ' +
                        MONTHS[lastReservationDate.month()] + ' ' +
                        'por lo que la baja de los horarios de atencion entrará en ' +
                        'vigencia luego de esa fecha. Seleccione "Aceptar" para ' +
                        'confirmar estos cambios o "Cancelar reservas y notificar" ' +
                        'para que la baja entre en vigencia ahora mismo.'
                    }
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
                        title="Cancelar reservas y notificar"
                        icon="md-trash"
                        onPress={this.onCancelReservations}
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

        if (loading) return <Spinner />;

        if (schedules.length) {
            return (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={schedules}
                        renderItem={this.renderItem}
                        keyExtractor={schedule => schedule.id}
                        contentContainerStyle={{ paddingBottom: 95 }}
                    />

                    <Fab
                        style={{ backgroundColor: MAIN_COLOR }}
                        position="bottomRight"
                        onPress={this.onScheduleAddPress}
                    >
                        <Ionicons name="md-add" />
                    </Fab>

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
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <MenuItem
                            title="Eliminar"
                            icon="md-trash"
                            onPress={this.onScheduleDeletePress}
                        />
                    </Menu>

                    <Menu
                        title={'¿Esta seguro que desea eliminar los horarios de atencion?'}
                        onBackdropPress={() => this.setState({ deleteConfirmVisible: false })}
                        isVisible={this.state.deleteConfirmVisible}
                    >
                        <MenuItem
                            title="Aceptar"
                            icon="md-checkmark"
                            onPress={this.onScheduleDeleteConfirm}
                        />
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <MenuItem
                            title="Cancelar"
                            icon="md-close"
                            onPress={() => this.setState({ deleteConfirmVisible: false })}
                        />
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
    const { nextReservations } = state.courtReservationsList;
    const { commerceId } = state.commerceData;

    return { schedules, commerceId, loading, nextReservations };
}

export default connect(mapStateToProps, {
    onActiveSchedulesRead,
    onScheduleValueChange,
    onScheduleDelete,
    onNextReservationsRead,
    onScheduleDeleteWithReservations,
    onScheduleFormOpen,
    onScheduleRead
})(CommerceSchedulesList);