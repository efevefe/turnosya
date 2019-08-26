import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Card } from 'react-native-elements';

class CommercesAreaItem extends Component {
  onButtonPressHandler(id) {
    this.props.navigation.navigate('commercesList', { idArea: id });
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

export default CommercesAreaItem;
