import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

const PermissionsAssigner = props => {
  const { requiredRole, sessionRole, children } = props;
  return sessionRole >= requiredRole ? children : <View />;
};

const mapStateToProps = state => {
  const { role } = state.roleData;

  return { sessionRole: role };
};

export default connect(mapStateToProps, {})(PermissionsAssigner);
