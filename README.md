# The O3as Webapp

## Project Description

The O3as Webapp has the purpose of visualizing data from the ozone layer
and thus enhancing the scientific research of the ozone layer decomposition.
The product provides an intuitive user interface for detailed visualizations,
e.g. ozone recovery analysis, and calculation of statistical values. Furthermore,
plotted data can be downloaded to share gathered information

### Built With

* [React.js](https://reactjs.org/)
* [Redux.js](https://redux.js.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

## How to Install and Run the Project

* Make sure that you have installed React.js https://reactjs.org/docs/getting-started.html





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

To connect to the VM where the WebApp is deployed:
```
    ssh -i private_key cloudadm@o3web.test.fedcloud.eu
```

Shows the logging of the application, including whatever messages from the container.
```
    sudo docker-compose -f app
```