import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

class CommerceCourtsListItem extends Component {
    render() {
        const {
            name,
            court,
            ground,
            price,
            lightPrice,
            id
        } = this.props.court;

        return (
            <ListItem
                title={name}
                titleStyle={{
                    textAlign: 'left',
                    display: 'flex'
                }}
                rightTitle={
                    lightPrice !== '' ? (
                        <View style={{ justifyContent: 'space-between' }}>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    color: 'black'
                                }}
                            >{`Sin luz: $${price}`}</Text>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    color: 'black'
                                }}
                            >{`Con luz: $${lightPrice}`}</Text>
                        </View>
                    ) : (
                            <Text>{`Sin luz: $${price}`}</Text>
                        )
                }
                key={id}
                subtitle={
                    <Text style={{ color: 'grey' }}>
                        {`${court} - ${ground}`}
                    </Text>
                }
                rightElement={
                    <Ionicons
                        icon='md-arrow-forward'
                        color='black'
                        iconSize={22}
                    />
                }
                onPress={this.props.onPress}
                bottomDivider
            />
        );
    }
}

export default CommerceCourtsListItem;