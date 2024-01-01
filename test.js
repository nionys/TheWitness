class Asd {
  static #b = [];
  constructor(a) {
    this.a = a;
  }
  set setB(asd) {
    this.constructor.#b = asd;
  }
  get getB() {
    return this.constructor.#b;
  }
}
const a = new Asd();
const b = new Asd();
a.getB.push(1);
console.log(b);
