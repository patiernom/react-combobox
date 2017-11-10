import React from "react";
import { storiesOf } from "@storybook/react";
import { action, decorateAction } from "@storybook/addon-actions";
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

storiesOf("Combobox", module)
  .add("Simple array of options", () => (
    <form style={{width: "60%"}}>
      <div className={"form-group"}>
        <label htmlFor={"simpleCombobox"}>Programming Languages</label>
        <Combobox
          id={"simpleCombobox"}
          alwaysOpen
          inputClassName={"form-control"}
          onChange={action("change value")}
          placeholder={"Find some"}
          inputValue={""}
          keyValueInput={false}
          options={["Java", "PHP", "JavaScript", "Python", "Python", "Objective-C", "Ruby", "Perl", "C", "C++", "C#"]}
        />
      </div>
    </form>
  ))
  .add("Array of key value Object options ( {value: 'the value', label: 'the label'} )", () => (
    <form style={{width: "60%"}}>
      <div className={"form-group"}>
        <label htmlFor={"simpleCombobox"}>Country</label>
        <Combobox
          id={"simpleCombobox"}
          alwaysOpen
          inputClassName={"form-control"}
          onChange={action("change value")}
          placeholder={"Find"}
          inputValue={""}
          keyValueInput
          options={getCountries()}
        />
      </div>
    </form>
  ));
