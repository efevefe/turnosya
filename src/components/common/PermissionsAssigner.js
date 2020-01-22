import { connect } from 'react-redux';

const PermissionsAssigner = props => {
  const { requiredRole, sessionRole, children } = props;
  return sessionRole.value >= requiredRole.value ? children : null;
};

const mapStateToProps = state => {
  const { role } = state.roleData;

  return { sessionRole: role };
};

export default connect(mapStateToProps, {})(PermissionsAssigner);
