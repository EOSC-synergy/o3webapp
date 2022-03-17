import React from 'react';
import Section from './Section';
import {render, screen} from '@testing-library/react';
import defaultStructure from '../../../../config/defaultConfig.json';
import "@testing-library/jest-dom/extend-expect";
import { Provider } from 'react-redux';
import { createTestStore } from "../../../../store/store"

let store;
describe ('Section renders correclty', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
      render(
        <Provider store={store}>
            <Section isExpanded={true} components={[]} reportError={()=>{}} name={"test"} />
        </Provider>);
    });
    
    // report error if no components are entered
    it('reports error if no components are passed to render', () => {
        const reportError = jest.fn();
        const name = "1";
        render(
            <Provider store={store}>
                <Section reportError={reportError} components={[]} name={name} isExpanded={false}/>
            </Provider>
        );
        expect(reportError).toHaveBeenCalledWith(`Section ${name} was provided with no components`)
    });
    
    // report error if invalid components are entered
    it('reports error if invalid component is entered', () => {
        const reportError = jest.fn();
        const name = "1";
        const compName = "blob";
        render(
            <Provider store={store}>
                <Section reportError={reportError} components={[compName]} name={name} isExpanded={false}/>
            </Provider>
        );
        expect(reportError).toHaveBeenCalledWith(`Section ${name} found no match for an input component ${compName}`)
    });
    
    // renders props.name
    it('renders the given name', () => {
        const name = "Test";
        render(
            <Provider store={store}>     
                <Section components={["LatitudeBandSelector"]} name={name} isExpanded={false} reportError={()=>{}} />
            </Provider>
        );
        expect(screen.getByTestId('Section-Test')).toHaveTextContent(name.toUpperCase());
    });
    
    
    // Snapshot test
    it('renders correctly from config file', () => {
        for (let sectionIdx in defaultStructure.sections) {
            const { container } = render(
                <Provider store={store}>
                    <Section
                        name={defaultStructure.sections[sectionIdx].name}
                        reportError={() => {}}
                        components={defaultStructure.sections[sectionIdx].components}
                        isExpanded={true}
                    />
                </Provider>
            );
            expect(container).toMatchSnapshot();
        }
    });
});