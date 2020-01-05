import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BarChart,
  Spinner,
  Toast,
  DatePicker,
  Button,
  CardSection,
  Menu,
  IconButton
} from '../../common';
import {
  readReservationsOnDays,
  onCommerceReportValueChange
} from '../../../actions/CommerceReportsActions';
import { ScrollView, Text } from 'react-native';
import { formattedMoment } from '../../../utils';
import moment from 'moment';

class BarChartReport extends Component {
  constructor(props) {
    super(props);
    const { commerceId, startDate, endDate } = props;

    props.readReservationsOnDays(commerceId, startDate, endDate);

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

  onEndDateValueChange = endDate => {
    endDate = moment(endDate);

    if (endDate > formattedMoment()) {
      return Toast.show({
        text: 'No puede ingresar una fecha mayor a la actual'
      });
    }

    this.props.onCommerceReportValueChange({
      prop: 'endDate',
      value: endDate
    });
  };

  render() {
    const { modal, modalStartDate, modalEndDate } = this.state;

    const dataBar = {
      labels: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      datasets: [{ data: this.props.data }]
    };

    if (this.props.loading) return <Spinner />;

    // if (isDataEmpty) return this.onDataEmpty();

    return (
      <ScrollView style={{ flex: 1 }}>
        <Menu
          title="Seleccione el periodo a diagramar"
          onBackdropPress={() =>
            this.setState({
              modal: false,
              modalStartDate: this.props.startDate,
              modalEndDate: this.props.endDate
            })
          }
          isVisible={modal}
          overlayStyle={{ alignItems: 'center' }}
          titleStyle={{ alignSelf: 'center' }}
        >
          <CardSection
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              paddingBottom: 10
            }}
          >
            <DatePicker
              date={modalStartDate}
              mode="date"
              label="Desde:"
              placeholder="Fecha desde"
              onDateChange={modalStartDate => this.setState({ modalStartDate })}
            />
            <DatePicker
              date={modalEndDate}
              mode="date"
              label="Hasta:"
              placeholder="Opcional"
              onDateChange={modalEndDate => this.setState({ modalEndDate })}
            />
          </CardSection>
          <Button
            title={'Generar Reporte'}
            onPress={() => {
              this.props.readReservationsOnDays(
                this.props.commerceId,
                moment(modalStartDate),
                moment(modalEndDate)
              );

              this.props.onCommerceReportValueChange({
                prop: 'startDate',
                value: moment(modalStartDate)
              });
              this.props.onCommerceReportValueChange({
                prop: 'endDate',
                value: moment(modalEndDate)
              });
              this.setState({ modal: false });
            }}
          />
        </Menu>
        <Text style={{ fontSize: 30 }}>
          Reservas por día entre el {moment(this.props.startDate).format('L')} y{' '}
          {moment(this.props.endDate).format('L')}
        </Text>
        <BarChart data={dataBar} style={{ marginTop: 10 }} />
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
  readReservationsOnDays,
  onCommerceReportValueChange
})(BarChartReport);
