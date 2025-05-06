const API_URL = 'https://api.jolpi.ca/ergast/f1/2025/results/';
let raceDataCache = null;

// fetch and cache API
function getRaceData() {
  if (raceDataCache) {
    return Promise.resolve(raceDataCache);
  }
  return fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      raceDataCache = data;
      return data;
    });
}

const trackDropdown = document.getElementById("track-select");

export function renderDriverComparison() {
  // Two dropdowns for selecting each driver
  const dropdown1 = document.getElementById('driver-select-1');
  const dropdown2 = document.getElementById('driver-select-2');
  // Two containers for driver cards
  const driverContainer1 = document.getElementById('drivers-1');
  const driverContainer2 = document.getElementById('drivers-2');
  // Two containers for additional stats
  const statsContainer1 = document.getElementById('stats-1');
  const statsContainer2 = document.getElementById('stats-2');

  // store driver results from selected race
  let driversData = [];

  // Use cached race data to populate driver
  getRaceData()
    .then(data => {
      const races = data.MRData.RaceTable.Races;
      if (!races || races.length === 0) {
        console.error('No races found in the data');
        return;
      }
     
      const selectedRaceId = trackDropdown.value;
      let race = races.find(r =>
        r.raceName.toLowerCase().replace(/ /g, "-") === selectedRaceId
      );
      if (!race) {
        console.warn("Selected race not found, defaulting to the first race");
        race = races[0];
      }
      const driverResults = race.Results;
      driversData = driverResults;

      // Populate both driver dropdowns with each driver's number and name
      dropdown1.innerHTML = '';
      dropdown2.innerHTML = '';
      driverResults.forEach(result => {
        const option1 = document.createElement('option');
        option1.value = result.number;
        option1.textContent = `${result.Driver.givenName} ${result.Driver.familyName}`;
        dropdown1.appendChild(option1);

        // Clone the option for dropdown2
        const option2 = option1.cloneNode(true);
        dropdown2.appendChild(option2);
      });

      // Set default drivers select
      if (driverResults.length > 0) {
        dropdown1.value = driverResults[0].number;
        renderDriver(driverResults[0].number, driverContainer1, statsContainer1);
      }
      if (driverResults.length > 1) {
        dropdown2.value = driverResults[1].number;
        renderDriver(driverResults[1].number, driverContainer2, statsContainer2);
      }
    })
    .catch(error => console.error('Error fetching driver data:', error));

  //check for driver change
  dropdown1.addEventListener('change', event => {
    renderDriver(event.target.value, driverContainer1, statsContainer1);
  });
  dropdown2.addEventListener('change', event => {
    renderDriver(event.target.value, driverContainer2, statsContainer2);
  });

  //render a driver card and stats into container
  function renderDriver(driverNumber, container, statsContainer) {
    // Find driver result in driversData array
    const driver = driversData.find(d => d.number === driverNumber);
    // Clear previous content
    container.innerHTML = '';
    statsContainer.innerHTML = '';

    if (driver) {
      let lastName = driver.Driver.familyName.toLowerCase();
      let imageFilename = driverImageMap[lastName] || "default.png"; 
      let imagePath = `./src/images/${imageFilename}`; // Ens
      // Build the driver card
      const card = document.createElement('div');
    
      //driver 1 results
      console.log(lastName);
      card.className = 'driver-card';
      card.innerHTML = `
        <div class="driver-card-grid">
          <div class="driver-image">
            <img src="${imagePath}" alt="${driver.Driver.givenName} ${driver.Driver.familyName}">
          </div>
          <div class="driver-details">
            <p><strong>Driver Number:</strong> ${driver.number}</p>
            <p><strong>Name:</strong> ${driver.Driver.givenName} ${driver.Driver.familyName}</p>
            <p><strong>Nationality:</strong> ${driver.Driver.nationality}</p>
            <p><strong>Team:</strong> ${driver.Constructor.name}</p>
            <p><strong>Points:</strong> ${driver.points}</p>
            <p><strong>Position:</strong> ${driver.position}</p>
          </div>
        </div>
      `;
      container.appendChild(card);
      //driver 2 results
      statsContainer.innerHTML = `
        <p><strong>Grid Position:</strong> ${driver.grid}</p>
        <p><strong>Laps:</strong> ${driver.laps}</p>
        <p><strong>Status:</strong> ${driver.status}</p>
        <p><strong>Race Time:</strong> ${driver.Time.time || driver.Time.millis}</p>
        <p><strong>Fastest Lap Time:</strong> ${driver.FastestLap.Time.time}</p>
      `;
    }
  }
}

export function getRaceName() {
  return getRaceData()
    .then(data => {
      const races = data.MRData.RaceTable.Races;
      if (!races || races.length === 0) {
        throw new Error('No races found');
      }
      // Populate the track dropdown with race names
      trackDropdown.innerHTML = '';
      races.forEach(race => {
        const option = document.createElement("option");
        option.value = race.raceName.toLowerCase().replace(/ /g, "-");
        option.textContent = race.raceName;
        trackDropdown.appendChild(option);
      });
      // Return the first race name by default
      return races[0].raceName;
    })
    .catch(error => {
      console.error('Error fetching race name:', error);
      return 'Unknown Track';
    });
}

// Run the initial rendering when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Populate the track dropdown and render drivers for the selected race
  getRaceName().then(() => {
    renderDriverComparison();
  });

  // When the user selects a different race, update the driver comparison
  trackDropdown.addEventListener('change', () => {
    renderDriverComparison();
  });
});

const driverImageMap = {
  "albon": "./drivers_2025/alealb01.png",
  "antonelli": "./drivers_2025/andant01.png",
  "sainz": "./drivers_2025/carsai01.png",
  "leclerc": "./drivers_2025/chalec01.png",
  "ocon": "./drivers_2025/estoco01.png",
  "alonso": "./drivers_2025/feralo01.png",
  "bortoleto": "./drivers_2025/gabbor01.png",
  "russell": "./drivers_2025/georus01.png",
  "hadjar": "./drivers_2025/isahad01.png",
  "doohan": "./drivers_2025/jacdoo01.png",
  "norris": "./drivers_2025/lannor01.png",
  "stroll": "./drivers_2025/lanstr01.png",
  "hamilton": "./drivers_2025/lewham01.png",
  "lawson": "./drivers_2025/lialaw01.png",
  "verstappen": "./drivers_2025/maxver01.png",
  "hülkenberg": "./drivers_2025/nichul01.png",
  "bearman": "./drivers_2025/olibea01.png",
  "piastri": "./drivers_2025/oscpia01.png",
  "gasly": "./drivers_2025/piegas01.png",
  "tsunoda": "./drivers_2025/yuktsu01.png"
};