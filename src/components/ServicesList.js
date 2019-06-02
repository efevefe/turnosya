import React, { Component } from 'react';
import { FlatList, ListView, View } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import ServicesListItem from './ServicesListItem';
import { servicesRead } from '../actions';

class ServicesList extends Component {
    componentWillMount() {
        this.props.servicesRead();
    }

    renderRow({ item }) {
        return <ServicesListItem service={item} navigation={this.props.navigation} />;
    }

    renderList() {
        if (this.props.loading) {
            return <Spinner size='large' color='#c72c41' />;
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