import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Card, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem, Menu, Spinner, Button, CardSection } from '../common';
import { onCommerceMPagoTokenEnable, onCommerceMPagoTokenDisable } from '../../actions';
import { SUCCESS_COLOR, MAIN_COLOR } from '../../constants';

class PaymentSettings extends Component {
  state = { mPagoModalVisible: false };

  mPagoSwitchPressHandler = () => {
    this.props.mPagoToken
      ? this.props.onCommerceMPagoTokenDisable(this.props.commerceId)
      : this.props.onCommerceMPagoTokenEnable(this.props.commerceId);
    this.setState({ mPagoModalVisible: false });
  };

  renderConfirmMPagoSwitch = () => {
    // ventana de confirmacion para habilitar/deshabilitar pago
    return (
      <Menu
        title={`¿Está seguro que desea ${
          this.props.mPagoToken ? 'deshabilitar' : 'habilitar'
          } el cobro de sus turnos mediante Mercado Pago?`}
        onBackdropPress={() => this.setState({ mPagoModalVisible: false })}
        isVisible={this.state.mPagoModalVisible}
      >
        <MenuItem title="Confirmar" icon="md-checkmark" onPress={this.mPagoSwitchPressHandler} />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem title="Cancelar" icon="md-close" onPress={() => this.setState({ mPagoModalVisible: false })} />
      </Menu>
    );
  };

  render() {
    return this.props.mPagoTokenReadLoading ? (
      <Spinner />
    ) : (
        <Card
          title="Estado Actual"
          textAlign="center"
          containerStyle={styles.cardStyle}
          dividerStyle={{ marginHorizontal: 12 }}
        >
          {this.renderConfirmMPagoSwitch()}
          {this.props.hasAnyMPagoToken ? (
            <View>
              <CardSection style={styles.stateCardSection}>
                <View style={styles.stateTextContainer}>
                  <Text style={styles.stateTextStyle}>
                    {this.props.mPagoToken ? 'Habilitado' : 'Deshabilitado'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Ionicons
                    name={this.props.mPagoToken ? 'md-checkmark-circle' : 'md-close-circle'}
                    color={this.props.mPagoToken ? SUCCESS_COLOR : MAIN_COLOR}
                    size={23}
                  />
                </View>
              </CardSection>
              <CardSection>
                <Button
                  title={`${this.props.mPagoToken ? 'Deshabilitar' : 'Habilitar'} Cobro`}
                  onPress={() => this.setState({ mPagoModalVisible: true })}
                  loading={this.props.mPagoTokenSwitchLoading}
                />
              </CardSection>
            </View>
          ) : (
              <View>
                <CardSection style={styles.stateCardSection}>
                  <View style={styles.stateTextContainer}>
                    <Text style={styles.stateTextStyle}>
                      Deshabilitado
                  </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Ionicons
                      name='md-close-circle'
                      color={MAIN_COLOR}
                      size={23}
                    />
                  </View>
                </CardSection>
                <CardSection>
                  <Button
                    title="Comenzar a Cobrar"
                    onPress={() => this.props.navigation.navigate('paymentSettingsWeb')}
                  />
                </CardSection>
              </View>
            )}
        </Card>
      );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    padding: 5,
    paddingTop: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  stateTextStyle: {
    textAlign: 'left',
    fontSize: 15
  },
  stateCardSection: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 5,
    flexDirection: 'row'
  },
  stateTextContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1
  }
});

const mapStateToProps = state => {
  const {
    commerceId,
    mPagoTokenSwitchLoading,
    mPagoTokenReadLoading,
    hasAnyMPagoToken,
    mPagoToken
  } = state.commerceData;
  return { commerceId, mPagoTokenSwitchLoading, mPagoTokenReadLoading, hasAnyMPagoToken, mPagoToken };
};

export default connect(mapStateToProps, { onCommerceMPagoTokenEnable, onCommerceMPagoTokenDisable })(PaymentSettings);
