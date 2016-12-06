module.exports = {
    sum (a, b) {
        return a + b;
    }
  , multiply (a, b) {
        return a * b;
    }
  , square (a) {
        return this.multiply(a, a);
    }
  , subtract (a, b) {
        return a - b;
    }
};
