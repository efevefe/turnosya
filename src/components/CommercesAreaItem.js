import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

class CommercesAreaItem extends Component {
  onButtonPressHandler(id) {
    const navigateAction = NavigationActions.navigate({
      routeName: 'commercesList',
      params: { idArea: id }
    });

    this.props.navigation.navigate(navigateAction);
  }
  render() {
    const { id, name, image } = this.props.area;
    return (
      <View>
        <TouchableHighlight
          onPress={() => this.onButtonPressHandler(id)}
          underlayColor="transparent"
        >
          <Card
            image={(source = image ? { uri: image } : null)}
            containerStyle={{ borderRadius: 10, overflow: 'hidden' }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center'
                // textAlignVertical: 'center'
              }}
            >
              {name}
            </Text>
          </Card>
        </TouchableHighlight>
      </View>
    );
  }
}

export default connect(
  null,
  {}
)(CommercesAreaItem);
