const { PaymentContext, PaymentStrategy, CashPayment, CardPayment, ApplePayment } 
= require('../patterns/PaymentStrategy');

// Payment Stategy Mapping
const PAYMENT_MAP = {
  'Cash': new CashPayment(),
  'Credit Card': new CardPayment(),
  'Apple Pay': new ApplePayment(),
};

class TreatmentEntity {
  // encapsulation
  #id; #petId;
  // constructor
  constructor({
    _id = null,
    petId,
    vet,
    date,
    description,
    treatmentCost,
    medicineCost = 0,
    paymentMethod = null
  }) {
    // validate required fields
    if (!petId || !vet || !date || !description) {
      throw new Error("Treatment: petId, userId, date, description are required");
    }
    if (typeof treatmentCost !== 'number' || treatmentCost < 0)
      throw new Error('treatmentCost must be >= 0');
    if (typeof medicineCost !== 'number' || medicineCost < 0)
      throw new Error('medicineCost must be >= 0');

    // encapsulated state with private fields id, name, owner
    this.#id = _id;
    this.#petId = petId;
    this.vet = vet;
    this.date = new Date(date);
    this.description = description;
    this.treatmentCost = treatmentCost;
    this.medicineCost = medicineCost;
    this.totalCost = 0;
    this.paymentMethod = null;    // Cash | Credit Card | Apple Pay
    this.paymentFee = 0;       // surcharge

    this.paymentContext = new PaymentContext();
    this.setPaymentMethod(paymentMethod || 'Cash');
    this.#recalcTotal();
  }

  // Methods
  // set payment method and recalculate fee
  setPaymentMethod(method) {
    const strategy = PAYMENT_MAP[method];
    if (!strategy) throw new Error(`Unsupported payment method: ${method}`);
    this.paymentMethod = method;
    this.paymentContext.setStrategy(strategy);
  }


  #recalcTotal() {
    this.paymentFee = this.paymentContext.calcFee() || 0;
    this.totalCost += (this.paymentFee + this.treatmentCost + this.medicineCost);
  }

  // mapping
  toObject() {
    return {
      _id: this.#id,
      petId: this.#petId,
      vet: this.vet,
      date: new Date(this.date),
      description: this.description,
      treatmentCost: this.treatmentCost,
      medicineCost: this.medicineCost,
      totalCost: this.totalCost,
      paymentMethod: this.paymentMethod,
      paymentFee: this.paymentFee
    };
  }
  toJSON() { return this.toObject(); }


}

module.exports = TreatmentEntity;
