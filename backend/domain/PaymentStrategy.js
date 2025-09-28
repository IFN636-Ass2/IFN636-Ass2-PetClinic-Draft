class PaymentContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) { this.strategy = strategy; }
    calcFee() { return this.strategy.fee(); }
}

class PaymentStrategy {
    fee() { return 0; }
}

class CashPayment extends PaymentStrategy {
    fee() { return 0; }
}

class CardPayment extends PaymentStrategy {
    fee() { return 0.20; }
}

class ApplePayment extends PaymentStrategy {
    fee() { return 0.10; }
}

module.exports = {
    PaymentContext,
    PaymentStrategy,
    CashPayment,
    CardPayment,
    ApplePayment
};