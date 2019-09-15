import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Spinner, EmptyList } from './common';
import CommerceCourtsListItem from './CommerceCourtsListItem';
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
        return (
            <CommerceCourtsListItem
                court={item}
                onPress={() => this.onCourtpress(item)}
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