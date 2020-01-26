import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BadgeButtonGroup } from '../common';

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

    this.setState(
      { buttons },
      () => this.updateIndexes(this.state.selectedIndexes)
    );
  }

  updateIndexes = selectedIndexes => {
    if (!selectedIndexes.length) return;

    const newIndex = selectedIndexes.filter(
      value => !this.state.selectedIndexes.includes(value)
    );

    if (
      (newIndex.length && (newIndex[0] === 0 || selectedIndexes.length === this.state.buttons.length - 1))
      || (selectedIndexes.length === this.state.selectedIndexes.length && selectedIndexes.includes(0))
    ) {
      selectedIndexes = this.state.buttons.map(
        (button, index) => index
      );
    } else if (selectedIndexes.length < this.state.selectedIndexes.length) {
      const oldIndex = this.state.selectedIndexes.filter(
        value => !selectedIndexes.includes(value)
      )[0];

      if (oldIndex === 0) return;

      if (this.state.selectedIndexes.includes(0)) {
        selectedIndexes = selectedIndexes.filter(
          value => value !== 0
        );
      }
    }

    this.setState({ selectedIndexes });

    this.props.onValueChange(
      this.state.buttons.filter((button, index) => {
        return selectedIndexes.includes(index);
      })
    );
  }

  render() {
    // solo se muestra si hay mas de 1 tipo de cancha
    if (this.state.buttons.length < 3) return null;

    return (
      <BadgeButtonGroup
        buttons={this.state.buttons}
        onPress={this.updateIndexes}
        selectedIndexes={this.state.selectedIndexes}
        selectMultiple
      />
    );
  }
}

const mapStateToProps = state => {
  return { courts: state.courtsList.courts };
}

export default connect(mapStateToProps, null)(CourtTypesFilter);