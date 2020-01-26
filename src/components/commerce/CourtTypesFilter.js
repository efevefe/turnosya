import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TouchableWithoutFeedback } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { MAIN_COLOR } from '../../constants';

class CourtTypesFilter extends Component {
  state = { selectedIndexes: [0], buttons: ['Todas'] };

  componentDidMount() {
    this.generateButtons();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courts !== this.props.courts) {
      this.generateButtons();
    }
  }

  generateButtons = () => {
    const buttons = ['Todas'];

    for (const court of this.props.courts) {
      const courtType = court.court;

      if (!buttons.includes(courtType)) {
        buttons.push(courtType);
      }
    }

    this.setState({ buttons }, () => this.updateIndexes(this.state.selectedIndexes));
  };

  updateIndexes = selectedIndexes => {
    if (!selectedIndexes.length) return;

    const newIndex = selectedIndexes.filter(value => !this.state.selectedIndexes.includes(value));

    if (
      (newIndex.length && (newIndex[0] === 0 || selectedIndexes.length === this.state.buttons.length - 1)) ||
      (selectedIndexes.length === this.state.selectedIndexes.length && selectedIndexes.includes(0))
    ) {
      selectedIndexes = this.state.buttons.map((button, index) => index);
    } else if (selectedIndexes.length < this.state.selectedIndexes.length) {
      const oldIndex = this.state.selectedIndexes.filter(value => !selectedIndexes.includes(value))[0];

      if (oldIndex === 0) return;

      if (this.state.selectedIndexes.includes(0)) {
        selectedIndexes = selectedIndexes.filter(value => value !== 0);
      }
    }

    this.setState({ selectedIndexes });

    this.props.onValueChange(
      this.state.buttons.filter((button, index) => {
        return selectedIndexes.includes(index);
      })
    );
  };

  render() {
    // solo se muestra si hay mas de 1 tipo de cancha
    if (this.state.buttons.length < 3) return null;

    return (
      <View style={styles.mainContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <ButtonGroup
            {...this.props}
            Component={TouchableWithoutFeedback}
            buttons={this.state.buttons}
            selectMultiple
            onPress={this.updateIndexes}
            selectedIndexes={this.state.selectedIndexes}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.containerStyle}
            textStyle={styles.textStyle}
            innerBorderStyle={styles.innerBorderStyle}
            selectedButtonStyle={styles.selectedButtonStyle}
            selectedTextStyle={styles.selectedTextStyle}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: MAIN_COLOR,
    paddingTop: 4,
  },
  buttonStyle: {
    width: 'auto',
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 8,
    backgroundColor: MAIN_COLOR,
  },
  containerStyle: {
    height: 30,
    borderWidth: 0,
    margin: 0,
    backgroundColor: MAIN_COLOR,
  },
  textStyle: {
    fontSize: 13,
    color: 'white',
  },
  innerBorderStyle: {
    width: 0,
  },
  selectedButtonStyle: {
    backgroundColor: 'white',
  },
  selectedTextStyle: {
    color: MAIN_COLOR,
  },
});

const mapStateToProps = state => {
  return { courts: state.courtsList.courts };
};

export default connect(mapStateToProps, null)(CourtTypesFilter);
