import React, { Component } from 'react';
import { ListView, View } from 'react-native';
import { connect } from 'react-redux';
import ServicesListItem from './ServicesListItem';
import { servicesRead } from '../actions';

class ServicesList extends Component {
    componentWillMount() {
        this.props.servicesRead();

        this.createDataSource(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.createDataSource(nextProps);
    }

    createDataSource({ services }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(services);
    }

    renderRow(service) {
        return <ServicesListItem service={service} navigation={this.props.navigation} />;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ListView
                    enableEmptySections
                    dataSource={this.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return { services: state.servicesList };
}

export default connect(mapStateToProps, { servicesRead })(ServicesList);