import React from 'react';
import ReactDOM from 'react-dom';
import Section from './Section';
import renderer from 'react-test-renderer';
import {render, screen} from '@testing-library/react';
import defaultStructure from '../../../../config/defaultConfig.json';
import "@testing-library/jest-dom/extend-expect";

it('Section renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Section />, div);
});

const testPropTypes = (component, propName, arraysOfTestValues, otherProps) => {
    console.error = jest.fn();
    const _test = (testValues, expectError) => {
        for (let propValue of testValues) {
            console.error.mockClear();
            React.createElement(component, {...otherProps, [propName]: propValue});
            expect(console.error).toHaveBeenCalledTimes(expectError ? 1 : 0);
        }
    };
    _test(arraysOfTestValues[0], false);
    _test(arraysOfTestValues[1], true);
};

// report error if no components are entered
it('Section reports error if no components are passed to render', () => {
    const reportError = jest.fn();
    const name = "1";
    const div = document.createElement('div');
    ReactDOM.render(<Section reportError={reportError} name={name} isExpanded={false}/>, div);
    expect(reportError).toHaveBeenCalledWith(`Section ${name} was provided with no components`)
})

// report error if invalid components are entered
it('Section reports error if invalid component is entered', () => {
    const reportError = jest.fn();
    const name = "1";
    const compName = "blob";
    const div = document.createElement('div');
    ReactDOM.render(<Section reportError={reportError} components={[compName]} name={name} isExpanded={false}/>, div);
    expect(reportError).toHaveBeenCalledWith(`Section ${name} found no match for an input component ${compName}`)
})

// renders props.name
it('Section renders the given name', () => {
    const name = "Test";
    render(<Section components={["LatitudeBandSelector"]} name={name} isExpanded={false}/>);
    expect(screen.getByTestId('section')).toHaveTextContent(name.toUpperCase());
})


// Snapshot test
it('Section renders correctly from config file', () => {
    for (let section in defaultStructure.sections) {
        const tree = renderer
            .create(<Section name={section.name} reportError={() => {}} components={section.components} isExpanded={false}/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    }
});