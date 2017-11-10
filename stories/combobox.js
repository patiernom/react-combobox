import React from "react";
import { storiesOf } from "@storybook/react";
// import { action, decorateAction } from "@storybook/addon-actions";
// import { linkTo } from "@storybook/addon-links";
import Combobox from "../components/combobox";
import countriesJSON from "../stub/country.json";

const sortingByLabel = (a, b) => {
  const nameA = a.label.toUpperCase(); // ignore upper and lowercase
  const nameB = b.label.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const getCountries = () => {
  const countries = Object.keys(countriesJSON).map((country) => {
    return {value: country, label: countriesJSON[country]};
  }).sort(sortingByLabel);

  return countries;
};

const getValueSimple = (evt) => {
  console.log(evt.target.value);
  document.getElementById("simpleComboboxValue").innerText = `value result: ${evt.target.value}`;
};

const getValueArray = (evt) => {
  document.getElementById("arrayComboboxValue").innerText = `value result: ${evt.target.value}`;
};

const getValueExample = (evt) => {
  document.getElementById("arrayComboboxValue").innerText = `value result: ${evt.target.value}`;
};

const ajaxRequest = (query, callback) => {
  document.getElementById("exampleComboboxValue").innerText = `search query: ${query}`;


  const response = [
    {value: "result1", label: "result 1"},
    {value: "result2", label: "result 2"},
    {value: "result3", label: "result 3"}
  ];

  callback(response);
};

storiesOf("Combobox", module)
  .add("Simple array of options", () => (
    <form style={{width: "60%"}}>
      <div className={"form-group"}>
        <label htmlFor={"simpleCombobox"}>Programming Languages</label>
        <Combobox
          id={"simpleCombobox"}
          alwaysOpen
          inputClassName={"form-control"}
          onChange={getValueSimple}
          placeholder={"Find some"}
          inputValue={""}
          keyValueInput={false}
          options={["Java", "PHP", "JavaScript", "Python", "Python", "Objective-C", "Ruby", "Perl", "C", "C++", "C#"]}
        />
      </div>
      <div style={{margin: "10px"}}>
        <span id={"simpleComboboxValue"} style={{fontWeight: "bold"}} />
      </div>
    </form>
  ))
  .add("Array of key value Object options", () => (
    <form style={{width: "60%"}}>
      <div className={"form-group"}>
        <label htmlFor={"arrayCombobox"}>Country</label>
        <Combobox
          id={"arrayCombobox"}
          alwaysOpen
          inputClassName={"form-control"}
          onChange={getValueArray}
          placeholder={"Find Country"}
          inputValue={""}
          keyValueInput
          options={getCountries()}
        />
      </div>
      <div style={{margin: "10px"}}>
        <span id={"arrayComboboxValue"} style={{fontWeight: "bold"}} />
      </div>
    </form>
  ))
  .add("AJAX", () => (
    <form style={{width: "60%"}}>
      <div className={"form-group"}>
        <label htmlFor={"exampleCombobox"}>Example</label>
        <Combobox
          id={"exampleCombobox"}
          alwaysOpen
          inputClassName={"form-control"}
          onChange={getValueExample}
          placeholder={"type result"}
          inputValue={""}
          keyValueInput
          ajaxOption
          ajaxRequest={ajaxRequest}
          options={[]}
        />
      </div>
      <div style={{margin: "10px"}}>
        <span id={"exampleComboboxValue"} style={{fontWeight: "bold"}} />
      </div>
    </form>
  ));
