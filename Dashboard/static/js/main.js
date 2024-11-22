document.addEventListener('DOMContentLoaded', function() {
    // Initialize map data object
    let mapData = {};

    // Fetch initial bar chart data
    fetch('/asthma-data')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('asthmaChart').getContext('2d');
        const asthmaChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.Year),
                datasets: [{
                    label: 'Number With Current Asthma',
                    data: data.map(item => item['Number With Current Asthma']),
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                aspectRatio: 1.5,
                maintainAspectRatio: true
            }
        });
    });

    fetch('/gender-asthma-data')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('genderAsthmaChart').getContext('2d');
        const genderAsthmaChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.Year),
                datasets: [{
                    label: 'Female',
                    data: data.map(item => item.Female),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Male',
                    data: data.map(item => item.Male),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });

    fetch('/copd-mortality-data')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('copdMortalityChart').getContext('2d');
        const copdMortalityChart = new Chart(ctx, {
            type: 'bar', // Use 'bar' type
            data: {
                labels: data.map(item => item.State),
                datasets: [{
                    label: 'Age-Adjusted Mortality (per 100,000)',
                    data: data.map(item => item['Age-Adjusted Mortality (per 100,000)']),
                    backgroundColor: 'rgba(255, 225, 100, 0.7)',
                    borderColor: 'rgba(255, 225, 100, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Specify 'y' for horizontal bar chart
                scales: {
                    x: { // Adjust for the value scale
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });


    // Event listeners for year selection buttons
    document.querySelectorAll('.year-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const year = this.getAttribute('data-year');
            updateMapForYear(year);
        });
    });

    // Function to update the map based on the selected year
    function updateMapForYear(year) {
        fetch(`/asthma-map-data?year=${year}`)
        .then(response => response.json())
        .then(data => {
            updateMapData(data);
            updateMapVisuals();
        })
        .catch(error => console.error('Error fetching map data:', error));
    }

    // Update map data
    function updateMapData(data) {
        mapData = {};  // Reset map data
        data.forEach(item => {
            if (item['State Abbreviation']) {
                mapData[item['State Abbreviation']] = item;
            }
        });
    }

    // Update the visual representation of the map
    function updateMapVisuals() {
        document.querySelectorAll('svg path').forEach(path => {
            const state = path.getAttribute('data-id');
            const info = mapData[state];
            if (info && info['Adjusted Death Rate']) {
                path.style.fill = getColorByDeathRate(info['Adjusted Death Rate']);
                path.dataset.originalColor = path.style.fill;
            } else {
                path.style.fill = 'gray';
                path.dataset.originalColor = 'gray';
            }

            path.addEventListener('mouseenter', function(e) {
                this.style.fill = '#a00';
                if (info) {
                    const tooltipText = `<strong>State:</strong> ${info['State']}<br/>
                                         <strong>Recorded Asthma Cases:</strong> ${info['Number With Current Asthma'].toLocaleString()}<br/>
                                         <strong>Percent in Population:</strong> ${info['Percent With Current Asthma']}%<br/>
                                         <strong>Death Rate per Million:</strong> ${info['Adjusted Death Rate']}`;
                    showTooltip(e, tooltipText);
                } else {
                    showTooltip(e, "Data not available for this state");
                }
            });

            path.addEventListener('mouseleave', function() {
                this.style.fill = this.dataset.originalColor;
                hideTooltip();
            });
        });
    }

    // Default load for the latest available year
    updateMapForYear('2021');  
});

function showTooltip(e, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = text;
    tooltip.style.display = 'block';
    tooltip.style.left = `${e.pageX}px`;
    tooltip.style.top = `${e.pageY}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

function getColorByDeathRate(deathRate) {
    if (deathRate === 'NA') {
        return 'gray';
    }
    const rate = parseFloat(deathRate);
    if (rate < 5) {
        return '#D1E6F3'; 
    } else if (rate >= 5 && rate < 8) {
        return '#B8CBDF'; 
    } else if (rate >= 8 && rate < 10) {
        return '#5C8CF2'; 
    } else if (rate >= 10 && rate < 12) {
        return '#1653D7'; 
    } else if (rate >= 12) {
        return '#0047AB'; 
    } else {
        return 'gray';
    }
}

function toggleNotes() {
    const notesContent = document.getElementById('notes-content');
    const button = document.querySelector('.notes button');
    if (notesContent.classList.contains('hidden')) {
        notesContent.classList.remove('hidden');
        button.textContent = '-';
    } else {
        notesContent.classList.add('hidden');
        button.textContent = '+';
    }
}

