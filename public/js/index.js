const socket = io();

console.log("Hello");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

// Using OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">souraavsen1</a>',
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  console.log("Received location:", data);
  map.setView([data?.latitude, data?.longitude], 16);
  if (markers[data.id]) {
    markers[data.id].setLatLng([data.latitude, data.longitude]);
  } else {
    markers[data.id] = L.marker([data.latitude, data.longitude]).addTo(map);
  }
});

socket.on("on-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// socket.on("receive-location", (data) => {
//   console.log("Received location:", data);
//   map.setView([data?.latitude, data?.longitude], 16);

//   console.log({ markers });

//   if (markers[data?.id]) {
//     markers[data?.id].setLatLng([data?.latitude, data?.longitude]);

//     console.log(markers[data?.id]);
//   } else {
//     markers[data?.id] = L.marker([data?.latitude, data?.longitude]).addTo(map);
//   }
// });

// socket.on("on-disconnect", function (id) {
//   if (markers[id]) {
//     map.removeLayer(markers[id]);
//     delete markers[id];
//   }
// });
