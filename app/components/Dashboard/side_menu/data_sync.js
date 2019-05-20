import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking} from 'react-native';
import { defaults } from '../../../assets/styles/default_styles';
import { Icon } from 'native-base';
import Storage from '../../utils/storage'
import { sha512 } from 'react-native-sha512';

export default class DataSyncer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_number: '09175392665'
    };
  }

  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
        <Icon name="ios-sync" style={{fontSize: 24, color: tintColor}}></Icon>
    )
  };
  
  syncToServer(storage_key) {
    let data = Storage.getItem(storage_key)
    data.then(response => {
      let raw = JSON.stringify(response)
      sha512(raw).then( hash => {
          let salted = storage_key+":"+hash
          Linking.openURL(`sms:${this.state.server_number}?body=${salted}`);
      })
    })
  }

  compressData() {

  }

  render() {
    return (
      <View style={defaults.container}>
        <View style={{ flex: 1, padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="home" style={{color: '#083451', flex: 1}}onPress={() => this.props.navigation.openDrawer()}/>
            <Text style={{fontSize: 20, flex: 3, fontWeight: 'bold', color: '#083451'}}>Data Synchronization</Text>
          </View>
        </View>
        <View style={{flex: 20}}>
          <ScrollView>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentSummary')}>
                <Text style={defaults.touchableTexts}>Risk Assessment | Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentFamilyRiskProfile')}>
                <Text style={defaults.touchableTexts}>Risk Assessment | Family Risk Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentHazardData')}>
                <Text style={defaults.touchableTexts}>Risk Assessment | Hazard Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('RiskAssessmentRNC')}>
                <Text style={defaults.touchableTexts}>Risk Assessment | Resources and Capacities</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('FieldSurveyLogs')}>
                <Text style={defaults.touchableTexts}>Field Survey | Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={defaults.touchableButtons} onPress={() => this.syncToServer('SurficialDataMeasurements')}>
                <Text style={defaults.touchableTexts}>Surficial Data | Measurements</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}