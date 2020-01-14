import { AREAS } from '../../constants';

const AreaComponentRenderer = props => {
    switch (props.area) {
        case AREAS.sports:
            return props.sports;
        case AREAS.hairdressers:
            return props.hairdressers;
        default:
            return null
    }
}

export { AreaComponentRenderer };