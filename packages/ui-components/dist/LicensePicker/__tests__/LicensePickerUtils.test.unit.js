"use strict";

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testRules = {
  left: {
    license: 'Apache-2.0'
  },
  conjunction: 'or',
  right: {
    license: 'MIT'
  }
};
describe('LicensePickerUtils', function () {
  it('renders without crashing', function () {
    var licenseString = _utils.default.parseLicense('Apache-2.0 OR MIT');

    expect(licenseString).toEqual(testRules);
  });
  it('parse a definition with no license', function () {
    var licenseString = _utils.default.parseLicense('NOASSERTION');

    expect(licenseString).toEqual({
      license: 'NOASSERTION'
    });
  });
  it('determines if spdx expression is valid', function () {
    var data = {
      MIT: true,
      'MIT-0': true,
      'MIT AND Apache-2.0': true,
      'MIT OR Apache-2.0': true,
      junk: false,
      'MIT AND ADSL AND (AFL-3.0 OR AGPL-1.0-only)': true,
      null: false,
      NONE: true,
      NOASSERTION: true
    };

    var _arr = Object.keys(data);

    for (var _i = 0; _i < _arr.length; _i++) {
      var input = _arr[_i];
      expect(_utils.default.isValidExpression(input)).toEqual(data[input]);
    }
  });
});