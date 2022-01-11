Add components inside to auto-generate a live UML diagram from the existing strucure.

The parser is alreay setup to generate the code from this **src/** directory and put the .txt file in the **generated-uml/** directory.

Notes on frameworks we want to use:
- React
- Redux (state handling)
- Jest (testing, also mantained by Facebook)
- React Testing Library (RTL) to test React components (recommended by React)
- Material UI (components, a lot of input components, in our experience better documented than Bootstrap)
- axios (API Calls)

Configuration can be done in the config file
The default config specifies where to put certain fields, if after calling the API it is necessary to place them somewhere.
Special config files for endpoints can be specified.

To run tests with showing test coverage run:
```
    npm run test -- --coverage .
```

To generate docs run:
```
    npm run docs
```