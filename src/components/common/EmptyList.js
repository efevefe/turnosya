import React from 'react';
import { ScrollView, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyList = ({ title, icon, refreshControl }) => {
    renderIcon = icon => {
        if (icon) {
            return (
                <Ionicons name={icon} size={32} color='grey' style={{ paddingBottom: 5 }} />
            );
        }

        return (
            <Image
                source={require('../../../assets/turnosya-grey.png')}
                style={styles.imageStyle}
            />
        );
    }

    return (
        <ScrollView
            {...this.props}
            contentContainerStyle={styles.containerStyle}
        >
            {this.renderIcon(icon)}
            <Text style={styles.textStyle}>
                {title}
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerStyle: { 
        flexGrow: 1, 
        alignSelf: 'stretch', 
        alignItems: 'center',
        justifyContent: 'center' 
    },
    textStyle: {
        padding: 0,
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: 'center',
        color: 'grey'
    },
    imageStyle: {
        height: 40,
        width: 40
    }
});

export { EmptyList };