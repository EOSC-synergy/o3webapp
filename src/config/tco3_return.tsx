import PlotNameField from '../views/landingPage/Sidebar/InputComponents/PlotNameField';
import RegionSelector from '../views/landingPage/Sidebar/InputComponents/RegionSelector';
import YAxisField from '../views/landingPage/Sidebar/InputComponents/YAxisField';
import TimeCheckBoxGroup from '../views/landingPage/Sidebar/InputComponents/TimeCheckboxGroup';

const tco3ReturnSections = {
    sections: [
        {
            name: 'Appearance',
            components: [PlotNameField, RegionSelector, YAxisField],
        },
        {
            name: 'Filter Data',
            components: [TimeCheckBoxGroup],
        },
    ],
};

export default tco3ReturnSections;
