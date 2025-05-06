const apiKey = import.meta.env.VITE_API_KEY; 

export function renderMap() {
  if (!apiKey) {
    console.error("API key is missing.");
    return;
  }

  // Initialize the map
  var map = tt.map({
    key: apiKey,
    container: 'map',
    center: [0, 0],
    zoom: 1.5,
    style: `https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBANnRYTjVyT0dqUjJGQVN2cztdYsr6WJtLOLN5hmAnr0hV.json?key=${apiKey}`
  });

  // Add navigation controls to the map
  map.addControl(new tt.NavigationControl());

  let markers = [];

  async function fetchCircuits() {
    try {
      const year = document.getElementById('season-select').value;

      // Remove old markers
      markers.forEach(marker => marker.remove());
      markers = [];

      const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races/`);
      const data = await response.json();
      // Get the races array
      const races = data?.MRData?.RaceTable?.Races || [];
      // Map each race to its circuit data
      const circuits = races.map(race => race.Circuit);

      circuits.forEach((circuit, index) => {
        const race = races[index]; // corresponding race info (e.g., round, date)
        let { Location } = circuit;
        if (Location) {
          let coordinates = [parseFloat(Location.long), parseFloat(Location.lat)];
          let imageFilename = circuitImageMap[circuit.circuitId] || "default.svg"; // Fallback image
          let imagePath = `./images/Tracks_2025/${imageFilename}`;

          var element = document.createElement('div');
          element.id = 'marker';
          var marker = new tt.Marker({ element: element }).setLngLat(coordinates).addTo(map);
          markers.push(marker);

          var popupOffsets = {
            top: [0, 0],
            bottom: [0, -70],
            "bottom-right": [0, -70],
            "bottom-left": [0, -70],
            left: [25, -35],
            right: [-25, -35],
          };

          var popup = new tt.Popup({ offset: popupOffsets }).setHTML(
            `<img src="${imagePath}" width="150" alt="${circuit.circuitName}"><br/>
            <b>${Location.country}</b>
            ${circuit.circuitName}
            <b>Round: ${race.round}</b>
            Date: ${race.date}`
          );

          marker.setPopup(popup);
          marker.getElement().addEventListener('click', () => {
            popup.toggle();
          });
        } else {
          console.warn("Missing location data for:", circuit.circuitName);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const dropdown = document.getElementById('season-select');
  dropdown.addEventListener('change', fetchCircuits);

  // Populate season dropdown
  for (let i = 0; i < 10; i++) {
    const option = document.createElement('option');
    option.value = 2025 - i;
    option.textContent = 2025 - i;
    dropdown.appendChild(option);
  }

  fetchCircuits();
}

export const circuitImageMap = {
  albert_park: "Australia.svg",
  americas: "United States.svg",
  bahrain: "Bahrain.svg",
  baku: "Azerbaijan.svg",
  catalunya: "Spain.svg",
  hungaroring: "Hungary.svg",
  imola: "Emila Romagna.svg",
  interlagos: "Brazil.svg",
  jeddah: "Saudi Arabia.svg",
  losail: "Qatar.svg",
  marina_bay: "Singapore.svg",
  miami: "Miami.svg",
  monaco: "Monaco.svg",
  monza: "Italy.svg",
  red_bull_ring: "Austria.svg",
  rodriguez: "Mexico.svg",
  shanghai: "China.svg",
  silverstone: "Great Britain.svg",
  spa: "Belgium.svg",
  suzuka: "Japan.svg",
  vegas: "Las Vegas.svg",
  villeneuve: "Canada.svg",
  yas_marina: "Abu Dhabi.svg",
  zandvoort: "Netherlands.svg",
};
