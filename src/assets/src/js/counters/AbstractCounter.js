class AbstractCounter {
  // Here we turn off no-unused-vars warning because this class is actually abstract.
  // So there's a lot of unused vars and it is normal - we just want to describe the whole interface.
  /* eslint no-unused-vars: 0*/
  constructor(javascriptObjectName, params) {
    this.javascriptObjectName = javascriptObjectName;
  }

  static getCounterObject(javascriptObjectName) {
    return window[javascriptObjectName] || null;
  }

  track(params) {
  }

  sendVariables(variables) {

  }

  get counter() {
    return AbstractCounter.getCounterObject(this.javascriptObjectName);
  }

}

export {AbstractCounter};
