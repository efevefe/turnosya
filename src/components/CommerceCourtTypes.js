import React, { Component } from 'react';
import { FlatList, ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Spinner } from '../components/common';
import { onCommerceCourtTypesRead } from '../actions'
import { MAIN_COLOR } from '../constants';

class CommerceCourtTypes extends Component {
    state = {
        commerceId: null
    };

    async componentWillMount() {
        await this.setState({ commerceId: this.props.navigation.getParam('commerceId') });

        this.props.onCommerceCourtTypesRead({
            commerceId: this.state.commerceId,
            loadingType: 'loading'
        });
    }

    onRefresh = () => {
        return (
            <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={() => {
                    this.props.onCommerceCourtTypesRead({
                        commerceId: this.state.commerceId,
                        loadingType: 'refreshing'
                    });
                }}
                colors={[MAIN_COLOR]}
                tintColor={MAIN_COLOR}
            />
        );
    }

    renderItem = ({ item }) => {
        return (
            <ListItem title={item} bottomDivider/>
        );
    }

    render() {
        if (this.props.loading) {
            return <Spinner />
        }

        if (this.props.courtTypesList.length > 0) {
            return (
                <FlatList
                    data={this.props.courtTypesList}
                    renderItem={this.renderItem}
                    keyExtractor={courtType => courtType}
                    refreshControl={this.onRefresh()}
                />
            );
        }

        return (
            <ScrollView
                contentContainerStyle={styles.containerStyle}
                refreshControl={this.onRefresh()}
            >
                <Text style={styles.textStyle}>Parece que no hay canchas...</Text>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        flexGrow: 1,
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    textStyle: {
        textAlign: 'center'
    }
});

const mapStateToProps = state => {
    const { courtTypesList, loading, refreshing } = state.commerceCourtTypes;

    return { courtTypesList, loading, refreshing };
}

export default connect(mapStateToProps, { onCommerceCourtTypesRead })(CommerceCourtTypes);
