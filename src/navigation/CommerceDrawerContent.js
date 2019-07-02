import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { onLogout } from '../actions/AuthActions';
import { DrawerItem } from '../components/common';

class CommerceDrawerContent extends Component {
    leftIcon = name => (
        <Icon name={name} size={20} color="black" style={{ marginRight: 8 }} />
    );

    render() {
        return (
            <ScrollView>
                <SafeAreaView
                    style={{ flex: 1 }}
                    forceInset={{ top: 'always', horizontal: 'never' }}
                >
                    <DrawerItem
                        title="Cerrar Sesion"
                        icon={this.leftIcon('sign-out')}
                        loading={this.props.loading}
                        onPress={() => this.props.onLogout()}
                    />
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return { loading: state.auth.loading };
}

export default connect(mapStateToProps, { onLogout })(CommerceDrawerContent);
