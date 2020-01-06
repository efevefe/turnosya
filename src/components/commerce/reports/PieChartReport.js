import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScrollView, Dimensions } from 'react-native';
import {
  PieChart,
  Spinner,
  Button,
  DatePicker,
  IconButton,
  Menu,
  CardSection
} from '../../common';
import {
  readStateTurnsReservations,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { MAIN_COLOR, MAIN_COLOR_DISABLED } from '../../../constants';

const pickerWidth = Math.round(Dimensions.get('window').width) / 3.1;

class PieChartReport extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readStateTurnsReservations(commerceId, startDate, endDate);

    this.state = {
      modal: false,
      modalStartDate: startDate,
      modalEndDate: endDate
    };
  }
  
  static navigationOptions = ({ navigation }) => {
    return { headerRight: navigation.getParam('rightIcon') };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      rightIcon: (
        <IconButton
          icon="md-create"
          onPress={() => this.setState({ modal: true })}
        />
      )
    });
  }

  // onDataEmpty = () => {};

  onGenerateReportPress = () => {
    this.props.readStateTurnsReservations(
      this.props.commerceId,
      moment(this.state.modalStartDate),
      moment(this.state.modalEndDate)
    );

    this.props.onCommerceReportValueChange({
      prop: 'startDate',
      value: moment(this.state.modalStartDate)
    });

    this.props.onCommerceReportValueChange({
      prop: 'endDate',
      value: moment(this.state.modalEndDate)
    });

    this.setState({ modal: false });
  }

  render() {
    if (this.props.loading) return <Spinner />;
    // if (isDataEmpty) return this.onDataEmpty();

    const dataPie = this.props.data[1]
      ? [
        {
          name: 'Realizados',
          count: this.props.data[0],
          color: MAIN_COLOR,
          legendFontColor: 'black',
          legendFontSize: 15
        },
        {
          name: 'Cancelados',
          count: this.props.data[1],
          color: MAIN_COLOR_DISABLED,
          legendFontColor: 'black',
          legendFontSize: 15
        }
      ]
      : [];

    return (
      <ScrollView>
        <Menu
          title="Seleccionar Periodo"
          isVisible={this.state.modal}
          onBackdropPress={() =>
            this.setState({
              modal: false,
              modalStartDate: this.props.startDate,
              modalEndDate: this.props.endDate
            })
          }
        >
          <CardSection
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 10
            }}
          >
            <DatePicker
              date={this.state.modalStartDate}
              mode="date"
              label="Desde:"
              placeholder="Fecha desde"
              pickerWidth={pickerWidth}
              onDateChange={modalStartDate => this.setState({ modalStartDate })}
            />
            <DatePicker
              date={this.state.modalEndDate}
              mode="date"
              label="Hasta:"
              placeholder="Opcional"
              pickerWidth={pickerWidth}
              onDateChange={modalEndDate => this.setState({ modalEndDate })}
            />
          </CardSection>
          <CardSection>
            <Button
              title={'Generar Reporte'}
              onPress={this.onGenerateReportPress}
            />
          </CardSection>
        </Menu>

        <PieChart
          title={'TURNOS RESERVADOS Y CANCELADOS ENTRE EL ' +
            this.props.startDate.format('DD/MM/YYYY') + ' Y EL ' +
            this.props.endDate.format('DD/MM/YYYY')}
          data={dataPie}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {
    data,
    startDate,
    endDate,
    loading
    // isDataEmpty
  } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    data,
    startDate,
    endDate,
    commerceId,
    loading
    // isDataEmpty
  };
};

export default connect(mapStateToProps, {
  readStateTurnsReservations,
  onCommerceReportValueChange
})(PieChartReport);
