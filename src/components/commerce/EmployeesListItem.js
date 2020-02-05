import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem, Toast } from '../common';
import { onCourtFormOpen, onEmployeeDelete, onEmployeeValueChange } from '../../actions';
import { ROLES } from '../../constants';

class CourtListItem extends Component {
  state = {
    optionsVisible: false,
    deleteVisible: false,
    currentUserEmail: firebase.auth().currentUser.email,
  };

  onOptionsPress = () => {
    this.setState({ optionsVisible: true });
  };

  onDeletePress = () => {
    if (this.state.currentUserEmail === this.props.employee.email)
      return Toast.show({ text: 'No puede eliminarse usted mismo' });

    this.setState({
      optionsVisible: false,
      deleteVisible: !this.state.deleteVisible,
    });
  };

  onConfirmDeletePress = () => {
    const { commerceId, employee } = this.props;

    this.props.onEmployeeDelete({
      employeeId: employee.id,
      commerceId,
      profileId: employee.profileId,
    });

    this.setState({ deleteVisible: false });
  };

  onUpdatePress = () => {
    const { employee } = this.props;

    this.setState({ optionsVisible: false });

    this.props.onEmployeeValueChange(employee);
    this.props.navigation.navigate('employeeForm', { editing: true });
  };

  render() {
    const { firstName, lastName, email, role, id } = this.props.employee;

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title={`${firstName} ${lastName}`}
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={this.state.optionsVisible}
        >
          <MenuItem title="Editar" icon="md-create" onPress={this.onUpdatePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="Eliminar" icon="md-trash" onPress={this.onDeletePress} />
        </Menu>

        <Menu
          title={`¿Seguro que desea eliminar el empleado '${firstName} ${lastName}'?`}
          onBackdropPress={this.onDeletePress}
          isVisible={this.state.deleteVisible}
        >
          <MenuItem title="Sí" icon="md-checkmark" onPress={this.onConfirmDeletePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="No" icon="md-close" onPress={this.onDeletePress} />
        </Menu>

        <ListItem
          title={`${firstName} ${lastName}`}
          titleStyle={
            { textAlign: 'left', display: 'flex' }
            // true // agregar cuando estén las notificaciones
            //   ? { textAlign: 'left', display: 'flex' }
            //   : {
            //       textAlign: 'left',
            //       display: 'flex',
            //       color: 'grey',
            //       fontStyle: 'italic'
            //     }
          }
          rightTitle={
            <Text
            // style={
            //   true // agregar cuando estén las notificaciones
            //     ? {}
            //     : { color: 'grey', fontStyle: 'italic' }
            // }
            >
              {role.name}
            </Text>
          }
          key={id}
          subtitle={
            <Text
              style={
                { color: 'grey' }
                // true // agregar cuando estén las notificaciones
                //   ? { color: 'grey' }
                //   : { color: 'grey', fontStyle: 'italic' }
              }
            >
              {email}
            </Text>
          }
          onLongPress={
            this.props.role.value > ROLES[this.props.employee.role.roleId].value ||
            this.state.currentUserEmail === this.props.employee.email
              ? this.onOptionsPress
              : null
          }
          rightIcon={
            this.props.role.value > ROLES[this.props.employee.role.roleId].value ||
            this.state.currentUserEmail === this.props.employee.email
              ? {
                  name: 'md-more',
                  type: 'ionicon',
                  containerStyle: { height: 20, width: 10 },
                  onPress: this.onOptionsPress,
                }
              : null
          }
          bottomDivider
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { role } = state.roleData;
  return { role };
};

export default connect(mapStateToProps, {
  onCourtFormOpen,
  onEmployeeDelete,
  onEmployeeValueChange,
})(CourtListItem);
