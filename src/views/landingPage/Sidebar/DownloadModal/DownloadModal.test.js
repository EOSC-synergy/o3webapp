import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadModal from './DownloadModal';
import { Provider } from "react-redux";
import { createTestStore } from '../../../../store/store';

let store;
beforeEach(() => {
  store = createTestStore();
});

describe('testing DownloadModal rendering', () => {

    it('renders without crashing', () => {
        render(<Provider store ={store}> <DownloadModal reportError={() => {}} onClose={()=>{}} isOpen={true} /></Provider>);
    });

    it('renders correctly when open', () => {
        let { baseElement, container } = render(
            <Provider store ={store} > <DownloadModal isOpen={true} onClose={() => {}} reportError={() => {}} /> </Provider>
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { container, baseElement } = render(
            <Provider store ={store}> <DownloadModal isOpen={false} onClose={() => {}} reportError={() => {}} /></Provider>
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).not.toBeVisible;
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(
            <Provider store ={store}> <DownloadModal onClose={()=>{}} reportError={()=>{}} /></Provider>
        );
        expect(console.error).toHaveBeenCalled();
        render(
            <Provider store ={store}> <DownloadModal isOpen={true} reportError={() => {}} /></Provider>
        );
        expect(console.error).toHaveBeenCalled();
    });
});
