import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderButton = ({ icon, color, onPress, iconStyle, containerStyle }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.5}
            style={{ backgroundColor: 'transparent' }}
        >
            <View style={[styles.containerStyle, containerStyle]}>
                <Ionicons
                    name={icon}
                    size={28}
                    color={color ? color : 'white'}
                    style={[styles.iconStyle, iconStyle]}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        marginRight: 15,
        marginLeft: 15
    }
});

export { HeaderButton };