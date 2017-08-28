/* global mapboxgl */
/* global turf */

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lYWhhbmQiLCJhIjoiaDd1MEJZQSJ9.fl3WTCt8MGNOSCGR_qqz7A' // CHANGE TO YOUR ACCESS Token =)

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
  center: [-122.6782433, 45.5252814], // starting position [lng, lat]
  zoom: 12 // starting zoom
})

map.on('load', function () {
  map.addLayer({
    id: 'markets',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: 'data.geojson'
    },
    layout: {
      'icon-image': 'circle-15',
      'icon-allow-overlap': true
    }
  })

  map.addSource('nearest-market', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: false
  })
  geolocate.on('geolocate', function (pos) {
    console.log('geolocate', pos)
    var point = turf.point([pos.coords.longitude, pos.coords.latitude])
    getNearbyMarket(point)
  })

  // Add geolocate control to the map.
  map.addControl(geolocate)
})

function getNearbyMarket (point) {
  var markets = map.querySourceFeatures('markets')
  var nearestMarket = turf.nearest(point, turf.featureCollection(markets))

  if (nearestMarket !== null) {
    var distance = turf.distance(nearestMarket, point, 'miles')
    console.log(distance, 'miles')

    map.getSource('nearest-market').setData({
      type: 'FeatureCollection',
      features: [nearestMarket]
    })

    map.addLayer({
      id: 'nearest-market',
      type: 'circle',
      source: 'nearest-market',
      paint: {
        'circle-radius': 12,
        'circle-color': '#486DE0'
      }
    }, 'markets')
  }
}
