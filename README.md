
[![Build Status](https://jenkins.eosc-synergy.eu/buildStatus/icon?job=eosc-synergy-org%2Fo3webapp%2Fmain)](https://jenkins.eosc-synergy.eu/job/eosc-synergy-org/job/o3webapp/job/main/)

<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://codebase.helmholtz.cloud/m-team/o3as/o3webapp/-/blob/develop">
    <img src="https://o3as.data.kit.edu/img/logos/o3as-logo.svg" alt="Logo" width="200" height="200">
  </a>

<h3 align="center">The O3as Webapp</h3>

  <p align="center">
    The O3as Webapp has the purpose of visualizing data from the ozone layer
    and thus enhancing the scientific research of the ozone layer decomposition.
    The Webapp provides an intuitive user interface for detailed visualizations,
    e.g. ozone recovery analysis, and calculation of statistical values. Furthermore,
    plotted data can be downloaded to share gathered information. Plots can also be shared by simply copying the URL.
    To get more information about the "O3as: Ozone Assessment" project, check out the <a href="https://o3as.data.kit.edu/">main website</a>.
  </p>
</div>

## Built With

- [npm.js](https://www.npmjs.com/) package manager
- [React.js](https://reactjs.org/) main Javascript Framework
- [Redux.js](https://redux.js.org/) internal store, simplifies communication between different components
- [Apexcharts.js](https://apexcharts.com/) used for rendering of the graph. Used through the [React wrapper](https://apexcharts.com/docs/react-charts/)
- [pdfmake](http://pdfmake.org/#/) used to export a pdf
- [Jest.js](https://jestjs.io/) main framework for testing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) provides more React specific tests
- [MaterialUI](https://mui.com/) provides styled input components (similar to Bootstrap)
- [axios](https://axios-http.com/docs/intro) used for API communication
- [jsdoc](https://jsdoc.app/index.html) used standard for documenting the code
- [better docs](https://betterdocs.co/) provides custom `@component` tags specifically for React Apps, as well as `@category` tags

## Documentation
For now, you have to locally create the docs. In the future we are going to host the docs and provide a link to them here.


## Prerequisites

Make sure that you have installed

- [node.js](https://nodejs.dev/learn/how-to-install-nodejs) (automatically also installs npm)

## How to install and run the Project

- After cloning the project execute this command in order to install the necessary packages:

```
    npm install
```

- If you want to start the App locally, execute:

```
    npm start
```

- To run tests and to see the test coverage, execute:

```
    npm run test -- --watchAll --coverage 
```

- To generate docs, execute:
```
    npm run docs
```

Before building the docs for the first time, you have to go to `o3webapp/node_modules/better-docs/bundler.js` and remove the `--dist-dir ${outDist}` option. So replace
```js
  const cmd = `${process.platform === 'win32' ? 'SET ' : ''}NODE_ENV=development parcel build ${entry} --dist-dir ${outDist}`
```
with
```js
  const cmd = `${process.platform === 'win32' ? 'SET ' : ''}NODE_ENV=development parcel build ${entry}`
```

### Working on the VM

For testing purposes there is a running instance of the Webapp on a VM. You can visit the test WebApp [here](http://o3web.test.fedcloud.eu:3000/).

- If you have a private key, and you want to connect to the VM where the WebApp is deployed, execute:

```
    ssh -i <your_private_key> cloudadm@o3web.test.fedcloud.eu
```

- After connecting to the VM and you want to see the logs of the application, including messages from the container, execute:

```
    sudo docker-compose -f app
```

### Data
In order to see the API and try out some requests, visit: [O3as Api](https://api.o3as.fedcloud.eu/api/v1/ui/#/)

### How to configure the sections of the Webapp

Section configuration can be done in the config/ directory.
defaultConfig.json specifies the default setup of the sections.
When a new plot type is added, it has the section configuration of defaultConfig.json.
To customize the setup of a specific plot type, go to the .json file with the corresponding plot type name.
The specific config files overwrite defaultConfig.json.
To overwrite a section, add the section with the same name in the specific config file.
If the name of a section doesn't appear in defaultConfig.json, it will be added as a new section.

Example:

defaultConfig.json:
```
{
  "sections": [
    {
      "name": "Appearance",
      "components": ["PlotNameField", "XAxisField", "YAxisField"]
    },
    {
      "name": "Models",
      "components": ["ModelGroupConfigurator"]
    }
  ]
}
```
and this specific config file:
```
{
  "sections": [
    {
      "name": "Appearance",
      "components": ["PlotNameField", "RegionSelector", "YAxisField"]
    },
    {
      "name": "Filter Data",
      "components": ["TimeCheckBoxGroup"]
    }
  ]
}
```
will convert to
```
{
  "sections": [
    {
      "name": "Appearance",
      "components": ["PlotNameField", "RegionSelector", "YAxisField"]
    },
    {
      "name": "Models",
      "components": ["ModelGroupConfigurator"]
    },
    {
      "name": "Filter Data",
      "components": ["TimeCheckBoxGroup"]
    }
  ]
}
```


## Credits

Developers which worked on this project:

- Furkan Çevik
- Thomas Marwitz
- Simon von Rönn
- Nikolai Prjanikov
- Jana Zeller


## License
This project is licensed under the [GNU License](https://codebase.helmholtz.cloud/m-team/o3as/o3webapp/-/blob/develop/LICENSE).


<p align="right">(<a href="#top">back to top</a>)</p>
