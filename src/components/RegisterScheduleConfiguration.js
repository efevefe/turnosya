import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Button, Spinner } from './common';

class RegisterScheduleConfiguration extends Component {
  render() {
    if (this.props.loading) <Spinner size="large" />;

    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={20}>
        <View>
          <Card>
            <CardSection>{/* Aca se mete el primer slider*/}</CardSection>

            <CardSection>{/* Aca se mete el segundo slider*/}</CardSection>
            <CardSection>
              <Button
                title="Guardar"
                loading={this.props.loading}
                // onPress={}
              />
            </CardSection>
          </Card>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default RegisterScheduleConfiguration;
