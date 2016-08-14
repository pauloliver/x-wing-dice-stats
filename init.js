'use strict';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomBoolean() {
    return Math.random() <.5;
}

const ctx = $('#chart');
const numRuns = 10000;

const initRed = getRandomInt(1, 5);
const initGreen = getRandomInt(1, 5);

const initAttackOptions = {
    focus: getRandomBoolean()
};

const initDefenseOptions = {
    focus: getRandomBoolean(),
    evade: getRandomBoolean()
};

$('#num-attacks').val(initRed);
$('#num-defense').val(initGreen);
$('#attack-focus').prop('checked', initAttackOptions.focus);
$('#defense-focus').prop('checked', initDefenseOptions.focus);
$('#defense-evade').prop('checked', initDefenseOptions.evade);

var results = rollDice(initRed, initGreen, initAttackOptions, initDefenseOptions, numRuns);
var labels = R.times(R.identity, initRed + 1).map(String);

var data = {
    labels: labels,
    datasets: [
        {
            borderWidth: 1,
            data: results
        }
    ]
};

var chart = new Chart(ctx, {
    type: 'bar',
    data: data,
    label: 'Stats',
    options: {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Percentage Chance'
                },
                ticks: {
                    min: 0,
                    max: 100
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Number of Landed Hits'
                }
            }]
        },
        legend: {
            display: false
        }
    }
});


window.chart = chart;

function recalculate() {
    const numReds = Number.parseInt(document.getElementById('num-attacks').value, 10) || 0;
    const numGreens = Number.parseInt(document.getElementById('num-defense').value, 10) || 0;

    const attackMods = {
        focus: $('#attack-focus').prop('checked'),
        targetLock: $('#attack-target-lock').prop('checked')
    };

    const defenseMods = {
        focus: $('#defense-focus').prop('checked'),
        evade: $('#defense-evade').prop('checked')
    };

    const newResults = rollDice(numReds, numGreens, attackMods, defenseMods, numRuns);

    var chartData = window.chart.data.datasets[0].data;
    var chartLabels = window.chart.data.labels;

    // need to mess with the data and label arrays manually to get spiffy animations
    // ie, can't just go chartData = newResults :(
    for(var i = 0; i < Math.min(chartData.length, newResults.length); i++) {
        chartData[i] = newResults[i]
    }

    if (chartData.length > newResults.length) {
        chartData.splice(newResults.length);
        chartLabels.splice(newResults.length);
    }

    for (var i = chartData.length; i < newResults.length; i++) {
        chartData.push(newResults[i]);
        chartLabels.push(String(i));
    }

    window.chart.update();
}

var currentTheme = 'empire';
function swapThemes() {
    if (currentTheme === 'empire') {
        $('.empire').toggleClass('rebel');
        $('.empire').toggleClass('empire');
        currentTheme = 'rebel';
    }
    else if (currentTheme === 'rebel') {
        $('.rebel').toggleClass('empire');
        $('.rebel').toggleClass('rebel');
        currentTheme = 'empire';
    }

    $('#flippy-card').toggleClass('flipped');
}

const logoBtn = document.getElementById('logo-link');
logoBtn.addEventListener('click', swapThemes, false);

const calcBtn = document.getElementById('compute-btn');
calcBtn.addEventListener('click', recalculate, false);