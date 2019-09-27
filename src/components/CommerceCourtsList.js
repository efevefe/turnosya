import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Spinner, EmptyList } from './common';
import { onCommerceCourtsRead, onCourtReservationValueChange } from '../actions';

class CommerceCourtsList extends Component {
    componentDidMount() {
        this.props.onCommerceCourtsRead({
            commerceId: this.props.commerceId,
            courtType: this.props.courtType
        });
    }

    onCourtpress = court => {
        this.props.onCourtReservationValueChange({
            prop: 'court',
            value: court
        });

        this.props.navigation.navigate('confirmCourtReservation');
    }

    renderRow({ item }) {
        const {
            name,
            court,
            ground,
            price,
            lightPrice,
            id
        } = item;

        return (
            <ListItem
                title={name}
                titleStyle={{
                    textAlign: 'left',
                    display: 'flex'
                }}
                rightTitle={
                    lightPrice !== '' ? (
                        <View style={{ justifyContent: 'space-between' }}>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    color: 'black'
                                }}
                            >{`Sin luz: $${price}`}</Text>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    color: 'black'
                                }}
                            >{`Con luz: $${lightPrice}`}</Text>
                        </View>
                    ) : (
                            <Text>{`Sin luz: $${price}`}</Text>
                        )
                }
                key={id}
                subtitle={
                    <Text style={{ color: 'grey' }}>
                        {`${court} - ${ground}`}
                    </Text>
                }
                rightElement={
                    <Ionicons
                        icon='md-arrow-forward'
                        color='black'
                        iconSize={22}
                    />
                }
                onPress={() => this.onCourtpress(item)}
                bottomDivider
            />
        );
    }

    renderList = () => {
        if (this.props.courts.length > 0) {
            return (
                <FlatList
                    data={this.props.courts}
                    renderItem={this.renderRow.bind(this)}
                    keyExtractor={court => court.id}
                    contentContainerStyle={{ paddingBottom: 95 }}
                />
            );
        }

        return <EmptyList title='No hay ninguna cancha' />;
    }

    render() {
        if (this.props.loading) return <Spinner />;

        return (
            <View style={{ flex: 1 }}>
                {this.renderList()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { courts, loading } = state.courtsList;
    const { courtType } = state.courtReservation;
    const commerceId = state.courtReservation.commerce.objectID;

    return { commerceId, courtType, courts, loading };
};

export default connect(mapStateToProps, { onCommerceCourtsRead, onCourtReservationValueChange })(CommerceCourtsList);