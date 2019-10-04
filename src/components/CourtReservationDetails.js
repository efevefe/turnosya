import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import moment from 'moment';
import { CardSection } from './common';
import { MONTHS, DAYS, MAIN_COLOR } from '../constants';

const CourtReservationDetails = props => {
    const {
        commerce,
        court,
        startDate,
        endDate,
        price,
        light,
        showPrice,
        children
    } = props;

    renderPrice = () => {
        if (showPrice) {
            return (
                <CardSection style={[styles.cardSections, { marginTop: 15 }]}>
                    <Text style={styles.bigText}>
                        {`$${price}`}
                    </Text>
                </CardSection>
            );
        }
    }

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
                        <Text style={styles.bigText}>
                            {commerce.name}
                        </Text>
                    </CardSection>
                    <CardSection style={[styles.cardSections, { paddingBottom: 3 }]}>
                        <Text style={styles.mediumText}>
                            {commerce.address}
                        </Text>
                    </CardSection>
                    <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
                        <Text style={styles.mediumText}>
                            {court.name}
                        </Text>
                    </CardSection>
                    <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
                        <Text style={styles.regularText}>
                            {`${court.court} - ${court.ground}`}
                        </Text>
                    </CardSection>
                    <CardSection style={styles.cardSections}>
                        <Text style={styles.regularText}>
                            {light ? 'Con Luz' : 'Sin Luz'}
                        </Text>
                    </CardSection>
                    <Divider style={styles.divider} />
                    <CardSection style={[styles.cardSections, { paddingBottom: 0 }]}>
                        <Text style={styles.regularText}>
                            {`${DAYS[moment(startDate).day()]} ${moment(startDate).format('D')} de ${MONTHS[moment(startDate).month()]}`}
                        </Text>
                    </CardSection>
                    <CardSection style={styles.cardSections}>
                        <Text style={styles.regularText}>
                            {`De ${moment(startDate).format('HH:mm')} hs. a ${moment(endDate).format('HH:mm')} hs.`}
                        </Text>
                    </CardSection>
                    {this.renderPrice()}
                    {children}
                </View>
            </View>
        </View>
    );
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
    bigText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    mediumText: {
        fontSize: 17
    },
    regularText: {
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