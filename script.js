const map = L.map('map', {
  minZoom: 5,
  maxZoom: 11,
  maxBounds: [
    [5, 65],
    [38, 100]
  ],
  maxBoundsViscosity: 1.0
}).setView([15.9129, 79.74], 7);

L.tileLayer('/tiles/{z}/{x}/{y}.png', {
  minZoom: 5,
  maxZoom: 11,
  attribution: 'Offline Map'
}).addTo(map);

fetch('andhra_pradesh.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2,
        fillOpacity: 0.1
      }
    }).addTo(map);
  });

const normalIcon = L.icon({
  iconUrl: 'views/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
const highlightedIcon = L.icon({
  iconUrl: 'views/marker-icon-red.png',
  iconSize: [35, 55],
  iconAnchor: [17, 55]
});

const markers = [];

fetch('/api/wells')
  .then(res => res.json())
  .then(wells => {
    const wellDetails = document.getElementById('wellDetails');
    const searchInput = document.getElementById('searchInput');
    let selectedWell = null;

    function showWellDetails(well) {
      selectedWell = well;
      document.getElementById('downloadBtn').style.display = 'block';
      const detailsHtml = `
        <h2>${well.NAME}</h2><br>
        <div id="well_details_section">
          <p><strong>UWI:</strong> ${well.UWI}</p>
          <p><strong>Location:</strong> ${well.LOCATION}</p>
          <p><strong>Latitude:</strong> ${well.LAT}</p>
          <p><strong>Longitude:</strong> ${well.LNG}</p>
          <p><strong>Depth:</strong> ${well.TOTAL_DEPTH} meters</p>
          <p><strong>Status:</strong> ${well.STATUS}</p>
          <p><strong>Status Symbol:</strong> ${well.STATUS_SYMBOL}</p>
          <p><strong>Spud Date:</strong> ${well.SPUD_DATE}</p>
          <p><strong>Completion Date:</strong> ${well.COMPLETION_DATE}</p>
          <p><strong>Field:</strong> ${well.FIELD}</p>
          <p><strong>Operator:</strong> ${well.OPERATOR}</p>
          <p><strong>Lease Name:</strong> ${well.LEASE_NAME}</p>
          <p><strong>X Coord:</strong> ${well.X_COORD}</p>
          <p><strong>Y Coord:</strong> ${well.Y_COORD}</p>
          <p><strong>Remark:</strong> ${well.REMARK}</p>
        </div>
      `;
      wellDetails.innerHTML = detailsHtml + document.getElementById('downloadBtn').outerHTML;
      document.getElementById('downloadBtn').addEventListener('click', generatePDF);
    }

    function generatePDF() {
      if (!selectedWell) return;
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(16);
      const title = `${selectedWell.NAME} - Well Details`;
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(title);
      const centerX = (pageWidth - textWidth) / 2;
      doc.text(title, centerX, 15);

      const rows = [
        ['UWI', selectedWell.UWI],
        ['Location', selectedWell.LOCATION],
        ['Latitude', selectedWell.LAT],
        ['Longitude', selectedWell.LNG],
        ['Depth (m)', selectedWell.TOTAL_DEPTH],
        ['Status', selectedWell.STATUS],
        ['Status Symbol', selectedWell.STATUS_SYMBOL],
        ['Spud Date', selectedWell.SPUD_DATE],
        ['Completion Date', selectedWell.COMPLETION_DATE],
        ['Field', selectedWell.FIELD],
        ['Operator', selectedWell.OPERATOR],
        ['Lease Name', selectedWell.LEASE_NAME],
        ['X Coord', selectedWell.X_COORD],
        ['Y Coord', selectedWell.Y_COORD],
        ['Remark', selectedWell.REMARK]
      ];

      doc.autoTable({
        head: [['Field', 'Value']],
        body: rows,
        startY: 25
      });

      doc.save(`${selectedWell.NAME.replace(/\s+/g, '_')}_Details.pdf`);
    }

    function highlightWell(selectedMarker) {
      markers.forEach(marker => marker.setIcon(normalIcon));
      selectedMarker.setIcon(highlightedIcon);
    }

    function renderWellTable(wells) {
      const tbody = document.getElementById('wellsTableBody');
      tbody.innerHTML = '';
      markers.forEach(marker => map.removeLayer(marker));
      markers.length = 0;

      wells.forEach(well => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = well.NAME;
        cell.style.cursor = 'pointer';

        const marker = L.marker([well.LAT, well.LNG], { icon: normalIcon }).addTo(map);
        marker.bindPopup(well.NAME);

        marker.on('click', () => {
          highlightWell(marker);
          showWellDetails(well);
        });

        cell.onclick = () => {
          highlightWell(marker);
          showWellDetails(well);
          map.setView(marker.getLatLng(), 10);
        };

        row.appendChild(cell);
        tbody.appendChild(row);
        markers.push(marker);
      });

      if ($.fn.DataTable.isDataTable('#wellsTable')) {
        $('#wellsTable').DataTable().clear().destroy();
      }

      $('#wellsTable').DataTable({
        paging: false,
        info: false
      });
    }

    renderWellTable(wells);

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = wells.filter(well =>
        well.NAME.toLowerCase().includes(query)
      );
      renderWellTable(filtered);
    });
  })
  .catch(err => {
    console.error('Error fetching wells:', err);
  });

$(document).ready(function () {
  $('#well-table').DataTable({
    searching: true,
    paging: false,
    info: false
  });
});
