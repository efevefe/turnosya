import { connect } from 'react-redux';
import { AREAS } from '../../constants';

const CommerceSchedule = props => {
    // esto no es definitivo

    switch (props.areaId) {
        case AREAS.sports:
            props.navigation.navigate('courtsCalendar');
            return null;
        case AREAS.hairdressers:
            props.navigation.navigate('servicesCalendar');
            return null;
        default:
            return null;
    }
}

const mapStateToProps = state => {
    return { areaId: state.commerceData.area.areaId };
}

export default connect(mapStateToProps, null)(CommerceSchedule);