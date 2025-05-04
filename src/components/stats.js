import { getDriver } from './driver.js';

getDriver(1).then(driver => {
  // Log driver name in lowercase
  console.log(`${driver.first_name}_${driver.last_name}`.toLowerCase());

  const season = 2024;
  // Convert driverId to lowercase
  let driverId = `${driver.first_name}_${driver.last_name}`.toLowerCase();
  console.log(driverId);

  let url = `https://ergast.com/api/f1/${season}/drivers/${driverId}/driverStandings.json`;

  // fetch data
  async function fetchDriverStats() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // calculate points and wins
      const standingsList = data.MRData.StandingsTable.StandingsLists;
      if (standingsList.length > 0) {
        const driverStandings = standingsList[0].DriverStandings;
        if (driverStandings.length > 0) {
          const verstappenStandings = driverStandings[0];
          const totalWins = verstappenStandings.wins;
          const totalPoints = verstappenStandings.points;
          document.getElementById('wins').textContent = totalWins;
          document.getElementById('points').textContent = totalPoints;

          // if no data available, show ...
        } else {
          document.getElementById('stats').innerHTML = '<p>No driver standings data available.</p>';
        }
      } else {
        document.getElementById('stats').innerHTML = '<p>No standings data available for this season.</p>';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById('stats').innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
  }

  // Directly call fetchDriverStats instead of using window.onload
  fetchDriverStats();
});
