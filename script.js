const map = L.map('map').setView([37.8, -96], 4);

	// const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	maxZoom: 19,
	// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	// }).addTo(map);

	// control that shows state info on hover
	const info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		let contents = 'TikTok is Not Banned in the Ocean';
		if (props != null) {
			if (props.tiktok_banned == "banned") {
				contents = `<b>${props.name}</b><br />TikTok is Banned in ` + props.name;
			}
			else if (props.tiktok_banned == "government_devices") {
				contents = `<b>${props.name}</b><br />TikTok is Banned on Government Devices in ` + props.name;
			}
			else {
				contents = `<b>${props.name}</b><br />TikTok is Not Banned in ` + props.name;
			}
			// contents = `<b>${props.name}</b><br />${props.tiktok_banned} people / mi<sup>2</sup>`;
		}
		// const contents = props ? `<b>${props.name}</b><br />${props.tiktok_banned} people / mi<sup>2</sup>` : 'Hover over a Country';
		this._div.innerHTML = `<h4>Where is TikTok Banned?</h4>${contents}`;
	};

	info.addTo(map);


	// get color depending on the state of tiktok in that country
	function getColor(d) {
		return d == "banned" ? '#FF0000' :
			d == "government_devices" ? '#FFFF00' : '#008000'; // if banned on gov devices, yellow else green
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.tiktok_banned)
		};
	}

	function highlightFeature(e) {
		const layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		layer.bringToFront();

		info.update(layer.feature.properties);
	}

	/* global statesData */
	const geojson = L.geoJson(statesData, {
		style,
		onEachFeature
	}).addTo(map);

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
		highlightFeature(e);
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature,
			touchend: zoomToFeature
		});
	}

	// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


	const legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		const div = L.DomUtil.create('div', 'info legend');
		const grades = ["banned", "government_devices", "not_banned"];
		const labels = [];

		labels.push(` <div class="legenditm red">Banned</div>`);
		labels.push(` <div class="legenditm yellow">Banned on Government Devices</div>`);
		labels.push(` <div class="legenditm green">Not Banned</div>`);
		// const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
		// const labels = [];
		// let from, to;

		// for (let i = 0; i < grades.length; i++) {
		// 	from = grades[i];
		// 	to = grades[i + 1];

		// 	labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
		// }

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);