import React from 'react';
import ReactDOM from 'react-dom';
import DownloadModal from './DownloadModal';
import renderer from 'react-test-renderer';
import "@testing-library/jest-dom/extend-expect";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {shallow, configure} from 'enzyme';

describe('DownloadModal component', () => {
    configure({adapter: new Adapter()});
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<DownloadModal /* isOpen={true} */ />);
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
});
