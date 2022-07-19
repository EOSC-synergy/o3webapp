import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomLatitudeSelector from '../InputComponents/LatitudeBandSelector/CustomLatitudeSelector';
import LatitudeBandSelector from '../InputComponents/LatitudeBandSelector/LatitudeBandSelector';
import LocationSelector from '../InputComponents/LatitudeBandSelector/LatitudeBandSelector';
import ModelGroupConfigurator from '../InputComponents/ModelGroupConfigurator/ModelGroupConfigurator';
import PlotNameField from '../InputComponents/PlotNameField/PlotNameField';
import ReferenceModelSelector from '../InputComponents/ReferenceModelSelector/ReferenceModelSelector';
import ReferenceYearField from '../InputComponents/ReferenceYearField/ReferenceYearField';
import RegionSelector from '../InputComponents/RegionSelector/RegionSelector';
import TimeCheckBoxGroup from '../InputComponents/TimeCheckboxGroup/TimeCheckboxGroup';
import XAxisField from '../InputComponents/XAxisField';
import YAxisField from '../InputComponents/YAxisField';

/**
 * Stores the name of the CustomLatitudeSelector component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const CLS_Symbol = Symbol('CustomLatitudeSelector');

/**
 * Stores the name of the LatitudeBandSelector component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const LBS_Symbol = Symbol('LatitudeBandSelector');

/**
 * Stores the name of the LocationSelector component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const LS_Symbol = Symbol('LocationSelector');

/**
 * Stores the name of the ModelGroupConfigurator component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const MGC_Symbol = Symbol('ModelGroupConfigurator');

/** Stores the name of the PlotNameField component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const PNF_Symbol = Symbol('PlotNameField');

/** Stores the name of the ReferenceModelSelector component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const RMS_Symbol = Symbol('ReferenceModelSelector');

/** Stores the name of the ReferenceYearField component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const RYF_Symbol = Symbol('ReferenceYearField');

/** Stores the name of the RegionSelector component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const RS_Symbol = Symbol('RegionSelector');

/** Stores the name of the TimeCheckBoxGroup component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const TCG_Symbol = Symbol('TimeCheckBoxGroup');

/** Stores the name of the XAxisField component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const XAF_Symbol = Symbol('XAxisField');

/** Stores the name of the YAxisField component as a Symbol.
 * @constant {String}
 * @memberof Section
 */
const YAF_Symbol = Symbol('YAxisField');

/**
 * Custom Accordion component
 * inspired by: {@link https://mui.com/components/accordion/#customization}
 * @constant {JSX.Element}
 * @memberof Section
 */
const Accordion = styled((props) => (
    // @ts-expect-error TODO: missing children prop? we're just stying it though
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
 * @const {JSX.Element}
 * @memberof Section
 */
const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
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
 * @const {JSX.Element}
 * @memberof Section
 */
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type SectionProps = {
    components: string[];
    name: string;
    reportError: (error: string) => void;
    isExpanded: boolean;
    onCollapse?: () => void;
    onExpand?: () => void;
};

/**
 * an expandable section containing a list of inputComponents as well as a name
 * @component
 * @param components -> an array containing a string representation of all components that should be plotted
 * @param name -> the name of the section
 * @param reportError -> used for error handling
 * @param isExpanded -> whether this section should be expanded
 * @param onCollapse -> function to collapse this section
 * @param onExpand -> function to expand this section
 * @returns an accordion that once expanded displays the components specified by the config files and the API doc
 */
const Section: React.FC<SectionProps> = ({
    components,
    name,
    reportError,
    isExpanded,
    onCollapse,
    onExpand,
}) => {
    /**
     * maps a given name to a corresponding component from the ./InputComponents folder
     * if there is no component with the given name, calls the props.reportError function
     * @public
     * @param name_ the name of the component
     * @param key a unique key for the given input component
     * @returns {JSX.Element} a component from './InputComponents
     */
    function mapNameToComponent(name_: string, key: number) {
        if (reportError !== undefined) {
            switch (name_) {
                case CLS_Symbol.description:
                    return <CustomLatitudeSelector key={key} />;
                case LBS_Symbol.description:
                    return <LatitudeBandSelector key={key} />;
                case LS_Symbol.description:
                    return <LocationSelector key={key} />;
                case MGC_Symbol.description:
                    return <ModelGroupConfigurator key={key} reportError={reportError} />;
                case PNF_Symbol.description:
                    return <PlotNameField key={key} reportError={reportError} />;
                case RMS_Symbol.description:
                    return <ReferenceModelSelector key={key} reportError={reportError} />;
                case RYF_Symbol.description:
                    return <ReferenceYearField key={key} />;
                case RS_Symbol.description:
                    return <RegionSelector key={key} />;
                case TCG_Symbol.description:
                    return <TimeCheckBoxGroup key={key} reportError={reportError} />;
                case XAF_Symbol.description:
                    return <XAxisField key={key} />;
                case YAF_Symbol.description:
                    return <YAxisField key={key} reportError={reportError} />;
                default:
                    reportError(`Section ${name} found no match for an input component ${name_}`);
            }
        } else {
            return <> `props.ReportError` not defined </>;
        }
    }

    if (!components || components.length === 0) {
        if (reportError !== undefined) {
            reportError(`Section ${name} was provided with no components`);
            return <></>;
        } else {
            return <> `props.ReportError` not defined </>;
        }
    }

    return (
        <Accordion
            data-testid={`Section-${name}`}
            sx={{
                maxWidth: '100vw', // make sure accordion is not wider than the full screen
            }}
            //expanded={isExpanded}
            //onChange={isExpanded ? onCollapse : onExpand}
        >
            <AccordionSummary
                //expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                //id="panel1a-header"
                data-testid={`Section-Summary-${name}`}
            >
                <Typography>{name.toUpperCase()}</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <>
                    {components.map((element, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {mapNameToComponent(element, idx)}
                                {idx !== components.length - 1 && (
                                    <div style={{ height: '20px' }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </>
            </AccordionDetails>
        </Accordion>
    );
};

Section.propTypes = {
    name: PropTypes.string.isRequired,
    reportError: PropTypes.func.isRequired,
    components: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
};

export default Section;
