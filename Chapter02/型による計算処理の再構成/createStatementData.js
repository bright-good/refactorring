export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalvolumeCredits = totalvolumeCredits(result);
    return result;
}

function enrichPerformance(aPerformance) {
    const calculator = PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function totalAmount(data) {
    return data.performances
        .reduce((total, p) => total + p.amount, 0);
}

function totalvolumeCredits(data) {
    return data.preformance
        .reduce((total, p) => total + p.volumeCredits, 0);
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragendyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unknown type: ${aPlay.type}`);
    }
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        throw new Error(`サブクラスの責務`);
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragendyCalculator extends PerformanceCalculator {
    get amount() {
        result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}