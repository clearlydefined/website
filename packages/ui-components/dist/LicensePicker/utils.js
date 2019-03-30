"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spdxExpressionParse = _interopRequireDefault(require("spdx-expression-parse"));

var _isNil = _interopRequireDefault(require("lodash/isNil"));

var _unset = _interopRequireDefault(require("lodash/unset"));

var _get = _interopRequireDefault(require("lodash/get"));

var _set = _interopRequireDefault(require("lodash/set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NOASSERTION = 'NOASSERTION'; // Shared methods appliable to License Picker

var LicensePickerUtils =
/*#__PURE__*/
function () {
  function LicensePickerUtils() {
    _classCallCheck(this, LicensePickerUtils);
  }

  _createClass(LicensePickerUtils, null, [{
    key: "parseLicense",
    value: function parseLicense(license) {
      return license && !['NONE', 'NOASSERTION'].includes(license) ? (0, _spdxExpressionParse.default)(license) : {
        license: license
      };
    }
  }, {
    key: "isValidExpression",
    value: function isValidExpression(expression) {
      try {
        return !!this.parseLicense(expression);
      } catch (e) {
        return false;
      }
    } // Returns a license string based on the rules in input, following the specification of https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60

  }, {
    key: "toString",
    value: function toString(expression) {
      if (!expression) return null;
      if (expression.hasOwnProperty('noassertion')) return NOASSERTION;
      if (expression.license) return "".concat(expression.license).concat(expression.plus ? '+' : '').concat(expression.exception ? " WITH ".concat(expression.exception) : '');
      var left = (0, _get.default)(expression, 'left.conjunction', '').toLowerCase() === 'or' ? "(".concat(this.toString(expression.left), ")") : this.toString(expression.left);
      var right = (0, _get.default)(expression, 'right.conjunction', '').toLowerCase() === 'or' ? "(".concat(this.toString(expression.right), ")") : this.toString(expression.right);
      return left && "".concat(left, " ").concat(!(0, _isNil.default)(right) && expression.conjunction ? "".concat(expression.conjunction.toUpperCase(), " ").concat(right) : '');
    }
    /**
     * Creates a new License expressionect in the specified path
     * @param  {} expression original rules expressionect
     * @param  {} path where to create the new group
     * @returns updated expressionect rules
     */

  }, {
    key: "createGroup",
    value: function createGroup(expression, path) {
      if (path.length > 1 && expression.hasOwnProperty(path[0]) && expression[path[0]].hasOwnProperty(path[1])) {
        expression[path[0]] = this.createGroup(expression[path[0]], path.slice(1));
        return expression;
      }

      if (path.length === 0) return {
        left: expression,
        conjunction: 'and',
        right: this.createGroupObject()
      };
      return _objectSpread({}, expression, _defineProperty({}, path[0], _objectSpread({}, expression[path[0]], {
        right: this.createRuleObject(expression[path[0]].conjunction, expression[path[0]].right, this.createGroupObject())
      })));
    }
    /**
     * Creates a new License Rules in the specified path
     * @param  {} conjunction used conjuction to merge the new rules expressionects
     * @param  {} expression current expressionect rules
     * @param  {} path where apply the change
     * @returns updated expressionect rules
     */

  }, {
    key: "createRules",
    value: function createRules(conjunction, expression, path) {
      if (path.length > 1 && expression.hasOwnProperty(path[0]) && expression[path[0]].hasOwnProperty(path[1])) {
        expression[path[0]] = this.createRules(conjunction, expression[path[0]], path.slice(1));
        return expression;
      }

      if (path.length === 0) return this.createRuleObject(conjunction, expression.left || expression, expression.right);
      var ruleConjunction = expression[path[0]] && expression[path[0]].conjunction ? expression.conjunction : conjunction;
      var left = path[0] === 'left' ? (0, _get.default)(expression, 'left.conjunction') ? this.createRuleObject(conjunction, expression.left.left, expression.left.right) : expression.left : expression.right && expression.right.conjunction ? expression.left : expression.conjunction !== conjunction ? expression : expression.left;
      var right = path[0] === 'left' ? expression.right : (0, _get.default)(expression, 'right.conjunction') ? this.createRuleObject(conjunction, expression.right.left, expression.right.right) : expression.conjunction === conjunction && this.createRuleObject(conjunction, expression.right);
      return this.createRuleObject(ruleConjunction, left, right);
    }
  }, {
    key: "createGroupObject",
    value: function createGroupObject() {
      return {
        left: {
          license: ''
        },
        conjunction: 'and',
        right: {
          license: ''
        }
      };
    }
  }, {
    key: "createRuleObject",
    value: function createRuleObject(conjunction, left, right) {
      return {
        conjunction: conjunction,
        left: left,
        right: right || {
          license: ''
        }
      };
    }
    /**
     * Removes a specific rule from a path
     * @param  {} rules original rules expressionect
     * @param  {} path from where to remove the rule
     * @returns updated expressionect rules
     */

  }, {
    key: "removeRule",
    value: function removeRule(rules, path) {
      var parentPath = path.slice(0, path.length - 1);
      var pathToRemove = path[path.length - 1];
      var currentRule = (0, _get.default)(rules, parentPath, rules);
      if (currentRule[pathToRemove === 'left' ? 'right' : 'left'].license === '') return rules;
      (0, _unset.default)(rules, path);
      var parentRule = (0, _get.default)(rules, parentPath, rules);

      if (!parentRule.hasOwnProperty('right') || !parentRule.hasOwnProperty('left')) {
        var newRule = parentRule.left ? _objectSpread({}, parentRule.left) : _objectSpread({}, parentRule.right);
        if (parentPath.length > 0) (0, _set.default)(rules, parentPath, newRule);else return newRule;
      }

      return rules;
    }
  }]);

  return LicensePickerUtils;
}();

exports.default = LicensePickerUtils;