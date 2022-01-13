import React, { useState } from "react";
import { styled, useTheme } from '@mui/material/styles';
import LocationSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ModelGroupConfigurator from "../InputComponents/ModelGroupConfigurator/ModelGroupConfigurator";
import OffsetConfigurator from "../InputComponents/OffsetConfigurator/OffsetConfigurator";
import PlotNameField from "../InputComponents/PlotNameField/PlotNameField";
import ReferenceYearSlider from "../InputComponents/ReferenceYearSlider/ReferenceYearSlider";
import RegionSelector from "../InputComponents/RegionSelector/RegionSelector";
import TimeCheckBoxGroup from "../InputComponents/TimeCheckboxGroup/TimeCheckboxGroup";
import XAxisSlider from "../InputComponents/XAxisSlider/xAxisSlider";
import YAxisSlider from "../InputComponents/YAxisSlider/yAxisSlider";
import PropTypes from 'prop-types'; 
import LatitudeBandSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ReferenceModelSelector from "../InputComponents/ReferenceModelSelector/ReferenceModelSelector";
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LBS_Symbol, LS_Symbol, MGC_Symbol, OC_Symbol, PNF_Symbol, RMS_Symbol, RYS_Symbol, RS_Symbol, TCG_Symbol, XAS_Symbol, YAS_Symbol } from "../../../../utils/constants";



// custom Accordion components are 
// inspired by: https://mui.com/components/accordion/#customization 
 
/**
 * custom Accordion component
 */
const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
/**
 * custom Accordion summary component
 */
const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(0deg)',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(-90deg)',
      },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
/**
 * custom AccordionDetails component
 */
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

/**
 * an expandable section containing a list of inputComponents as well as a name
 * @param {Object} props
 * @param {Array of String} props.components -> an array containing a string representation of all components that should be plotted
 * @param {String} props.name -> the name of the section
 * @param {function} props.reportError -> used for error handling
 * @param {boolean} props.isExpanded -> whether this section should be expanded
 * @param {function} props.onCollapse -> function to collapse this section
 * @param {function} props.onExpand -> function to expand this section
 * @returns {JSX.Element} an accordion that once expanded displays the components specified by the config files and the API doc
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
            case LBS_Symbol.description:
                return <LatitudeBandSelector key={key}  />;
            case LS_Symbol.description:
                return <LocationSelector key={key} />
            case MGC_Symbol.description:
                return <ModelGroupConfigurator key={key} />;
            case OC_Symbol.description:
                return <OffsetConfigurator key={key}  />;
            case PNF_Symbol.description:
                return <PlotNameField key={key}  />;
            case RMS_Symbol.description:
                return <ReferenceModelSelector key={key} />;
            case RYS_Symbol.description:
                return <ReferenceYearSlider key={key}  />;
            case RS_Symbol.description:
                return <RegionSelector key={key}  />;
            case TCG_Symbol.description:
                return <TimeCheckBoxGroup key={key}  />;
            case XAS_Symbol.description:
                return <XAxisSlider key={key}  />;
            case YAS_Symbol.description:
                return <YAxisSlider key={key}  />;
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
        <Accordion
            data-testid="section"
            sx={{
                maxWidth: "100vw"       // make sure accordion is not wider than the full screen
            }}
            expanded={props.isExpanded}
            onChange={props.isExpanded ? props.onCollapse : props.onExpand}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{
                (props.name     // check if props.name exists
                    && (typeof props.name === 'string' || props.name instanceof String))  // and whether its a string (https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript)
                    && props.name.toUpperCase()}
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <>
                    {props.components.map((element, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {mapNameToComponent(element, idx)}
                            </React.Fragment>
                        )
                    })}
                </>
            </AccordionDetails>
        </Accordion>);
}

Section.propTypes = {
    name: PropTypes.string.isRequired,
    reportError: PropTypes.func.isRequired,
    components: PropTypes.arrayOf(PropTypes.string).isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func
}

export default Section;