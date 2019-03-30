"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _set = _interopRequireDefault(require("lodash/set"));

var _toPath = _interopRequireDefault(require("lodash/toPath"));

var _reactBootstrap = require("react-bootstrap");

var _RuleBuilder = _interopRequireDefault(require("./RuleBuilder"));

var _utils = _interopRequireDefault(require("./utils"));

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A standalone SPDX License Picker
 * It allows to build a license string based on license expression rules:
 * https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
 */
var LicensePicker =
/*#__PURE__*/
function (_Component) {
  _inherits(LicensePicker, _Component);

  function LicensePicker(props) {
    var _this;

    _classCallCheck(this, LicensePicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LicensePicker).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "updateLicense",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(value, path) {
        var rules, currentPath;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (value) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                rules = _objectSpread({}, _this.state.rules);
                currentPath = [].concat(_toConsumableArray(path), ['license']);
                (0, _set.default)(rules, (0, _toPath.default)(currentPath), value || '');

                _this.setState({
                  rules: rules,
                  sequence: _this.state.sequence + 1
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "changeRulesConjunction",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(value, path) {
        var rules;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                rules = _objectSpread({}, _this.state.rules);
                return _context2.abrupt("return", _this.setState({
                  rules: _utils.default.createRules(value, rules, path),
                  sequence: _this.state.sequence + 1
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "considerLaterVersions",
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(value, path) {
        var rules, currentPath;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                rules = _objectSpread({}, _this.state.rules);
                currentPath = [].concat(_toConsumableArray(path), ['plus']);
                (0, _set.default)(rules, (0, _toPath.default)(currentPath), value || false);

                _this.setState({
                  rules: rules,
                  sequence: _this.state.sequence + 1
                });

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "addNewGroup",
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(path) {
        var rules;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // Add a children rule related to the rule element
                rules = _objectSpread({}, _this.state.rules);
                return _context4.abrupt("return", _this.setState({
                  rules: _utils.default.createGroup(rules, path),
                  sequence: _this.state.sequence + 1
                }));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x7) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "removeRule",
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(rule) {
        var rules;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                rules = _objectSpread({}, _this.state.rules);
                return _context5.abrupt("return", _this.setState({
                  rules: _utils.default.removeRule(rules, rule),
                  sequence: _this.state.sequence + 1
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x8) {
        return _ref5.apply(this, arguments);
      };
    }());

    _this.state = {
      rules: {},
      sequence: 0
    };
    return _this;
  }

  _createClass(LicensePicker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        licenseExpression: this.props.value || '',
        rules: this.props.value ? _utils.default.parseLicense(this.props.value) : {
          license: ''
        },
        isValid: this.props.value ? _utils.default.isValidExpression(this.props.value) : false
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_, prevState) {
      var _this$state = this.state,
          rules = _this$state.rules,
          sequence = _this$state.sequence;

      if (sequence !== prevState.sequence) {
        var licenseExpression = _utils.default.toString(rules);

        this.setState(_objectSpread({}, this.state, {
          licenseExpression: licenseExpression,
          isValid: _utils.default.isValidExpression(licenseExpression)
        }));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          onClose = _this$props.onClose;
      var _this$state2 = this.state,
          rules = _this$state2.rules,
          licenseExpression = _this$state2.licenseExpression,
          isValid = _this$state2.isValid;
      return _react.default.createElement("div", {
        className: "spdx-picker"
      }, _react.default.createElement(_reactBootstrap.Row, null, _react.default.createElement(_reactBootstrap.Col, {
        md: 10,
        className: "spdx-picker-header-title flex-center"
      }, _react.default.createElement("h2", null, "License Expression: "), _react.default.createElement("span", {
        className: "spdx-picker-expression ".concat(isValid ? 'is-valid' : 'is-not-valid')
      }, licenseExpression)), _react.default.createElement(_reactBootstrap.Col, {
        md: 2,
        className: "spdx-picker-header-buttons"
      }, _react.default.createElement(_reactBootstrap.Button, {
        bsStyle: "success",
        "data-test-id": "license-picker-ok-button",
        onClick: function onClick() {
          return onChange(licenseExpression);
        }
      }, "OK"), _react.default.createElement(_reactBootstrap.Button, {
        bsStyle: "danger",
        "data-test-id": "license-picker-cancel-button",
        onClick: onClose
      }, "Cancel"))), _react.default.createElement(_reactBootstrap.Row, null, _react.default.createElement(_reactBootstrap.Col, {
        md: 12
      }, _react.default.createElement(_RuleBuilder.default, {
        rule: rules,
        changeRulesOperator: this.changeRulesConjunction,
        updateLicense: this.updateLicense,
        considerLaterVersions: this.considerLaterVersions,
        addNewGroup: this.addNewGroup,
        removeRule: this.removeRule
      }))));
    }
  }]);

  return LicensePicker;
}(_react.Component);

exports.default = LicensePicker;

_defineProperty(LicensePicker, "propTypes", {
  value: _propTypes.default.string,
  //existing license
  onChange: _propTypes.default.func,
  //callback function called when saving
  onClose: _propTypes.default.func //callback function called when closing the modal

});