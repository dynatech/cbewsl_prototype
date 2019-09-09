import moment from 'moment';
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { field_survey_styles } from '../../../assets/styles/field_survey_styles';
import Storage from '../../utils/storage';
import { spinner_styles } from '../../../assets/styles/spinner_styles';
import Spinner from 'react-native-loading-spinner-overlay';
import Notification from '../../utils/alert_notification';
import { defaults } from '../../../assets/styles/default_styles';
import EwiTemplate from '../../utils/ewi_template';

export default class CurrentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_details: [],
      release_button: [],
      retrigger_details: [],
      spinner: false,
      event_start_ts: ""
    };
  }

  navigateEwi(tab) {
    switch (tab) {
      case "alert_validation":
        this.props.navigation.navigate('alert_validation')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  getCurrentAlert() {
    Notification.endOfValidity();
    let offline_data = Storage.getItem("Pub&CandidAlert")
    offline_data.then(response => {
      let candidate_alert = JSON.parse(response.candidate_alert)
      let recommended_response = ""
      let view = []
      let latest = response.leo.latest
      let extended = response.leo.extended
      let overdue = response.leo.overdue
      let alert_details = []
      let alert_level = []
      let moms_header_container = []
      let rain_header_container = []
      let rain_temp = ""
      let moms_temp = ""
      let has_alert_data = false;
      let release_button = [];

      if (latest.length != 0) {
        
        let alert_level = this.displayAlertLevel(latest[0].public_alert_symbol.alert_level);
        view.push(alert_level)
        let triggers = this.displayTrigger(latest[0].releases[0].triggers, latest);
        this.setState({ retrigger_details: this.getRetriggers(candidate_alert) });
        view.push(triggers);
        view.push(<Text style={{ fontSize: 20, paddingBottom: 20 }}><Text style={{ fontWeight: 'bold' }}>Recommended response:</Text> {latest[0].public_alert_symbol.recommended_response}</Text>)
        release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
              <Text style={defaults.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS(latest[0].internal_alert_level, latest[0].releases[0].data_ts) }}>
              <Text style={defaults.buttonText}>Send EWI</Text>
            </TouchableOpacity>
          </View>
        </View>);
        this.setState({ release_button: release_button })
      }

      if (extended.length != 0) {
        console.log(extended[0])
        let day_of_extended = "Day " + extended[0].day + " of Extended monitoring";
        let latest_release = extendegetCurrentAlertd[0].releases[0].release_time;
        let data_ts = this.formatDateTime(extended[0].releases[0].data_ts);
        let formatted_latest_release = moment(latest_release, 'HH:mm').format('h:mm A');
        let latest_release_text = data_ts["date_only_format"] + " " + formatted_latest_release;

        let alert_level = this.displayAlertLevel(extended[0].public_alert_symbol.alert_level);
        view.push(alert_level);
        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>{day_of_extended}</Text>)
        view.push(<Text style={{ fontSize: 20, textAlign: 'center' }}>{"Latest release: " + latest_release_text}</Text>)
        release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
              <Text style={defaults.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={true} style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS() }}>
              <Text style={defaults.buttonText}>Send EWI</Text>
            </TouchableOpacity>
          </View>
        </View>);
        this.setState({ release_button: release_button })

      }

      if (overdue.length != 0) {
        let alert_level = this.displayAlertLevel(overdue[0].public_alert_symbol.alert_level);
        view.push(alert_level);
        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Triggers</Text>)
        let triggers = this.displayTrigger(overdue[0].releases[0].triggers, overdue);
        view.push(triggers);

        view.push(<Text style={{ fontSize: 20, paddingTop: 20, paddingBottom: 20 }}>Recommended response: {overdue[0].public_alert_symbol.recommended_response}</Text>)
        release_button.push(<View style={{ textAlign: 'center', flex: 0.5 }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={defaults.button} onPress={() => { this.releaseAlertConfirmation(candidate_alert[0]) }}>
              <Text style={defaults.buttonText}>Release</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={true} style={defaults.button} onPress={() => { EwiTemplate.EWI_SMS() }}>
              <Text style={defaults.buttonText}>Send EWI</Text>
            </TouchableOpacity>
          </View>
        </View>);
        this.setState({ release_button: release_button })
      }

      if (latest.length == 0 || extended.length == 0 || overdue.length == 0) {
        release_button.push(<Text style={{ paddingTop: '20%', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>No current alert</Text>);
        this.setState({ release_button: release_button })
      }

      this.setState({ alert_details: view })
      this.setState({ spinner: false })
    })
  }

  displayAlertLevel(alert_level) {
    let view = []
    switch (alert_level) {
      case 1:
        view.push(<Text style={{ fontSize: 50, color: "#ee9d01", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 1</Text>)
        break;
      case 2:
        view.push(<Text style={{ fontSize: 50, color: "#ee9d01", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 2</Text>)
        break;
      case 3:
        view.push(<Text style={{ fontSize: 50, color: "#ee9d01", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 3</Text>)
        break;
      default:
        view.push(<Text style={{ fontSize: 50, color: "green", fontWeight: 'bold', width: '100%', textAlign: 'center' }}>Alert 0</Text>)
        break;
    }

    return view;
  }

  displayTrigger(triggers, data) {
    let view = [];
    console.log(triggers);
    console.log(data);

    let event_start = this.formatDateTime(data[0].event.event_start);
    this.setState({event_start_ts: data[0].event.event_start})
    let validity = this.formatDateTime(data[0].event.validity);
    let latest_release = data[0].releases[0].release_time;
    let data_ts = this.formatDateTime(data[0].releases[0].data_ts);
    let formatted_release_time = moment(latest_release, 'HH:mm').format('h:mm A');
    let latest_release_text = data_ts["date_only_format"] + " " + formatted_release_time;

    if (triggers.length != 0) {


      triggers.forEach(element => {
        switch (element.internal_sym.alert_symbol) {
          case "m":
          case "M":
            view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Manifestation of movements:</Text> {element.info}</Text>)
            break;
          case "R":
            view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Rainfall Trigger:</Text> {element.info}</Text>)
            break;
          case "E":
            view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Earthquake:</Text> {element.info}</Text>)
            break;
        }
  
        view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Event start:</Text> {event_start.text_format_timestamp}</Text>)
        view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Data timestamp :</Text> {data_ts.text_format_timestamp}</Text>)
        view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Latest release:</Text> {latest_release_text}</Text>)
        view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Validity:</Text> {validity.text_format_timestamp}</Text>)

      });
    } else {
      let temp = data[0];
      console.log(temp)
      let last_retirgger_ts = ""
      let last_data_ts = this.formatDateTime(data[0].releases[0].data_ts)
      let temp_info = ""
      temp.releases.forEach(element => {
        if (element.triggers.length != 0) {
          last_retirgger_ts = this.formatDateTime(element.triggers[0].ts);
          temp_info = element.triggers[0].info
        }
      })

      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Event start:</Text> {event_start.text_format_timestamp}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Last retrigger timestamp :</Text> {last_retirgger_ts.text_format_timestamp}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Last retrigger info :</Text> {temp_info}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Latest Data timestamp release:</Text> {last_data_ts.text_format_timestamp}</Text>)
      view.push(<Text style={{ fontSize: 20, paddingBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Validity:</Text> {validity.text_format_timestamp}</Text>)
    }


    return view;
  }

  releaseAlertConfirmation(alert_data) {
    if (alert_data.is_release_time == false) {
      Alert.alert('Notice', 'Please wait for the next release time.')
    } else {
      Alert.alert(
        'Release Alert',
        'Are you sure you want release this alert?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => this.releaseAlert(alert_data) },
        ],
        { cancelable: false },
      );
    }
  }

  releaseAlert(alert_data) {
    Notification.formatCandidateAlerts(alert_data)
    setTimeout(() => {
      this.getCurrentAlert()
    }, 3000);
  }

  getRetriggers(data) {
    let view = []
    let temp = []


    if (data[0].trigger_list_arr != 0) {

      view.push(<View style={{ borderWidth: 1, marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 15, borderColor: '#083451', borderRadius: 10 }}></View>
      )
      let current_time = data[0].release_details.data_ts
      temp.push(<View><Text style={{ fontSize: 20, paddingBottom: 5 }}>As of <Text style={{ fontWeight: 'bold' }}>{current_time}</Text></Text></View>)
  
      this.setState({ trigger_length: data[0].trigger_list_arr.length })
      data[0].trigger_list_arr.forEach(element => {
        switch (element.trigger_type) {
          case "rainfall":
            invalid_flag = []
            if (element.invalid == true) {
              this.setState({ trigger_length: this.state.trigger_length - 1 })
              invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%', color: 'red' }}><Text style={{ fontWeight: 'bold' }}>Rainfall Alert (INVALID):</Text> {element.tech_info}</Text>)
            } else {
              invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%' }}><Text style={{ fontWeight: 'bold' }}>Rainfall Alert:</Text> {element.tech_info}</Text>)
            }
            break;
          case "moms":
            invalid_flag = []
            if (element.invalid == true) {
              this.setState({ trigger_length: this.state.trigger_length - 1 })
              invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%', color: 'red' }}><Text style={{ fontWeight: 'bold' }}>Surficial Alert (INVALID):</Text> {element.tech_info}</Text>)
            } else {
              invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%' }}><Text style={{ fontWeight: 'bold' }}>Surficial Alert:</Text> {element.tech_info}</Text>)
            }
            break;
          case "earthquake":
            invalid_flag = []
            if (element.invalid == true) {
              this.setState({ trigger_length: this.state.trigger_length - 1 })
              invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%', color: 'red' }}><Text style={{ fontWeight: 'bold' }}>Earthquake Alert (INVALID):</Text> {element.tech_info}</Text>)
            } else {
              invalid_flag.push(<Text style={{ paddingBottom: 20, textAlign: 'center', fontSize: 20, width: '100%' }}><Text style={{ fontWeight: 'bold' }}>Earthquake Alert:</Text> {element.tech_info}</Text>)
            }
            break;
        }
      })
      temp.push(invalid_flag)

    } else {

      if (data[0].release_details.data_ts != this.state.event_start_ts) {
        view.push(<View style={{ borderWidth: 1, marginLeft: 20, marginRight: 20, marginBottom: 20, marginTop: 15, borderColor: '#083451', borderRadius: 10 }}></View>
        )
        let current_time = data[0].release_details.data_ts
        temp.push(<View><Text style={{ fontSize: 20, paddingBottom: 5 }}>As of <Text style={{ fontWeight: 'bold' }}>{current_time}</Text></Text></View>)
    
        temp.push(<View><Text style={{ fontSize: 20, paddingBottom: 5 }}>No new retriggers.</Text></View>)
      }
    }

    view.push(<View style={{ alignItems: 'center', textAlign: 'center' }}>{temp}</View>)
    return view;
  }

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    let date_format = ""
    let date_only_format = ""
    let time_format = ""
    let time_format2 = ""
    let for_file_name = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS");
      date_format = moment(new Date()).format("YYYY-MM-DD");
      date_only_format = moment(new Date()).format("MMMM D, YYYY");
      time_format = moment(new Date()).format("hh:MM a");
      time_format2 = moment(new Date()).format("HH:MM a");
      text_format_timestamp = moment(new Date()).format("LLL");
      for_file_name = moment(new Date()).format("YYYY_MM_DD_HH_MM_SS");
    } else {
      current_timestamp = moment(date).format("YYYY-MM-DD HH:MM:SS");
      date_format = moment(date).format("YYYY-MM-DD");
      date_only_format = moment(date).format("MMMM D, YYYY");
      time_format = moment(date).format("hh:MM a");
      time_format2 = moment(date).format("HH:MM a");
      text_format_timestamp = moment(date).format("LLL");
      for_file_name = moment(date).format("YYYY_MM_DD_HH_MM_SS");
    }

    return {
      current_timestamp: current_timestamp,
      date: date_format,
      time_format: time_format,
      time_format2: time_format2,
      date_only_format: date_only_format,
      text_format_timestamp: text_format_timestamp,
      for_file_name: for_file_name
    }
  }

  render() {
    return (
      <ScrollView style={field_survey_styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Fetching data...'}
          textStyle={spinner_styles.spinnerTextStyle}
        />
        <NavigationEvents onDidFocus={() => this.getCurrentAlert()} />
        <View style={field_survey_styles.menuSection}>
          <View style={field_survey_styles.buttonSection}>
            <TouchableOpacity style={field_survey_styles.activeButton} >
              <Text style={field_survey_styles.buttonActiveText}>Current Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={field_survey_styles.menuButton} onPress={() => this.navigateEwi("alert_validation")}>
              <Text style={field_survey_styles.buttonText}>Alert Validation</Text>
            </TouchableOpacity>
          </View>
          <View>
            {this.state.alert_details}
            {this.state.retrigger_details}
            {this.state.release_button}
          </View>
        </View>
      </ScrollView>
    );
  }
}
