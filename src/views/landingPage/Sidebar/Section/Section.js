import React from "react";
import { styled } from '@mui/material/styles';
import LocationSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ModelGroupConfigurator from "../InputComponents/ModelGroupConfigurator/ModelGroupConfigurator";
import PlotNameField from "../InputComponents/PlotNameField/PlotNameField";
import ReferenceYearField from "../InputComponents/ReferenceYearField/ReferenceYearField";
import RegionSelector from "../InputComponents/RegionSelector/RegionSelector";
import TimeCheckBoxGroup from "../InputComponents/TimeCheckboxGroup/TimeCheckboxGroup";
import XAxisField from "../InputComponents/XAxisField/XAxisField";
import YAxisField from "../InputComponents/YAxisField/YAxisField";
import PropTypes from 'prop-types'; 
import LatitudeBandSelector from "../InputComponents/LatitudeBandSelector/LatitudeBandSelector";
import ReferenceModelSelector from "../InputComponents/ReferenceModelSelector/ReferenceModelSelector";
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    LBS_Symbol,
    LS_Symbol,
    MGC_Symbol,
    PNF_Symbol,
    RMS_Symbol,
    RS_Symbol,
    RYF_Symbol,
    TCG_Symbol,
    XAF_Symbol,
    YAF_Symbol,
    CLS_Symbol
} from "../../../../utils/constants";
import CustomLatitudeSelector from "../InputComponents/LatitudeBandSelector/CustomLatitudeSelector/CustomLatitudeSelector";



// custom Accordion components are 
// inspired by: https://mui.com/components/accordion/#customization 
 
/**
 * custom Accordion component
 * @const {function}
 * @returns {JSX.Element}
 * @memberof Section
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
 * @const {function}
 * @returns {JSX.Element}
 * @memberof Section
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
 * @const {function}
 * @returns {JSX.Element}
 * @memberof Section
 */
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

/**
 * an expandable section containing a list of inputComponents as well as a name
 * @component
 * @param {Object} props specified further by PropTypes
 * @returns {JSX.Element} an accordion that once expanded displays the components specified by the config files and the API doc
 */
function Section(props) {

    /**
     * maps a given name to a corresponding component from the ./InputComponents folder
     * if there is no component with the given name, calls the props.reportError function
     * @public
     * @todo move to utils
     * @param {String} name the name of the component
     * @param {int} key a unique key for the given input component
     * @returns {JSX.Element} a component from the './InputComponents
     */
    function mapNameToComponent(name, key) {

        if ('reportError' in props && typeof props.reportError === 'function') {
            switch (name){
                case LBS_Symbol.description:
                    return <LatitudeBandSelector key={key } reportError={props.reportError}/>;
                case LS_Symbol.description:
                    return <LocationSelector key={key} reportError={props.reportError}/>
                case MGC_Symbol.description:
                    return <ModelGroupConfigurator key={key} reportError={props.reportError}/>;
                case PNF_Symbol.description:
                    return <PlotNameField key={key} reportError={props.reportError} />;
                case RMS_Symbol.description:
                    return <ReferenceModelSelector key={key} reportError={props.reportError}/>;
                case RYF_Symbol.description:
                    return <ReferenceYearField key={key} reportError={props.reportError} />;
                case RS_Symbol.description:
                    return <RegionSelector key={key} reportError={props.reportError} />;
                case TCG_Symbol.description:
                    return <TimeCheckBoxGroup key={key} reportError={props.reportError} />;
                case XAF_Symbol.description:
                    return <XAxisField key={key} reportError={props.reportError} />;
                case YAF_Symbol.description:
                    return <YAxisField key={key} reportError={props.reportError} />;
                case CLS_Symbol.description:
                    return <CustomLatitudeSelector key={key} reportError={props.reportError} />
                default:
                    props.reportError(`Section ${props.name} found no match for an input component ${name}`);
            }
        } else {
            return(
                <> `props.ReportError` not defined </>
            );
        }
    }

    if (!props.components || props.components.length === 0) {
       if('reportError' in props && typeof props.reportError === 'function') {
           props.reportError(`Section ${props.name} was provided with no components`);
           return <></>;
        } else {
           return(
               <> `props.ReportError` not defined </>
           );
       }
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
    /**
     * the name of the section
     */
    name: PropTypes.string.isRequired,
    /**
     * used for error handling
     */
    reportError: PropTypes.func.isRequired,
    /**
     * an array containing a string representation of all components that should be plotted
     */
    components: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * whether this section should be expanded
     */
    isExpanded: PropTypes.bool.isRequired,
    /**
     * function to collapse this section
     */
    onCollapse: PropTypes.func,
    /**
     * function to expand this section
     */
    onExpand: PropTypes.func
}

export default Section;