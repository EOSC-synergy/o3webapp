import React from 'react';
import renderer from 'react-test-renderer';
import Graph from './Graph'

it('renders correctly', () => {
  const tree = renderer
    .create(<Graph />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});