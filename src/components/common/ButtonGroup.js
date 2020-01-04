import React from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup as RNEButtonGroup } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

const ButtonGroup = props => {
    return (
        <RNEButtonGroup
            {...props}
            selectedButtonStyle={[styles.selectedButtonStyle, props.selectedButtonStyle]}
            selectedTextStyle={[styles.selectedTextStyle, props.selectedTextStyle]}
            textStyle={[styles.textStyle, props.textStyle]}
            containerStyle={[styles.containerStyle, props.containerStyle]}
            innerBorderStyle={styles.innerBorderStyle}
        />
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        borderColor: MAIN_COLOR,
        height: 45,
        borderRadius: 8
    },
    innerBorderStyle: {
        color: MAIN_COLOR
    },
    selectedTextStyle: {
        color: 'white'
    },
    selectedButtonStyle: {
        backgroundColor: MAIN_COLOR
    },
    textStyle: {
        color: MAIN_COLOR,
        textAlign: 'center',
        fontSize: 12
    }
});

export { ButtonGroup };