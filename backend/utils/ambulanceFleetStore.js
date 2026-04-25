const ambulances = require("../data/ambulances");

const baseline = ambulances.map((item) => ({
  id: item.id,
  available: item.available,
  lat: item.lat,
  lng: item.lng
}));

function restoreAmbulanceFleet() {
  baseline.forEach((snapshot) => {
    const current = ambulances.find((item) => item.id === snapshot.id);
    if (!current) {
      return;
    }

    current.available = snapshot.available;
    current.lat = snapshot.lat;
    current.lng = snapshot.lng;
  });
}

module.exports = {
  restoreAmbulanceFleet
};
