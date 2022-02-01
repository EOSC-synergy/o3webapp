import React from 'react';
import LatitudeBandSelector from './LatitudeBandSelector';
import { render } from '@testing-library/react';

describe('test LatitudeBandSelector component rendering', () => {

    it('renders without crashing', () => {
        render(<LatitudeBandSelector />);
    });

    it('renders as expected', () => {
        const { container } = render(<LatitudeBandSelector />);
        expect(container).toMatchSnapshot();
    });

});
