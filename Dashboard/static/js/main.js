document.addEventListener('DOMContentLoaded', function() {
    // Fetch bar chart data
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
                maintainAspectRatio: false
            }
        });
    });

    // Object to store asthma map data
    let mapData = {};

    fetch('/asthma-map-data')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data);
        // Filter out entries where 'State Abbreviation' is missing
        data.forEach(item => {
            if (item['State Abbreviation']) {  
                mapData[item['State Abbreviation']] = item;
            }
        });
        
        document.querySelectorAll('svg a').forEach(anchor => {
            const titleElement = anchor.querySelector('title');
            let originalTitle = "";
            if (titleElement) {
                originalTitle = titleElement.textContent;
                anchor.addEventListener('mouseenter', () => {
                    titleElement.textContent = ""; // Empty the title on hover
                });
                anchor.addEventListener('mouseleave', () => {
                    titleElement.textContent = originalTitle; // Restore the original title
                });
            }
        });
        
        document.querySelectorAll('svg path').forEach(path => {
            const state = path.getAttribute('data-id');
            const info = mapData[state];
            if (info && info['Adjusted Death Rate']) {
                path.style.fill = getColorByDeathRate(info['Adjusted Death Rate']);
                path.dataset.originalColor = path.style.fill; 
            } else {
                path.style.fill = 'gray'; // Use gray if no data available
                path.dataset.originalColor = 'gray';
            }
            path.addEventListener('mouseenter', function(e) {
                this.style.fill = '#a00'; 
    
                if (info) { 
                    const tooltipText = `<strong>State:</strong> ${info['State']}<br/>
                                 <strong>Recorded Asthma Cases:</strong> ${info['Number With Current Asthma'].toLocaleString()}<br/>
                                 <strong>Percent in Population:</strong> ${info['Percent With Current Asthma']}%<br/>
                                 <strong>Death Rate per Million:</strong> ${info['Adjusted Death Rate']}%`;
                    showTooltip(e, tooltipText);

                } else {
                    showTooltip(e, "Data not available for this state");
                }
            });
    
            path.addEventListener('mouseleave', function() {
                this.style.fill = this.dataset.originalColor; // Reset to the original color stored
                hideTooltip();
            });
        });
    })
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
        return 'gray'; // Gray for unavailable data
    }
    const rate = parseFloat(deathRate);
    // use a series of blue colors, from light to deep
    if (rate < 5) {
        return '#B8CBDF'; 
    } else if (rate >= 5 && rate < 8) {
        return '#D1E6F3'; 
    } else if (rate >= 8 && rate < 10) {
        return '#5C8CF2'; 
    } else if (rate >= 10 && rate < 12) {
        return '#1653D7'; 
    } else if (rate >= 12) {
        return '#0047AB'; 
    } else {
        return 'gray'; // Gray for any other case, including parsing errors
    }
}



