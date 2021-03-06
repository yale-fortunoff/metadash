"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ResponsiveOrdinalFrame = _interopRequireDefault(require("semiotic/lib/ResponsiveOrdinalFrame"));

var _react = _interopRequireDefault(require("react"));

require("./style/main.scss");

var _preprocess = _interopRequireDefault(require("./preprocess"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _default =
/*#__PURE__*/
function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default() {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _getPrototypeOf(_default).apply(this, arguments));
  }

  _createClass(_default, [{
    key: "render",
    value: function render() {
      var data = (0, _preprocess.default)(this.props.data, this.props.maxItems);
      var frameProps = {
        /* --- Data --- */
        // data: [{ user: "Jason", tweets: 40, retweets: 5, favorites: 15 },
        // { user: "Susie", tweets: 5, retweets: 25, favorites: 100 }],
        data: data,

        /* --- Size --- */
        size: [300, 300],
        margin: 70,

        /* --- Layout --- */
        type: {
          type: "bar",
          innerRadius: 50
        },
        projection: "radial",
        dynamicColumnWidth: this.props.valueField,

        /* --- Process --- */
        oAccessor: "label",

        /* --- Customize --- */
        style: {
          fill: "#ac58e5",
          stroke: "white"
        },
        title: this.props.title,

        /* --- Annotate --- */
        oLabel: false,
        hoverAnnotation: true
      };
      return _react.default.createElement("div", {
        className: "Viz"
      }, _react.default.createElement(_ResponsiveOrdinalFrame.default, frameProps));
    }
  }]);

  return _default;
}(_react.default.Component);

exports.default = _default;

//# sourceMappingURL=DonutChart.js.map