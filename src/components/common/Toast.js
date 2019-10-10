import { Toast as NBToast } from 'native-base';
import Constants from 'expo-constants';

export const Toast = {
  show: params => {
    var style;
    Constants.platform.ios ? (style = iosStyle) : (style = androidStyle);

    NBToast.show({ ...style, ...params, textStyle, duration: 3000 });
  },
  hide: params => {
    var style;
    Constants.platform.ios ? (style = iosStyle) : (style = androidStyle);

    NBToast.hide({ ...style, ...params, textStyle });
  },
  onClose: reason => NBToast.onClose(reason)
};

const textStyle = {
  fontSize: 13,
  margin: 1
};

const androidStyle = {
  style: {
    marginBottom: 65,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5
  }
};

const iosStyle = {
  style: {
    marginBottom: 40,
    borderRadius: 5
  }
};
