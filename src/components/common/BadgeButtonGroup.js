import React from 'react';
import { View, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { MAIN_COLOR } from '../../constants';

const BadgeButtonGroup = props => {
    return (
        <View style={styles.mainContainer}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <ButtonGroup
                    {...props}
                    Component={TouchableWithoutFeedback}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.containerStyle}
                    textStyle={styles.textStyle}
                    innerBorderStyle={styles.innerBorderStyle}
                    selectedButtonStyle={styles.selectedButtonStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: MAIN_COLOR,
        paddingTop: 4
    },
    buttonStyle: {
        width: 'auto',
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'white',
        marginRight: 8,
        backgroundColor: MAIN_COLOR
    },
    containerStyle: {
        height: 28,
        borderWidth: 0,
        margin: 0,
        backgroundColor: MAIN_COLOR
    },
    textStyle: {
        fontSize: 13,
        color: 'white'
    },
    innerBorderStyle: {
        width: 0
    },
    selectedButtonStyle: {
        backgroundColor: 'white'
    },
    selectedTextStyle: {
        color: MAIN_COLOR
    }
});

export { BadgeButtonGroup };