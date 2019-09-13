import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import { CardSection } from '../components/common';
import { MONTHS, DAYS } from '../constants';

class ConfirmCourtReservation extends Component {
    state = { commerceId: null, court: null, slot: null };

    componentDidMount() {
        this.setState({
            commerceId: this.props.navigation.getParam('commerceId'),
            court: this.props.navigation.getParam('court'),
            slot: this.props.navigation.getParam('slot')
        });
    }

    render() {
        const { commerceId, court, slot } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {(commerceId && court && slot) ?
                    <View style={{ flex: 1 }}>
                        <CardSection>
                            <Text h3>{court.name}</Text>
                        </CardSection>
                        <CardSection>
                            <Text>{court.court}</Text>
                        </CardSection>
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <CardSection>
                            <Text h4>
                                {`${DAYS[slot.startHour.day()]} ${slot.startHour.format('D')} de ${MONTHS[slot.startHour.month()]}`}
                            </Text>
                        </CardSection>
                        <CardSection>
                            <Text h4>{`De ${slot.startHour.format('HH:mm')} hs. a ${slot.endHour.format('HH:mm')} hs.`}</Text>
                        </CardSection>
                    </View>
                    : null
                }
            </View>
        );
    }
}

export default ConfirmCourtReservation;