// src/components/Sidebar.js
export function renderSidebar() {
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) {
    console.error('Sidebar container not found');
    return;
  }

  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';

  sidebar.innerHTML = `
   
    <nav class="nav-container">
      
        <li id="nav-logo" class="nav-item">
          <img src="images/F1Logo.svg" alt="Logo Icon" class="nav-icon" />
          
        </li>
        
        <hr class="nav-divider">

          <li id="nav-drivers" class="nav-item">
          <img src="images/DriversIcon.svg" alt="Drivers Icon" class="nav-icon" />
          <p class="tooltip">Drivers</p>
        </li>

         <li id="nav-home" class="nav-item">
          <img  src="images/GlobeIcon.svg" alt="Globe Icon" class="nav-icon" />
          <p class="tooltip">Grand prix</p>
        </li>

       
    </nav>
  `;

  sidebarContainer.appendChild(sidebar);

  // navigation events to redirect to a specific page / icon on the sidebar
  const navLogo = sidebar.querySelector('#nav-logo');
  const navDrivers = sidebar.querySelector('#nav-drivers');
  const navHome = sidebar.querySelector('#nav-home');

  navLogo.addEventListener('click', () => {
    // Redirect to the homepage, in this case the maps
    window.location.href = 'driverWithStats.html';
  });

  navHome.addEventListener('click', () => {
    // Redirect to the homepage, in this case the maps
    window.location.href = 'map.html';
  });

  navDrivers.addEventListener('click', () => {
    // Redirect to the driver stats and comparison page
    window.location.href = 'driverWithStats.html';
  });
}
