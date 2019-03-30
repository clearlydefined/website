"use strict";

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _reactBootstrap = require("react-bootstrap");

var _RuleBuilder = _interopRequireDefault(require("../RuleBuilder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('RuleBuilder', function () {
  it('renders without crashing', function () {
    (0, _enzyme.shallow)(_react.default.createElement(_RuleBuilder.default, {
      rule: {}
    }));
  });
  it('checks if ToggleButtonGroup exists',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var changeRulesOperator, wrapper, wrapperToggleButtonGroup;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            changeRulesOperator = jest.fn();
            wrapper = (0, _enzyme.shallow)(_react.default.createElement(_RuleBuilder.default, {
              rule: {
                license: 'MIT'
              },
              changeRulesOperator: changeRulesOperator
            }));
            wrapperToggleButtonGroup = wrapper.find(_reactBootstrap.ToggleButtonGroup);
            expect(wrapper.find(_reactBootstrap.ToggleButtonGroup).exists()).toBeTruthy();
            expect(wrapperToggleButtonGroup.find(_reactBootstrap.ToggleButton).exists()).toBeTruthy();
            expect(wrapper.find(_reactBootstrap.Button).exists()).toBeTruthy();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('checks if changeRulesOperator callback is called',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var changeRulesOperator, wrapper, wrapperToggleButtonGroup;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            changeRulesOperator = jest.fn();
            wrapper = (0, _enzyme.shallow)(_react.default.createElement(_RuleBuilder.default, {
              rule: {
                license: 'MIT'
              },
              changeRulesOperator: changeRulesOperator
            }));
            wrapperToggleButtonGroup = wrapper.find(_reactBootstrap.ToggleButtonGroup);
            wrapperToggleButtonGroup.simulate('change');
            expect(changeRulesOperator).toHaveBeenCalled();

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('checks if changeRulesOperator callback is called',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var changeRulesOperator, wrapper, wrapperToggleButtonGroup;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            changeRulesOperator = jest.fn();
            wrapper = (0, _enzyme.shallow)(_react.default.createElement(_RuleBuilder.default, {
              rule: {
                conjunction: 'OR',
                left: {
                  license: 'MIT'
                },
                right: {
                  license: 'Apache-2.0'
                }
              },
              changeRulesOperator: changeRulesOperator
            }));
            wrapperToggleButtonGroup = wrapper.find(_reactBootstrap.ToggleButtonGroup);
            wrapperToggleButtonGroup.simulate('change');
            expect(changeRulesOperator).toHaveBeenCalled();

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  it('checks if addNewGroup callback is called',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var addNewGroup, wrapper, addNewGroupButton;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            addNewGroup = jest.fn();
            wrapper = (0, _enzyme.shallow)(_react.default.createElement(_RuleBuilder.default, {
              rule: {
                conjunction: 'OR',
                left: {
                  license: 'MIT'
                },
                right: {
                  license: 'Apache-2.0'
                }
              },
              addNewGroup: addNewGroup
            }));
            addNewGroupButton = wrapper.find('#addNewGroup');
            addNewGroupButton.simulate('click');
            expect(addNewGroup).toHaveBeenCalled();

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  it('checks if removeRule callback is called',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var removeRule, wrapper, removeRuleButton;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            removeRule = jest.fn();
            wrapper = (0, _enzyme.shallow)(_react.default.createElement(_RuleBuilder.default, {
              rule: {
                conjunction: 'OR',
                left: {
                  license: 'MIT'
                },
                right: {
                  conjunction: 'OR',
                  left: {
                    license: 'MIT'
                  },
                  right: {
                    license: 'Apache-2.0'
                  }
                }
              },
              removeRule: removeRule
            }));
            removeRuleButton = wrapper.find('#removeRule');
            removeRuleButton.last().simulate('click');
            expect(removeRule).toHaveBeenCalled();

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
});