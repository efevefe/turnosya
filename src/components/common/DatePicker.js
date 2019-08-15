import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNDatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../constants';

class DatePicker extends Component {
    renderErrorMessage = () => {
        if (this.props.errorMessage) {
            return (
                <Text style={styles.errorMessageStyle}>{this.props.errorMessage}</Text>
            );
        }
    };

    renderLabel = color => {
        if (this.props.label) {
            return (
                <Text style={[styles.labelStyle, { color }]}>{this.props.label}</Text>
            );
        }
    }

    render() {
        const enabled = this.props.disabled ? false : true;
        const color = enabled ? MAIN_COLOR : '#c4c4c4';
        const borderBottomWidth = enabled ? 1.5 : 1;

        return (
            <View>
                {this.renderLabel(color)}
                <RNDatePicker
                    {...this.props}
                    mode='time'
                    confirmBtnText="Confirmar"
                    cancelBtnText="Cancelar"
                    iconComponent={<Ionicons name="md-time" color={color} size={20} />}
                    customStyles={{
                        dateInput: styles.dateInput,
                        dateText: styles.dateText,
                        placeholderText: styles.placeholderText,
                        disabled: styles.disabled,
                        dateTouchBody: {
                            borderBottomWidth: borderBottomWidth,
                            borderColor: color,
                            paddingRight: 5
                        }
                    }}
                    style={{ marginLeft: 10, marginRight: 10 }}
                />
                {this.renderErrorMessage()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        marginRight: 10,
        marginLeft: 10
    },
    errorMessageStyle: {
        margin: 5,
        marginLeft: 10,
        marginRight: 10,
        color: 'red',
        fontSize: 12
    },
    dateInput: {
        borderWidth: 0
    },
    dateText: {
        alignSelf: 'flex-start',
        fontSize: 13,
        marginLeft: 5
    },
    placeholderText: {
        alignSelf: 'flex-start',
        fontSize: 13,
        marginLeft: 5
    },
    disabled: {
        backgroundColor: 'transparent'
    }
});

export { DatePicker };