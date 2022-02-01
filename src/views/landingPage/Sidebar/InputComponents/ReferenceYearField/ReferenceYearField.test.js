import React from 'react';
import ReferenceYearField from './ReferenceYearField';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import { createTestStore } from '../../../../../store/store';
import { Provider } from "react-redux";

let store;

beforeEach(() => {
  store = createTestStore();
});

it('Component renders without crashing', () => {
    render(<Provider store={store}><ReferenceYearField /></Provider>);

});


// Snapshot test
it('renders correctly', () => {
    const { container } = render(<Provider store={store}><ReferenceYearField /></Provider>);
    expect(container).toMatchSnapshot();
  });



test.todo('changes the reference year correctly');