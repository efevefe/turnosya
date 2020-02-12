import { connect } from 'react-redux';

const mapStateToProps = state => {
  return { sessionRole: state.roleData.role };
};

const PermissionsAssigner = connect(
  mapStateToProps, null
)(
  props => {
    const { requiredRole, sessionRole, children } = props;
    return sessionRole.value >= requiredRole.value ? children : null;
  }
);

export { PermissionsAssigner };
