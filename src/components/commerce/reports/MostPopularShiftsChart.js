import React, { Component } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  BarChart,
  Spinner,
  DatePicker,
  Button,
  CardSection,
  Menu,
  IconButton,
  EmptyList
} from '../../common';
import {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  readMostPopularShiftsByRange
} from '../../../actions/CommerceReportsActions';

const pickerWidth = Math.round(Dimensions.get('window').width) / 3.1;

class MostPopularShiftsChart extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readMostPopularShiftsByRange(commerceId, startDate, endDate);

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
        <IconButton icon="md-create" onPress={() => this.onEditPress()} />
      )
    });
  }

  onEditPress = () => {
    this.setState({ modal: true });
    if (!this.props.data.length) this.props.onCommerceReportValueReset();
  };

  onGenerateReportPress = () => {
    this.props.readMostPopularShiftsByRange(
      this.props.commerceId,
      moment(this.state.modalStartDate),
      moment(this.state.modalEndDate)
    );

    this.props.onCommerceReportValueChange({
      startDate: moment(this.state.modalStartDate),
      endDate: moment(this.state.modalEndDate)
    });

    this.setState({ modal: false });
  };

  renderChart = () => {
    if (this.props.data.data.length) {
      const dataBar = {
        labels: this.props.data.labels,
        datasets: [{ data: this.props.data.data }]
      };

      return (
        <BarChart
          title={
            'TURNOS CON MAYOR DEMANDA ENTRE EL ' +
            this.props.startDate.format('DD/MM/YYYY') +
            ' Y EL ' +
            this.props.endDate.format('DD/MM/YYYY')
          }
          xlabel="HORARIOS"
          data={dataBar}
        />
      );
    }

    return (
      <EmptyList
        title={
          'Parece que no hay reservas entre el ' +
          this.props.startDate.format('DD/MM/YYYY') +
          ' y el ' +
          this.props.endDate.format('DD/MM/YYYY')
        }
      />
    );
  };

  render() {
    if (this.props.loading) return <Spinner />;

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

        {this.renderChart()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { labels, data, startDate, endDate, loading } = state.commerceReports;
  const { commerceId } = state.commerceData;

  return {
    labels,
    data,
    startDate,
    endDate,
    commerceId,
    loading
  };
};

export default connect(mapStateToProps, {
  onCommerceReportValueChange,
  onCommerceReportValueReset,
  readMostPopularShiftsByRange
})(MostPopularShiftsChart);
