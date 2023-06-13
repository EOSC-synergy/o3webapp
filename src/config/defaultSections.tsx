import PlotNameField from '../views/landingPage/Sidebar/InputComponents/PlotNameField';
import XAxisField from '../views/landingPage/Sidebar/InputComponents/XAxisField';
import YAxisField from '../views/landingPage/Sidebar/InputComponents/YAxisField';
import ModelGroupConfigurator from '../views/landingPage/Sidebar/InputComponents/ModelGroupConfigurator';
import LatitudeBandSelector from '../views/landingPage/Sidebar/InputComponents/LatitudeBandSelector';
import TimeCheckBoxGroup from '../views/landingPage/Sidebar/InputComponents/TimeCheckboxGroup';
import ReferenceModelSelector from '../views/landingPage/Sidebar/InputComponents/ReferenceModelSelector';
import ReferenceYearField from '../views/landingPage/Sidebar/InputComponents/ReferenceYearField';

const defaultSections = {
    sections: [
        {
            name: 'Appearance',
            components: [PlotNameField, XAxisField, YAxisField],
        },
        {
            name: 'Models',
            components: [ModelGroupConfigurator],
        },
        {
            name: 'Filter Data',
            components: [LatitudeBandSelector, TimeCheckBoxGroup],
        },
        {
            name: 'Reference Year',
            components: [ReferenceModelSelector, ReferenceYearField],
        },
    ],
};

export default defaultSections;
