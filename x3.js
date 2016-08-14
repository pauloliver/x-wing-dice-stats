'use strict';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function roll(die) {
    const rollResult = getRandomInt(0, 8);
    return die[rollResult];
}

const redDie = ['BLANK', 'BLANK', 'HIT', 'HIT', 'HIT', 'CRIT', 'FOCUS', 'FOCUS'];
const greenDie = ['BLANK', 'BLANK', 'BLANK', 'EVADE', 'EVADE', 'EVADE', 'FOCUS', 'FOCUS'];

function rollRed() {
    return roll(redDie);
}

function rollGreen() {
    return roll(greenDie);
}

function BlankResult() {
    this.totalHits = 0;
    this.hits = 0;
    this.crits = 0;
    this.attackFocuses = 0;
    this.attackBlanks = 0;

    this.evades = 0;
    this.defendFocuses = 0;
    this.defendBlanks = 0;
}

BlankResult.prototype.addAttackResult = function(result) {
    switch (result) {
        case 'BLANK':
            this.attackBlanks++;
            break;
        case 'HIT':
            this.hits++;
            this.totalHits++;
            break;
        case 'CRIT':
            this.crits++;
            this.totalHits++;
            break;
        case 'FOCUS':
            this.attackFocuses++;
            break;
        default:
            throw new Error('Unsupported dice result');
    }
};

BlankResult.prototype.addDefenseResult = function(result) {
    switch (result) {
        case 'BLANK':
            this.defendBlanks++;
            break;
        case 'EVADE':
            this.evades++;
            break;
        case 'FOCUS':
            this.defendFocuses++;
            break;
        default:
            throw new Error('Unsupported dice result');
    }
};

BlankResult.prototype.applyAttackMods = function(mods) {
    if (mods.focus) {
        this.hits += this.attackFocuses;
        this.totalHits += this.attackFocuses;
        this.attackFocuses = 0;
    }

    if (mods.targetLock) {
        const availableRerolls = this.attackBlanks + this.attackFocuses;
        this.attackBlanks = 0;
        this.attackFocuses = 0;

        for (var i = 0; i < availableRerolls; i++) {
            this.addAttackResult(rollRed());
        }

    }
};

BlankResult.prototype.applyDefenseMods = function(mods) {
    if (mods.focus) {
        this.evades += this.defendFocuses;
    }

    if (mods.evade) {
        this.evades++;
    }
};

function createBlankHits(numRedDice) {
    return new Array(numRedDice + 1).fill(0);
}

function rollDice(numRedDice, numGreenDice, redDiceModifiers, greenDiceModifiers, numRolls) {
    var hitCounts = createBlankHits(numRedDice);

    for (var i = 0; i < numRolls; i++) {
        var rollResult = new BlankResult();
        for (var j=0; j < numRedDice; j++) {
            rollResult.addAttackResult(rollRed());
        }

        rollResult.applyAttackMods(redDiceModifiers);

        for (var k=0; k < numGreenDice; k++) {
            rollResult.addDefenseResult(rollGreen());
        }

        rollResult.applyDefenseMods(greenDiceModifiers);

        var numHits = rollResult.totalHits - rollResult.evades;

        numHits = Math.max(numHits, 0);

        hitCounts[numHits]++;
    }

    return R.map(function(hitCount) {return (hitCount / numRolls) * 100}, hitCounts)
}