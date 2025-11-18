// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Chart configuration
    const ctx = document.getElementById('trendsChart');
    
    // Declare trendsChart in outer scope so legend handlers can access it
    let trendsChart = null;
    
    if (ctx) {
        // Fake data for 24 hours
        const hoursLabels = Array.from({length: 24}, (_, i) => i);
        
        // Today's data 
        const todayData = [32, 35, 42, 38, 45, 52, 48, 55, 45, 38, 35, 42, 48, 52, 38, 45, 42, 35, 38, 42, 38, 35, 32, 30];
        
        // Yesterday's data 
        const yesterdayData = [28, 32, 38, 35, 42, 48, 45, 52, 42, 35, 32, 38, 45, 48, 35, 42, 38, 32, 35, 38, 35, 32, 28, 26];
        
        // Create chart and assign to outer scope variable
        trendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hoursLabels,
                datasets: [
                    {
                        label: 'Today',
                        data: todayData,
                        borderColor: 'rgba(55, 81, 255, 1)', 
                        backgroundColor: 'rgba(55, 81, 255, 0.08)', 
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4, 
                        pointRadius: 0, 
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: 'rgba(55, 81, 255, 1)',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    },
                    {
                        label: 'Yesterday',
                        data: yesterdayData,
                        borderColor: 'rgba(223, 224, 235, 1)', 
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: 'rgba(223, 224, 235, 1)',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false // Hide legend since we have custom one
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#252733',
                        bodyColor: '#252733',
                        borderColor: '#DFE0EB',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return 'Hour: ' + context[0].label;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9FA2B4',
                            font: {
                                size: 12,
                                family: 'Mulish'
                            },
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 24,
                            stepSize: 1
                        }
                    },
                    y: {
                        position: 'right',
                        beginAtZero: true,
                        max: 60,
                        grid: {
                            color: '#DFE0EB',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9FA2B4',
                            font: {
                                size: 12,
                                family: 'Mulish'
                            },
                            stepSize: 10,
                            callback: function(value) {
                                return value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // LEGEND INTERACTIVITY
    const legendToday = document.querySelector('.legend-today');
    const legendYesterday = document.querySelector('.legend-yesterday');
    
    // Add click handlers to toggle datasets
    if (legendToday && trendsChart) {
        legendToday.style.cursor = 'pointer'; 
        legendToday.addEventListener('click', function() {
            const dataset = trendsChart.data.datasets[0];
            dataset.hidden = !dataset.hidden;
            this.style.opacity = dataset.hidden ? '0.3' : '1';
            trendsChart.update();
        });
    }
    
    if (legendYesterday && trendsChart) {
        legendYesterday.style.cursor = 'pointer'; 
        legendYesterday.addEventListener('click', function() {
            const dataset = trendsChart.data.datasets[1];
            dataset.hidden = !dataset.hidden;
            this.style.opacity = dataset.hidden ? '0.3' : '1';
            trendsChart.update();
        });
    }
});
