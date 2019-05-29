import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { situation_report_styles } from '../../../assets/styles/situation_report_styles'
import Storage from '../../utils/storage'
import { NavigationEvents } from 'react-navigation'
import moment from "moment"

export default class CurrentSituationReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latest_date: '2018/08/08',
      latest_time: '23:30:00',
      summary: 'Sample Summary for Situation Report'
    };
  }

  navigateSituationReport(tab) {
    switch (tab) {
      case "sl":
        this.props.navigation.navigate('situation_logs')
        break;
      default:
        console.log("Same page...")
        break;
    }
  }

  formatDateTime(date = null) {
    let timestamp = date
    let current_timestamp = ""
    let text_format_timestamp = ""
    if (timestamp == null) {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      date = moment(new Date()).format("YYYY/MM/DD")
      time = moment(new Date()).format("h:mm:ss A")
      text_format_timestamp = moment(new Date()).format("MMMM D, YYYY h:mm:ss A")
    } else {
      current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
      date = moment(date).format("YYYY/MM/DD")
      time = moment(date).format("h:mm:ss A")
      text_format_timestamp = moment(date).format("MMMM D, YYYY h:mm:ss A")
    }


    return {
      current_timestamp: current_timestamp,
      date: date,
      time: time,
      text_format_timestamp: text_format_timestamp
    }
  }

  getLatestSituationReport() {
    fetch('http://192.168.150.191:5000/api/situation_report/get_latest_situation_report_data').then((response) => response.json())
      .then((responseJson) => {
        let to_local_data = [];
        for (const [index, value] of responseJson.entries()) {
          let format_date_time = this.formatDateTime(date = value.timestamp);
          this.setState({
            latest_date: format_date_time["date"],
            latest_time: format_date_time["time"],
            summary: value.summary
          });

          to_local_data.push({
            situation_report_id: value.situation_report_id,
            local_storage_id: 1,
            sync_status: 3,
            timestamp: format_date_time["current_timestamp"],
            summary: value.summary,
            pdf_path: value.pdf_path,
            image_path: value.image_path
          });
        }
        Storage.removeItem("SituationReportLatest")
        Storage.setItem("SituationReportLatest", to_local_data)
        let data_container = Storage.getItem("SituationReportLatest")
        data_container.then(response => {
          console.log(response)
        });

      })
      .catch((error) => {
        let data_container = Storage.getItem("SituationReportLatest")
        let latest_report = [];
        data_container.then(response => {
          if (response != null) {
            for (const [index, value] of response.entries()) {
              let format_date_time = this.formatDateTime(date = value.timestamp);
              this.setState({
                latest_date: format_date_time["date"],
                latest_time: format_date_time["time"],
                summary: value.summary
              });
            }
          } else {
            this.setState({
              latest_date: "N/A",
              latest_time: "N/A",
              summary: "No current situation report"
            });
          }

        });
      });
  }

  render() {
    return (
      <ScrollView style={situation_report_styles.container}>
        <NavigationEvents onDidFocus={() => this.getLatestSituationReport()} />
        <View style={situation_report_styles.menuSection}>
          <View style={situation_report_styles.buttonSection}>
            <TouchableOpacity style={situation_report_styles.activeButton}>
              <Text style={situation_report_styles.buttonActiveText}>Current Situation Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={situation_report_styles.menuButton} onPress={() => this.navigateSituationReport("sl")}>
              <Text style={situation_report_styles.buttonText}>Situation Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={situation_report_styles.contentContainer}>
          <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Date: {this.state.latest_date}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Time: {this.state.latest_time}</Text>
          </View>
          <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Summary: {this.state.summary}</Text>
          </View>
          <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontSize: 10, color: 'blue' }}>Full situation report is available in the web app</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
