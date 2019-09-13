import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Spinner, EmptyList } from './common';
import CommerceCourtsListItem from './CommerceCourtsListItem';
import { onCommerceCourtsRead } from '../actions';

class CommerceCourtsList extends Component {
    state = { commerceId: null, courtTypeId: null, slot: null };

    async componentDidMount() {
        await this.setState({
            commerceId: this.props.navigation.getParam('commerceId'),
            courtTypeId: this.props.navigation.getParam('courtTypeId'),
            slot: this.props.navigation.getParam('slot')
        });

        this.props.onCommerceCourtsRead({
            commerceId: this.state.commerceId,
            courtTypeId: this.state.courtTypeId
        });
    }

    renderRow({ item }) {
        return (
            <CommerceCourtsListItem
                court={item}
                // esto hay que ver si hacerlo con un reducer en vez de ir pasando los datos por la navegacion
                onPress={() => {
                    this.props.navigation.navigate(
                        'confirmCourtReservation',
                        {
                            commerceId: this.state.commerceId,
                            court: item,
                            slot: this.state.slot
                        }
                    )
                }}
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

    return { courts, loading };
};

export default connect(mapStateToProps, { onCommerceCourtsRead })(CommerceCourtsList);