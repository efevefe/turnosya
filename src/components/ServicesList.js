import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import ServicesListItem from './ServicesListItem';
import { servicesRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class ServicesList extends Component {
    componentWillMount() {
        this.props.servicesRead();
    }

    renderRow({ item }) {
        return <ServicesListItem service={item} navigation={this.props.navigation} />;
    }

    renderList() {
        if (this.props.loading) {
            return <Spinner size='large' color={MAIN_COLOR} />;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.props.services}
                        renderItem={this.renderRow.bind(this)}
                        keyExtractor={service => service.id}
                    />
                </View>
            );
        }
    }

    render() {
        return (
            this.renderList()
        );
    }
}

const mapStateToProps = state => {
    const { services, loading } = state.servicesList;
    return { services, loading };
}

export default connect(mapStateToProps, { servicesRead })(ServicesList);