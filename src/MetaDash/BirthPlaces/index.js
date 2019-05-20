import React from 'react';
import "./style/main.scss";
import numeral from "numeral";
import { Cluster } from "../../Viz";
import { objectToArray } from "../Common";
import { normalizeString } from "../../Common";

import SelectionPool from "../../Inputs/SelectionPool";
import Autosuggest from 'react-autosuggest';

export default class extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            searchTerm: "",
            suggestions: [],
            hoverText: " "
        }

        this.cleanClusterData = this.cleanClusterData.bind(this);

        this.dropSelection = this.dropSelection.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);

        this.getSuggestions = this.getSuggestions.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);

    }

    // the data needs to be reformatted a little bit 
    // in order to work with a cluster pack layout.
    // we want to create a hierarchy of countries and cities
    cleanClusterData() {
        if (this.state.cleanClusterData) { return this.state.cleanClusterData }
        let addedCountries = []
        let clusterData = objectToArray(this.props.birthPlaces)
            .filter(
                place => place.label.split("|").filter(x => x.length > 0).length == 2
            );

        // add an item for each country
        clusterData.forEach(element => {
            const country = element.label.split("|")[1];
            if (addedCountries.indexOf(country) >= 0) { return }
            addedCountries.push(country);
            const label = `${country}|root`,
                newItem = { label, id: label };
            clusterData.push(newItem)
        });

        clusterData.push({ label: "root|", id: "root|" })

        this.setState({ cleanClusterData: clusterData });

        return clusterData;

    }

    getSuggestionValue(suggestion) {
        return suggestion.label
    }

    getSuggestions = value => {
        const all = this.cleanClusterData();
        console.log("birthPlaces getsuggestions", all)
        return all.filter(x => normalizeString(x.label).indexOf(normalizeString(value)) >= 0)
        // return [{label: value + " and a hot plate!"}]
    }

    onChange(event, { newValue }) {
        console.log("birthplaces changed", newValue)
        this.setState({
            searchTerm: newValue
        });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        console.log("birthplaces fetched", value)
        this.setState({
            suggestions: this.getSuggestions(value)
        });

    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    renderSuggestion(suggestion) {
        return (
            <div className="suggestion">
                {suggestion.label.split("|")[0].split(",").join(", ")}
            </div>
        )
    }

    onSuggestionSelected(e, { suggestion }) {
        this.props.updateSelections([suggestion])
    }

    dropSelection() {
        this.props.updateSelections([])
    }

    onMouseOver(e) {
        this.setState({ hoverText: e.label.split("|")[0].split(",")[0] + " " + e.country })
    }

    onMouseOut() {
        this.setState({ hoverText: " " })

    }

    render() {

        const inputProps = {
            placeholder: 'Type a place name',
            value: this.state.searchTerm,
            onChange: this.onChange
        };

        const hoverText = "";

        return (
            <div className="BirthPlaces module-box">
                <h3 className="title">Birth places</h3>

                <SelectionPool
                    callback={this.dropSelection}
                    items={this.props.selections}
                ></SelectionPool>

                <div className="hover-text">
                    {this.state.hoverText}
                </div>

                <Cluster
                    items={this.cleanClusterData()}
                    itemDict={this.props.birthPlaces}
                    onMouseOver={this.onMouseOver}
                    onMouseOut={this.onMouseOut}
                ></Cluster>

                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                ></Autosuggest>
            </div>
        );
    }
}