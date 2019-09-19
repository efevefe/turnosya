import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import { CardSection } from './common';
import { MONTHS, DAYS, MAIN_COLOR } from '../constants';

const CourtReservationDetails = props => {
    const { commerce, court, slot, children } = props;

    if (commerce && court && slot) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.mainContainer}>
                    <Avatar
                        rounded
                        source={commerce.profilePicture ? { uri: commerce.profilePicture } : null}
                        size={90}
                        icon={{ name: 'store' }}
                        containerStyle={styles.avatarStyle}
                    />
                    <View style={styles.contentContainer}>
                        <CardSection style={[styles.cardSections, { paddingBottom: 8 }]}>
                            <Text style={styles.commerceName}>
                                {commerce.name}
                            </Text>
                        </CardSection>
                        <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
                            <Text style={styles.courtName}>
                                {court.name}
                            </Text>
                        </CardSection>
                        <CardSection style={styles.cardSections}>
                            <Text style={styles.textStyle}>
                                {`${court.court} - ${court.ground}`}
                            </Text>
                        </CardSection>
                        <Divider style={styles.divider} />
                        <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
                            <Text style={styles.textStyle}>
                                {`${DAYS[slot.startHour.day()]} ${slot.startHour.format('D')} de ${MONTHS[slot.startHour.month()]}`}
                            </Text>
                        </CardSection>
                        <CardSection style={styles.cardSections}>
                            <Text style={styles.textStyle}>
                                {`De ${slot.startHour.format('HH:mm')} hs. a ${slot.endHour.format('HH:mm')} hs.`}
                            </Text>
                        </CardSection>
                        {children}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 5,
        paddingTop: 15,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    avatarStyle: {
        borderWidth: 3,
        borderColor: MAIN_COLOR,
        margin: 12,
        marginBottom: 8
    },
    contentContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'flex-start'
    },
    commerceName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    courtName: {
        fontSize: 17
    },
    textStyle: {
        fontSize: 14
    },
    divider: {
        margin: 10,
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: 'grey'
    },
    cardSections: {
        alignItems: 'center'
    }
});

export default CourtReservationDetails;