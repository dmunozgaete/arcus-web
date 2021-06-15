import Job from '../lib/Job';
import ChariotConsole from '../lib/ChariotConsole';

const chariot = ChariotConsole({ label: "gps-job" });
let lastCoordinates: GeolocationPosition;

class GpsTrackerJob extends Job {
  constructor() {
    super({
      runEveryInSeconds: 60,
      waitBeforeFirstRunInSeconds: 5
    });
  }

  getLastObtainedCoordinates(): GeolocationPosition {
    return lastCoordinates;
  }

  /**
   * Obtain the GPS Location, and add via snapshot for async upload
   * @memberof GpsTrackerJob
   */
  async doTheJob() {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition((geo) => {
      //SnapshotClient.takeSnapshot("GPS_LOCATION", lastCoordinates);
      chariot.debug(`coordinates obtained [lat:${geo.coords.latitude},lng:${geo.coords.longitude}]`)
    });
  }
}
export default new GpsTrackerJob();

