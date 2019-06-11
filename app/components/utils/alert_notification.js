import { AsyncStorage, Alert } from 'react-native';
import Storage from './storage'
import moment from 'moment'

const Notification = {
    endOfValidity: async function () {
        let current_timestamp = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
        let offline_data = Storage.getItem("alertGeneration");
        offline_data.then(response => {
            console.log(response.validity)
            console.log(current_timestamp)
            if (moment(current_timestamp) >= response.validity) {
                let alert_title = ""
                switch(response.alert_level) {
                    case "A2":
                        alert_title = "Alert 2"
                        break;
                    case "A3":
                        alert_title = "Alert 3"
                        break;
                    case "A1":
                        alert_title = "Alert 1"
                        break;   
                } 
                Alert.alert(
                    alert_title,
                    'Current alert is now end of validity',
                    [
                      {text: 'OK', onPress: () => {
                        Storage.removeItem("alertGeneration");
                      }},
                    ]
                  );
            }
        })
    }
};

export default Notification;