import { AREAS } from '../../constants';
import { connect } from 'react-redux';

const AreaComponentRenderer = connect(
    mapStateToProps, null
)(
    props => {
        switch (props.area || props.areaId) {
            case AREAS.sports:
                return props.sports;
            case AREAS.hairdressers:
                return props.hairdressers;
            default:
                return null
        }
    }
);

const mapStateToProps = state => {
    const { area: { areaId } } = state.commerceData;
    return { areaId };
}

export { AreaComponentRenderer };