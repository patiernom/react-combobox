import React from "react";
import PropTypes from "prop-types";
import * as R from "ramda";
import classNames from "classnames";
import "./styles/form.css";
import "./styles/combobox.css";

const isClient = typeof window !== "undefined";

class Combobox extends React.Component {
  constructor (props) {
    super(props);
    this.displayName = "Combobox";
    this.state = {
      cursor: -1,
      showHelper: false,
      value: this.getLabel(this.props.inputValue, this.props.options),
      hiddenValue: this.props.inputValue,
      options: this.props.options
    };
  }

  componentDidMount () {
  }

  componentWillReceiveProps (nextProps) {
    const options = nextProps.ajaxOption ? this.state.options : nextProps.options;
    const actualOptions = options || [];

    this.setState({
      value: this.getLabel(nextProps.inputValue, actualOptions),
      hiddenValue: this.props.inputValue,
      options: actualOptions
    });
  };

  onKeyDown = (evt) => {
    const {cursor, options} = this.state;

    if (evt.keyCode === 27) { // Do whatever when esc is pressed
      this.clearHelper();
    } else if (evt.keyCode === 13) {
      this.onEnter(evt, cursor);
      this.clearHelper();
    } else if (evt.keyCode === 38 && cursor > 0) { // arrow up/down button should select next/previous list element
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }));
    } else if (evt.keyCode === 40 && cursor < options.length - 1) {
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }));
    }
  };

  onFocus = () => {
    if (this.props.alwaysOpen) {
      this.setState({
        showHelper: true
      });
    }
  };

  onOutsideClick = (evt) => {
    if (this.node.contains(evt.target)) {
      return null;
    }

    return this.clearHelper();
  };

  onChange = (evt) => {
    evt.persist();

    this.setState({
      value: evt.target.value
    });
  };

  onMouseOver = (evt) => {
    evt.persist();

    let index = -1;
    if (this.props.keyValueInput) {
      index = R.findIndex(R.propEq("label", evt.target.innerText))(this.state.options);
    } else {
      index = this.state.options.indexOf(evt.target.innerText);
    }

    this.setState({
      cursor: index
    });
  };

  onEnter = (evt, index) => {
    const selection = this.getSelection(index);
    const value = selection.value || selection;
    const label = selection.label || selection;

    this.setState({
      value: label,
      hiddenValue: value,
      showHelper: false
    });

    const event = evt;
    const {onChange} = this.props;

    if (onChange) {
      event.target = {value};
      onChange(event);
    }
  };

  onClick = (evt) => {
    evt.persist();

    const input = evt.target.innerText;
    const value = this.getValue(input);
    const label = this.getLabel(value, this.state.options);

    this.setState({
      value: label,
      hiddenValue: value,
      showHelper: false
    });

    const event = evt;
    const {onChange} = this.props;

    if (onChange) {
      event.target = {value};
      onChange(event);
    }
  };

  onKeyPress = (evt) => {
    evt.persist();

    const {options} = this.props;
    const query = evt.target.value;
    const isSearchable = (query.length > 0 || this.props.alwaysOpen);

    if (this.props.ajaxOption && query.length > 0) {
      return this.props.ajaxRequest(query, this.filterOptions(query, isSearchable));
    }

    return this.filterOptions(query, isSearchable)(options);
  };

  getSelection = (index) => {
    let response = this.state.options[index];

    if (!response) {
      response = this.props.keyValueInput ? {} : "";
    }

    return response;
  };

  getLabel = (value, options) => {
    if (this.props.keyValueInput && value && value !== "") {
      const selection = R.find(R.propEq("value", value), options) || {};

      return selection.label;
    }

    return value;
  };

  getValue = (label) => {
    if (this.props.keyValueInput) {
      const selection = R.find(R.propEq("label", label), this.state.options) || {};

      return selection.value;
    }

    return label;
  };

  filterOptions = (query, isSearchable) => (options) => {
    const filterOption = [];
    filterOption.true = this.objectOption;
    filterOption.false = this.strOption;

    const newOptions = options.filter(filterOption[this.props.keyValueInput](query, isSearchable));

    this.setState({
      showHelper: isSearchable,
      options: newOptions
    });
  };

  clearHelper = () => {
    this.setState({
      cursor: -1,
      showHelper: false
    });
    this.combobox.blur();
  };

  strOption = (query, isSearchable) => (option) => option.toLowerCase().startsWith(query) && isSearchable;
  objectOption = (query, isSearchable) => (option) => option.label.toLowerCase().startsWith(query) && isSearchable;

  renderOption = (option, index) => {
    let suggestion = option;

    if (this.props.keyValueInput && typeof suggestion === "object") {
      suggestion = option.label;
    }

    const currentClass = classNames(
      {"list-group-item": true},
      {"active": this.state.cursor === index}
    );

    return <a key={`suggestion-${index}`} className={currentClass} onMouseOver={this.onMouseOver} onClick={this.onClick}>{suggestion}</a>;
  };

  renderHelper = () => {
    if (this.state.options.length > 0 && this.state.showHelper) {
      if (isClient) {
        document.addEventListener("click", this.onOutsideClick, false);
      }

      return <div className={"list-group"}>{this.state.options.map(this.renderOption)}</div>;
    }

    if (isClient) {
      document.removeEventListener("click", this.onOutsideClick, false);
    }

    return null;
  };

  render () {
    return (
      <div id={this.props.id} className={"combo-box"} ref={node => { this.node = node }}>
        <input
          type={"hidden"}
          ref={(c) => { this.selection = c }}
          value={this.state.hiddenValue}
        />
        <input
          type={"text"}
          ref={(c) => { this.combobox = c }}
          onChange={this.onChange}
          onFocus={this.onFocus}
          className={this.props.inputClassName}
          onKeyUp={this.onKeyPress}
          onKeyDown={this.onKeyDown}
          placeholder={this.props.placeholder}
          value={this.state.value}
        />
        <div className={"result"}>
          <div>
            {this.renderHelper()}
          </div>
        </div>
      </div>
    );
  }
}

const optionObjectSchema = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
});

const optionSchemas = [
  PropTypes.string,
  PropTypes.arrayOf(optionObjectSchema)
];

Combobox.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType(optionSchemas),
  placeholder: PropTypes.string,
  inputValue: PropTypes.any,
  inputClassName: PropTypes.string,
  id: PropTypes.any,
  keyValueInput: PropTypes.bool,
  ajaxOption: PropTypes.bool,
  alwaysOpen: PropTypes.bool,
  ajaxRequest: PropTypes.func
};

Combobox.defaultProps = {
  options: "",
  inputValue: "",
  inputClassName: "form-control",
  id: "",
  placeholder: "",
  keyValueInput: true,
  ajaxOption: false,
  alwaysOpen: false,
  ajaxRequest: undefined
};

export default Combobox;
