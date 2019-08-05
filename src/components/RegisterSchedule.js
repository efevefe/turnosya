import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { CardSection, Button, Input } from './common';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { onScheduleFormOpen, onScheduleValueChange } from '../actions';
import { Card, CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MAIN_COLOR } from '../constants';

class RegisterSchedule extends Component {
  renderSecondTurn(
    checkValue,
    checkProp,
    openValue,
    openProp,
    closeValue,
    closeProp
  ) {
    if (checkValue) {
      return (
        <View>
          <View style={styles.viewPickerDate}>
            <DatePicker
              date={openValue}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: openProp,
                  value
                });
              }}
            />

            <DatePicker
              date={closeValue}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: closeProp,
                  value
                });
              }}
            />
          </View>
          <CheckBox
            containerStyle={{ flex: 1 }}
            title="Agregar segundo turno"
            iconType="material"
            checkedIcon="clear"
            checkedColor={MAIN_COLOR}
            checkedTitle="Borrar segundo turno"
            checked={checkValue}
            onPress={() => {
              this.props.onScheduleValueChange({
                prop: checkProp,
                value: false
              });
              this.props.onScheduleValueChange({
                prop: openProp,
                value: ''
              });
              this.props.onScheduleValueChange({
                prop: closeProp,
                value: ''
              });
            }}
          />
        </View>
      );
    } else
      return (
        <CheckBox
          title="Agragar segundo turno"
          iconType="material"
          uncheckedIcon="add"
          uncheckedColor={MAIN_COLOR}
          checked={checkValue}
          onPress={() =>
            this.props.onScheduleValueChange({ prop: checkProp, value: true })
          }
          containerStyle={{ flex: 1 }}
        />
      );
  }

  render() {
    return (
      <KeyboardAwareScrollView>
        <Card containerStyle={styles.cardStyle} title="Lunes">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.mondayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'mondayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.mondayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'mondayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.mondayCheck,
              'mondayCheck',
              this.props.mondayOpen2,
              'mondayOpen2',
              this.props.mondayClose2,
              'mondayClose2'
            )}
          </CardSection>
        </Card>

        <Card containerStyle={styles.cardStyle} title="Martes">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.thuesdayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'thuesdayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.thuesdayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'thuesdayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.thuesdayCheck,
              'thuesdayCheck',
              this.props.thuesdayOpen2,
              'thuesdayOpen2',
              this.props.thuesdayClose2,
              'thuesdayClose2'
            )}
          </CardSection>
        </Card>
        <Card containerStyle={styles.cardStyle} title="Miercoles">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.wednesdayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'wednesdayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.wednesdayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'wednesdayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.wednesdayCheck,
              'wednesdayCheck',
              this.props.wednesdayOpen2,
              'wednesdayOpen2',
              this.props.wednesdayClose2,
              'wednesdayClose2'
            )}
          </CardSection>
        </Card>
        <Card containerStyle={styles.cardStyle} title="Jueves">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.thursdayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'thursdayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.thursdayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'thursdayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.thursdayCheck,
              'thursdayCheck',
              this.props.thursdayOpen2,
              'thursdayOpen2',
              this.props.thursdayClose2,
              'thursdayClose2'
            )}
          </CardSection>
        </Card>
        <Card containerStyle={styles.cardStyle} title="Viernes">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.fridayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'fridayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.fridayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'fridayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.fridayCheck,
              'fridayCheck',
              this.props.fridayOpen2,
              'fridayOpen2',
              this.props.fridayClose2,
              'fridayClose2'
            )}
          </CardSection>
        </Card>

        <Card containerStyle={styles.cardStyle} title="Sabado">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.saturdayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'saturdayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.saturdayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'saturdayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.saturdayCheck,
              'saturdayCheck',
              this.props.saturdayOpen2,
              'saturdayOpen2',
              this.props.saturdayClose2,
              'saturdayClose2'
            )}
          </CardSection>
        </Card>

        <Card containerStyle={styles.cardStyle} title="Domingo">
          <CardSection style={styles.viewPickerDate}>
            <DatePicker
              date={this.props.sundayOpen}
              mode="time"
              placeholder="Seleccione hora de apertura"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'sundayOpen',
                  value
                });
              }}
            />

            <DatePicker
              date={this.props.sundayClose}
              mode="time"
              placeholder="Seleccione hora de cierre"
              confirmBtnText="Confirmar"
              cancelBtnText="Cancelar"
              iconComponent={<Ionicons name="md-time" size={30} />}
              customStyles={{
                dateInput: {
                  borderColor: 'transparent'
                },
                placeholderText: {
                  textAlign: 'center',
                  fontSize: 10
                }
              }}
              onDateChange={value => {
                this.props.onScheduleValueChange({
                  prop: 'sundayClose',
                  value
                });
              }}
            />
          </CardSection>
          <CardSection>
            {this.renderSecondTurn(
              this.props.sundayCheck,
              'sundayCheck',
              this.props.sundayOpen2,
              'sundayOpen2',
              this.props.sundayClose2,
              'sundayClose2'
            )}
          </CardSection>
        </Card>

        <Button
          style={styles.cardStyle}
          title="Guardar"
          loading={this.props.loading}
          //onPress={this.onButtonPressHandler.bind(this)}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewPickerDate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardStyle: {
    padding: 5,
    paddingTop: 10,
    borderRadius: 10
  }
});

const mapStateToProps = state => {
  const {
    mondayOpen,
    mondayClose,
    mondayOpen2,
    mondayClose2,
    mondayCheck,
    thuesdayOpen,
    thuesdayClose,
    thuesdayOpen2,
    thuesdayClose2,
    thuesdayCheck,
    wednesdayOpen,
    wednesdayClose,
    wednesdayOpen2,
    wednesdayClose2,
    wednesdayCheck,
    thursdayOpen,
    thursdayClose,
    thursdayOpen2,
    thursdayClose2,
    thursdayCheck,
    fridayOpen,
    fridayClose,
    fridayOpen2,
    fridayClose2,
    fridayCheck,
    saturdayOpen,
    saturdayClose,
    saturdayOpen2,
    saturdayClose2,
    saturdayCheck,
    sundayOpen,
    sundayClose,
    sundayOpen2,
    sundayClose2,
    sundayCheck,
    loading
  } = state.registerSchedule;

  return {
    mondayOpen,
    mondayClose,
    mondayOpen2,
    mondayClose2,
    mondayCheck,
    thuesdayOpen,
    thuesdayClose,
    thuesdayOpen2,
    thuesdayClose2,
    thuesdayCheck,
    wednesdayOpen,
    wednesdayClose,
    wednesdayOpen2,
    wednesdayClose2,
    wednesdayCheck,
    thursdayOpen,
    thursdayClose,
    thursdayOpen2,
    thursdayClose2,
    thursdayCheck,
    fridayOpen,
    fridayClose,
    fridayOpen2,
    fridayClose2,
    fridayCheck,
    saturdayOpen,
    saturdayClose,
    saturdayOpen2,
    saturdayClose2,
    saturdayCheck,
    sundayOpen,
    sundayClose,
    sundayOpen2,
    sundayClose2,
    sundayCheck,
    loading
  };
};

export default connect(
  mapStateToProps,
  { onScheduleFormOpen, onScheduleValueChange }
)(RegisterSchedule);
