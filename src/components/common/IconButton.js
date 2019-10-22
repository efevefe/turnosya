import React from 'react';
import { TouchableOpacity, View, StyleSheet, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const IconButton = ({ icon, iconSize, color, onPress, iconStyle, containerStyle }) => {
    iconSize = iconSize ? iconSize : 25;
    touchableSize = iconSize + 17;

    renderIcon = () => {
        return (
            <Ionicons
                name={icon}
                size={iconSize}
                color={color ? color : 'white'}
                style={iconStyle}
            />
        );
    }

    return (
        <View style={[styles.containerStyle, containerStyle]}>
            {
                Constants.platform.ios ? (
                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.5}
                        style={{
                            ...styles.touchableStyle,
                            height: touchableSize,
                            width: touchableSize,
                            borderRadius: touchableSize / 2,
                        }}
                    >
                        {this.renderIcon()}
                    </TouchableOpacity>
                ) : (
                        <TouchableHighlight
                            onPress={onPress}
                            activeOpacity={1}
                            underlayColor={'rgba(0,0,0,0.1)'}
                            style={{
                                ...styles.touchableStyle,
                                height: touchableSize,
                                width: touchableSize,
                                borderRadius: touchableSize / 2,
                            }}
                        >
                            {this.renderIcon()}
                        </TouchableHighlight>
                    )
            }
        </View>
    );
}

var styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8
    },
    touchableStyle: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export { IconButton };