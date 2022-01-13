import React from 'react';
import ReactDOM from 'react-dom';
import LatitudeBandSelector from './LatitudeBandSelector';
import renderer from 'react-test-renderer';
import "@testing-library/jest-dom/extend-expect";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {shallow, configure, mount} from 'enzyme';

describe('LatitudeBandSelector component', () => {
    configure({adapter: new Adapter()});
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<LatitudeBandSelector />);
    });

    it('should render without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(wrapper, div);
    });

    // Snapshot test
    it('should render correctly from config file', () => {
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
    });
    /*
    it('should update `isCustomizable` state', () => {
        let wrapped = mount(<LatitudeBandSelector />);
        let wrappedFind = wrapped.find('#latitudeBandSelector');
        //console.log(wrappedFind.debug());
        wrappedFind.first().props().onChange({ target: { value: 'custom' } });
        wrappedFind.first().simulate('change', { target: { value: 'custom' } });
        expect(wrapped.find('customLatitudeBandInput').at(0));
        expect(wrapped.find('customLatitudeBandInput').at(1));
    });
     */
});