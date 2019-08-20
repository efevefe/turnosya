import { Toast as NBToast } from 'native-base';
import { Constants } from 'expo';

export const Toast = {
    show: params => {
        if (Constants.platform.ios) {
            var style = iosStyle;
        } else {
            var style = androidStyle;
        }

        NBToast.show({ ...style, ...params, textStyle });
    },
    hide: params => {
        if (Constants.platform.ios) {
            var style = iosStyle;
        } else {
            var style = androidStyle;
        }

        NBToast.hide({ ...style, ...params, textStyle });
    },
    onClose: reason => {
        NBToast.onClose(reason);
    }
};

const textStyle = {
    fontSize: 13,
    margin: 1
}

const androidStyle = {
    style: {
        marginBottom: 65,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5
    }
}

const iosStyle = {
    style: {
        marginBottom: 40,
        borderRadius: 5
    }
}