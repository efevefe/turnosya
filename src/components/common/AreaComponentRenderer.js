import { AREAS } from '../../constants';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return { areaId: state.commerceData.area.areaId };
}

const AreaComponentRenderer = connect(
  mapStateToProps, null
)(
  props => {
    switch (props.area || props.areaId) {
      case AREAS.sports:
        return props.sports || null;
      case AREAS.hairdressers:
        return props.hairdressers || null;
      default:
        return props.sports || null; // porque originalmente para las reservas de canchas no guardabamos el areaId
    }
  }
);

export { AreaComponentRenderer };