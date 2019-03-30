"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactBootstrap = require("react-bootstrap");

var _SpdxPicker = _interopRequireDefault(require("../SpdxPicker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RuleBuilder =
/*#__PURE__*/
function (_Component) {
  _inherits(RuleBuilder, _Component);

  function RuleBuilder() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, RuleBuilder);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RuleBuilder)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "renderHeaderRow", function (rule, path, conjunction) {
      var showAddRule = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var _this$props = _this.props,
          changeRulesOperator = _this$props.changeRulesOperator,
          addNewGroup = _this$props.addNewGroup;
      return _react.default.createElement(_reactBootstrap.Col, {
        md: 12,
        className: "header-row"
      }, _react.default.createElement(_reactBootstrap.ToggleButtonGroup, {
        type: "radio",
        name: "conjunction",
        defaultValue: conjunction,
        onChange: function onChange(value) {
          return changeRulesOperator(value, path);
        }
      }, showAddRule && (!rule.left || !rule.right) ? _react.default.createElement(_reactBootstrap.Button, {
        id: "changeRulesOperator",
        onClick: function onClick() {
          return changeRulesOperator('AND', path);
        }
      }, "Add Rule") : null, _react.default.createElement(_reactBootstrap.ToggleButton, {
        value: 'AND',
        disabled: rule.license === ''
      }, "AND"), _react.default.createElement(_reactBootstrap.ToggleButton, {
        value: 'OR',
        disabled: rule.license === ''
      }, "OR")), _react.default.createElement("div", null, _react.default.createElement(_reactBootstrap.Button, {
        id: "changeRulesOperator",
        onClick: function onClick() {
          return changeRulesOperator('AND', path);
        }
      }, "Add Rule"), _react.default.createElement(_reactBootstrap.Button, {
        id: "addNewGroup",
        onClick: function onClick() {
          return addNewGroup(path);
        }
      }, "Add Group")));
    });

    _defineProperty(_assertThisInitialized(_this), "renderRule", function (rule, path) {
      var conjunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var parentRule = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var _this$props2 = _this.props,
          updateLicense = _this$props2.updateLicense,
          considerLaterVersions = _this$props2.considerLaterVersions,
          removeRule = _this$props2.removeRule;
      var currentPath = path[path.length - 1];
      if (rule.license || rule.license === '') return _react.default.createElement(_reactBootstrap.Col, {
        md: 12,
        className: "spdx-picker-rule"
      }, currentPath !== 'right' && !parentRule.hasOwnProperty('left') && !parentRule.hasOwnProperty('right') ? _this.renderHeaderRow(rule, path, conjunction) : null, _react.default.createElement(_reactBootstrap.Col, {
        md: 6,
        className: "flex-center"
      }, _react.default.createElement(_SpdxPicker.default, {
        value: rule.license,
        onChange: function onChange(value) {
          return updateLicense(value, path);
        }
      }), rule.license && _react.default.createElement("div", null, _react.default.createElement("input", {
        type: "checkbox",
        onChange: function onChange(event) {
          return considerLaterVersions(event.target.checked, path);
        },
        value: "+"
      }), "Any later version"), path.length > 0 && _react.default.createElement(_reactBootstrap.Button, {
        id: "removeRule",
        onClick: function onClick() {
          return removeRule(path);
        }
      }, "x")));
      return _react.default.createElement(_reactBootstrap.Col, {
        md: 12,
        className: "spdx-picker-group"
      }, _this.renderHeaderRow(rule, path, rule.conjunction, true), _react.default.createElement("div", null, _this.renderRule(rule.left, [].concat(_toConsumableArray(path), ['left']), rule.left.conjunction ? rule.left.conjunction : rule.conjunction, rule)), _react.default.createElement("div", null, _this.renderRule(rule.right, [].concat(_toConsumableArray(path), ['right']), rule.right.conjunction && rule.right.conjunction, rule)));
    });

    return _this;
  }

  _createClass(RuleBuilder, [{
    key: "render",
    value: function render() {
      var rule = this.props.rule;
      return _react.default.createElement(_reactBootstrap.Row, null, _react.default.createElement(_reactBootstrap.Col, {
        md: 12,
        className: "flex"
      }, Object.keys(rule).length > 0 ? this.renderRule(rule, []) : ''));
    }
  }]);

  return RuleBuilder;
}(_react.Component);

exports.default = RuleBuilder;

_defineProperty(RuleBuilder, "propTypes", {
  rule: _propTypes.default.object,
  //object containing current license rules
  changeRulesOperator: _propTypes.default.func,
  //callback function called when switching a conjunction operator
  updateLicense: _propTypes.default.func,
  //callback function called when changing a specific license value
  considerLaterVersions: _propTypes.default.func,
  //callback function called when applying a plus operator
  addNewGroup: _propTypes.default.func,
  //callback function called when adding a new license group object
  removeRule: _propTypes.default.func //callback function called when removing a single license or a group

});