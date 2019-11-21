import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner, EmptyList } from '../common';
import { onActiveSchedulesRead, onScheduleValueChange } from '../../actions';
import { DAYS } from '../../constants';

class CommerceSchedulesList extends Component {
    componentDidMount() {
        this.props.onActiveSchedulesRead({ commerceId: this.props.commerceId, date: new Date() })
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

    onScheduleEdit = schedule => {
        for (prop in schedule) {
            this.props.onScheduleValueChange({ prop, value: schedule[prop] });
        }

        this.props.navigation.navigate('scheduleRegister', { schedule });
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
                onPress={() => this.onScheduleEdit(item)}
                bottomDivider
            />
        )
    }

    render() {
        const { schedules, loading } = this.props;

        if (loading) return <Spinner />;

        if (schedules.length) {
            return (
                <FlatList
                    data={schedules}
                    renderItem={this.renderItem}
                    keyExtractor={schedule => schedule.id}
                />
            )
        }

        return <EmptyList title='No hay horarios de atencion vigentes' />
    }
}

const mapStateToProps = state => {
    const { schedules, loading } = state.commerceSchedule;
    const { commerceId } = state.commerceData;

    return { schedules, commerceId, loading };
}

export default connect(mapStateToProps, { onActiveSchedulesRead, onScheduleValueChange })(CommerceSchedulesList);