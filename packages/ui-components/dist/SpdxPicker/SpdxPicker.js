"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactBootstrapTypeahead = require("react-bootstrap-typeahead");

var _spdxLicenseIds = _interopRequireDefault(require("spdx-license-ids"));

var _deprecated = _interopRequireDefault(require("spdx-license-ids/deprecated"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var identifiers = [].concat(_toConsumableArray(_utils.customLicenseIds), _toConsumableArray(_spdxLicenseIds.default.sort()), _toConsumableArray(_deprecated.default.sort()));

var SpdxPicker =
/*#__PURE__*/
function (_Component) {
  _inherits(SpdxPicker, _Component);

  function SpdxPicker(props) {
    var _this;

    _classCallCheck(this, SpdxPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpdxPicker).call(this, props));
    _this.onKeyPress = _this.onKeyPress.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SpdxPicker, [{
    key: "onKeyPress",
    value: function onKeyPress(event, onChange) {
      var instance = this._typeahead.getInstance();

      var isMenuOpen = instance.state.showMenu;
      var resultsExist = instance.state.initialItem != null;
      var enterPressed = event.key === 'Enter'; // if user is in mid-selection, don't hijack Enter key
      // i.e. only fire onChange on Enter if menu closed or no results

      if (enterPressed && (!isMenuOpen || !resultsExist)) {
        var target = event.target;
        var value = target.value;
        value && onChange(value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          value = _this$props.value,
          onBlur = _this$props.onBlur,
          _onChange = _this$props.onChange,
          autoFocus = _this$props.autoFocus,
          promptText = _this$props.promptText;
      return _react.default.createElement("div", {
        className: "editable-editor",
        "data-test-id": "spdx-input-picker"
      }, _react.default.createElement(_reactBootstrapTypeahead.Typeahead, {
        defaultInputValue: value,
        options: identifiers,
        onBlur: onBlur,
        onKeyDown: function onKeyDown(e) {
          return _this2.onKeyPress(e, _onChange);
        },
        onChange: function onChange(_ref) {
          var _ref2 = _slicedToArray(_ref, 1),
              first = _ref2[0];

          return _onChange(first);
        },
        ref: function ref(_ref3) {
          return _this2._typeahead = _ref3;
        },
        bodyContainer: true,
        highlightOnlyResult: true,
        autoFocus: autoFocus,
        selectHintOnEnter: true,
        clearButton: true,
        placeholder: promptText
      }));
    }
  }]);

  return SpdxPicker;
}(_react.Component);

exports.default = SpdxPicker;

_defineProperty(SpdxPicker, "propTypes", {
  value: _propTypes.default.string.isRequired,
  onBlur: _propTypes.default.func,
  onChange: _propTypes.default.func,
  promptText: _propTypes.default.string
});