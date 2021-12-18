import React, { useState } from "react";
import defaultStructure from '../../../../config/defaultConfig.json';
import LocationSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ModelGroupConfigurator from "../InputComponents/ModelGroupConfigurator/ModelGroupConfigurator";
import OffsetConfigurator from "../InputComponents/OffsetConfigurator/OffsetConfigurator";
import PlotNameField from "../InputComponents/PlotNameField/PlotNameField";
import ReferenceYearSlider from "../InputComponents/ReferenceYearSlider/ReferenceYearSlider";
import RegionSelector from "../InputComponents/RegionSelector/RegionSelector";
import TimeCheckBoxGroup from "../InputComponents/TimeCheckboxGroup/TimeCheckboxGroup";
import XAxisSlider from "../InputComponents/xAxisSlider/xAxisSlider";
import YAxisSlider from "../InputComponents/yAxisSlider/yAxisSlider";

/**
 * an expandable section containing a list of inputComponents as well as a name
 * @param {*} props 
 *  props.components -> an array containing a string representation of all components that should be plotted
 *  props.name -> the name of the section
 *  props.error -> used for error handling
 * @returns an accordeon that once expanded displays the components
 */
export default function Section(props) {
    
    props.components;
    props.name;
    props.error;
    props.expanded;
    props.onCollapseSection;
    props.onExpandSection;

    // maybe better in utils? not so hidden here...
    const mapNameToComponent = (name) => {
        return 0;
    }

    return <>
        {props.components.array.forEach(element => {
            mapNameToComponent(element);
        })}

        {defaultStructure.forEach(c => <>
            {/*Components from defaultStructure*/}
        </>)}

        {/* For purpose of the UML Diagram */}
        <LocationSelector />
        <ModelGroupConfigurator />
        <OffsetConfigurator />
        <PlotNameField />
        <ReferenceYearSlider />
        <TimeCheckBoxGroup />
        <XAxisSlider />
        <YAxisSlider />
        <RegionSelector />
    </>;
}