import React, { useState } from "react";
import defaultStructure from '../../../../config/defaultConfig.json';
import LocationSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ModelGroupConfigurator from "../InputComponents/ModelGroupConfigurator/ModelGroupConfigurator";
import OffsetConfigurator from "../InputComponents/OffsetConfigurator/OffsetConfigurator";
import PlotNameField from "../InputComponents/PlotNameField/PlotNameField";
import ReferenceYearSlider from "../InputComponents/ReferenceYearSlider/ReferenceYearSlider";
import RegionSelector from "../InputComponents/RegionSelector/RegionSelector";
import TimeCheckBoxGroup from "../InputComponents/TimeCheckboxGroup/TimeCheckboxGroup";
import XAxisSlider from "../InputComponents/XAxisSlider/XAxisSlider";
import YAxisSlider from "../InputComponents/YAxisSlider/YAxisSlider";
import PropTypes from 'prop-types'; 
import LatitudeBandSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ReferenceModelSelector from "../InputComponents/ReferenceModelSelector/ReferenceModelSelector";
import { Accordion } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * an expandable section containing a list of inputComponents as well as a name
 * @param {Object} props
 * @param {Array of String} props.components -> an array containing a string representation of all components that should be plotted
 * @param {String} props.name -> the name of the section
 * @param {function} props.reportError -> used for error handling
 * @param {boolean} props.isExpanded -> whether this section should be expanded
 * @param {function} props.onCollapse -> function to collapse this section
 * @param {function} props.onExpand -> function to expand this section
 * @returns {JSX} an accordeon that once expanded displays the components specified by the config files and the API doc
 */
function Section(props) {

    /**
     * maps a given name to a corresponding component from the ./InputComponents folder
     * if there is no component with the given name, calls the props.reportError function
     * @public
     * @param {String} name the name of the component
     * @param {int} key a unique key for the given input component
     * @returns a component from the './InputComponents
     */
    function mapNameToComponent(name, key) {
        switch (name){
            case "ModelGroupConfigurator":
                return <ModelGroupConfigurator key={key} />;
            case "OffsetConfigurator":
                return <OffsetConfigurator key={key}  />;
            case "PlotNameField":
                return <PlotNameField key={key}  />;
            case "ReferenceYearSlider":
                return <ReferenceYearSlider key={key}  />;
            case "TimeCheckBoxGroup":
                return <TimeCheckBoxGroup key={key}  />;
            case "XAxisSlider":
                return <XAxisSlider key={key}  />;
            case "YAxisSlider":
                return <YAxisSlider key={key}  />;
            case "RegionSelector":
                return <RegionSelector key={key}  />;
            case "LatitudeBandSelector":
                return <LatitudeBandSelector key={key}  />;
            case "ReferenceModelSelector":
                return <ReferenceModelSelector key={key} />;
            default:
                if (props.reportError) {
                    props.reportError(`Section ${props.name} found no match for an input component ${name}`);
                }
        } 
    }

    if (!props.components) {
       if(props.reportError) {
           props.reportError(`Section ${props.name} was provided with no components`)
        }
        return <></>;
    }

    return (
    <Accordion data-testid="section">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
            {props.name}
        </AccordionSummary>
        <AccordionDetails>
            <>
                {props.components.map((element, idx) => {
                    return (
                        <>
                            {mapNameToComponent(element, idx)}
                            <br />
                        </>
                    )
                })}
            </>
        </AccordionDetails>
    </Accordion>);
}

Section.propTypes = {
    name: PropTypes.string,
}

export default Section;