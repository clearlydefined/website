"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _LicensePicker = _interopRequireDefault(require("../LicensePicker"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var license = 'Apache-2.0 AND MIT';
describe('LicensePicker', function () {
  it('renders without crashing', function () {
    (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, null));
  });
  it('given a definition with no license, shows the license picker', function () {
    var nolicense = 'NOASSERTION';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: nolicense
    }));
    expect(wrapper.state('rules')).toEqual({
      license: nolicense
    });
  });
  it('given an existing License, change the rule conjunction OR to left path', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: license
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('or', ['left']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        license: 'MIT'
      }
    });
  });
  it('given an existing License, add a new rule conjunction OR to right path', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: license
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('or', ['right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        left: {
          license: 'Apache-2.0'
        },
        conjunction: 'and',
        right: {
          license: 'MIT'
        }
      },
      conjunction: 'or',
      right: {
        license: ''
      }
    });
  });
  it('given an existing composite License, add a new rule conjunction AND to right-right path', function () {
    var testLicense = 'Apache-2.0 AND MIT AND GPL-1.0-only';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('and', ['right', 'right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'and',
      right: {
        left: {
          license: 'MIT'
        },
        conjunction: 'and',
        right: {
          left: {
            license: 'GPL-1.0-only'
          },
          conjunction: 'and',
          right: {
            license: ''
          }
        }
      }
    });
  });
  it('given an existing composite License, add a new rule conjunction OR to right-left path', function () {
    var testLicense = 'Apache-2.0 AND MIT AND GPL-1.0-only';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('or', ['right', 'left']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'and',
      right: {
        left: {
          license: 'MIT'
        },
        conjunction: 'or',
        right: {
          license: 'GPL-1.0-only'
        }
      }
    });
  });
  it('given an existing License, add a new rule conjunction AND to right path', function () {
    var testLicense = 'Apache-2.0 OR MIT OR GPL-1.0-only';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('and', ['right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          license: 'MIT'
        },
        conjunction: 'and',
        right: {
          license: 'GPL-1.0-only'
        }
      }
    });
  });
  it('given an existing License, add a new rule conjunction AND to left path', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only)';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('and', ['left']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'and',
      right: {
        left: {
          license: 'MIT'
        },
        conjunction: 'or',
        right: {
          license: 'GPL-1.0-only'
        }
      }
    });
  });
  it('given an existing License, change rule conjunction AND to right-left path', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) OR MIT';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('and', ['right', 'left']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          left: {
            license: 'MIT'
          },
          conjunction: 'and',
          right: {
            license: 'GPL-1.0-only'
          }
        },
        conjunction: 'or',
        right: {
          license: 'MIT'
        }
      }
    });
  });
  it('given an existing License, add a mew rule conjunction OR to right-right path', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND MIT';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('or', ['right', 'right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          left: {
            left: {
              license: 'MIT'
            },
            conjunction: 'or',
            right: {
              license: 'GPL-1.0-only'
            }
          },
          conjunction: 'and',
          right: {
            license: 'MIT'
          }
        },
        conjunction: 'or',
        right: {
          license: ''
        }
      }
    });
  });
  it('given an existing License, add a new rule conjunction AND to right-right path', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND (MIT OR GPL-1.0-only)';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('and', ['right', 'right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          left: {
            license: 'MIT'
          },
          conjunction: 'or',
          right: {
            license: 'GPL-1.0-only'
          }
        },
        conjunction: 'and',
        right: {
          left: {
            license: 'MIT'
          },
          conjunction: 'and',
          right: {
            license: 'GPL-1.0-only'
          }
        }
      }
    });
  });
  it('given an existing License, add a new rule conjunction AND to right-left-right path', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only OR MIT-0) AND (MIT OR GPL-1.0-only)';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('and', ['right', 'left', 'right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          left: {
            license: 'MIT'
          },
          conjunction: 'or',
          right: {
            left: {
              license: 'GPL-1.0-only'
            },
            conjunction: 'and',
            right: {
              license: 'MIT-0'
            }
          }
        },
        conjunction: 'and',
        right: {
          left: {
            license: 'MIT'
          },
          conjunction: 'or',
          right: {
            license: 'GPL-1.0-only'
          }
        }
      }
    });
  });
  it('given an existing License, add a new rule conjunction OR to right-left-right path', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND (MIT OR GPL-1.0-only)';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.changeRulesConjunction('or', ['right', 'left', 'right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          left: {
            license: 'MIT'
          },
          conjunction: 'or',
          right: {
            left: {
              license: 'GPL-1.0-only'
            },
            conjunction: 'or',
            right: {
              license: ''
            }
          }
        },
        conjunction: 'and',
        right: {
          left: {
            license: 'MIT'
          },
          conjunction: 'or',
          right: {
            license: 'GPL-1.0-only'
          }
        }
      }
    });
  });
  it('add a new group', function () {
    var testLicense = 'Apache-2.0';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.addNewGroup([]);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'and',
      right: {
        left: {
          license: ''
        },
        conjunction: 'and',
        right: {
          license: ''
        }
      }
    });
  });
  it('add a new nested group', function () {
    var testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only)';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.addNewGroup(['right']);
    expect(wrapper.state('rules')).toEqual({
      left: {
        license: 'Apache-2.0'
      },
      conjunction: 'or',
      right: {
        left: {
          license: 'MIT'
        },
        conjunction: 'or',
        right: {
          left: {
            license: 'GPL-1.0-only'
          },
          conjunction: 'or',
          right: {
            left: {
              license: ''
            },
            conjunction: 'and',
            right: {
              license: ''
            }
          }
        }
      }
    });
  });
  it('set the license with later version', function () {
    var testLicense = 'Apache-2.0';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.considerLaterVersions(true, []);
    expect(wrapper.state('rules')).toEqual({
      license: 'Apache-2.0',
      plus: true
    });
  });
  it('removes a rule', function () {
    var testLicense = 'Apache-2.0 OR MIT';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.removeRule(['right']);
    expect(wrapper.state('rules')).toEqual({
      license: 'Apache-2.0'
    });
  });
  it('change the value of a license', function () {
    var testLicense = 'Apache-2.0';
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_LicensePicker.default, {
      value: testLicense
    }));
    var instance = wrapper.instance();
    instance.updateLicense('MIT', []);
    expect(wrapper.state('rules')).toEqual({
      license: 'MIT'
    });
  });
});