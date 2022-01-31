import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadModal from './DownloadModal';

describe('testing DownloadModal rendering', () => {

    it('renders without crashing', () => {
        render(<DownloadModal reportError={() => {}} onClose={()=>{}} isOpen={true} />);
    });

    it('renders correctly when open', () => {
        let { baseElement, container } = render(
            <DownloadModal isOpen={true} onClose={() => {}} reportError={() => {}} />
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { container, baseElement } = render(
            <DownloadModal isOpen={false} onClose={() => {}} reportError={() => {}} />
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).not.toBeVisible;
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(
            <DownloadModal onClose={()=>{}} reportError={()=>{}} />
        );
        expect(console.error).toHaveBeenCalled();
        render(
            <DownloadModal isOpen={true} reportError={() => {}} />
        );
        expect(console.error).toHaveBeenCalled();
        render(
            <DownloadModal onClose={()=>{}} isOpen={true} />
        );
        expect(console.error).toHaveBeenCalled();
    });
});
