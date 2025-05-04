import './main.css'
  
// src/main.js
import { renderMap} from './components/map.js';
import { renderSidebar } from './components/sidebar.js';
import { renderDriverComparison } from './components/driverWithStats.js';


document.addEventListener('DOMContentLoaded', () => {
  renderMap();
  renderSidebar();
  renderDriverComparison();
});