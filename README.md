<div id="top"></div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://git.scc.kit.edu/synergy.o3as/o3webapp/-/blob/issue_readMe_%2365">
    <img src="public/O3asWepAppIcon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">The O3as Webapp</h3>

  <p align="center">
    The O3as Webapp has the purpose of visualizing data from the ozone layer
    and thus enhancing the scientific research of the ozone layer decomposition.
    The Webapp provides an intuitive user interface for detailed visualizations,
    e.g. ozone recovery analysis, and calculation of statistical values. Furthermore,
    plotted data can be downloaded to share gathered information. Plots can also be shared by simply copying the URL.
    To get more information about the "O3as: Ozone Assessment" project, check out the [main website](https://o3as.data.kit.edu/).
  </p>
</div>

## Built With

- [npm.js](https://www.npmjs.com/) package manager
- [React.js](https://reactjs.org/) main Javascript Framework
- [Redux.js](https://redux.js.org/) internal store, simplifies communication between different components
- [Apexcharts.js](https://apexcharts.com/) rused for endering of the graph. Used through the [react wrapper](https://apexcharts.com/docs/react-charts/)
- [pdfmake](http://pdfmake.org/#/) used to export a pdf
- [Jest.js](https://jestjs.io/) main framework for testing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) provides more React specific tests
- [MaterialUI](https://mui.com/) provides styled input components (similiar to Bootstrap)
- [axios](https://axios-http.com/docs/intro) used for API communication
- [jsdoc](https://jsdoc.app/index.html) used standard for documenting the code
- [better docs](https://betterdocs.co/) provides custom `@component` tags specificially for React Apps, as well as `@category` tags

## Documentation
For now you have to locally create the docs. In the future we are going to host the docs and provide a link to them here.


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

For testing purposes there is a runnig instance of the Webapp on a VM. You can visit the test WebApp [here](http://o3web.test.fedcloud.eu:3000/).

- If you have a private key and and you want to connect to the VM where the WebApp is deployed, execute:

```
    ssh -i <your_private_key> cloudadm@o3web.test.fedcloud.eu
```

- After connecting to the VM and you want to see the logs of the application, including messages from the container, execute:

```
    sudo docker-compose -f app
```

### Data
In order to see the API and try out some requests, visit: 

### How to configurate the Webapp

Configuration can be done in the config file.
The default config specifies where to put certain fields, if after calling the API it is necessary to place them somewhere.
Special config files for endpoints can be specified.


## Credits

Developers which worked on this project:

- Furkan Çevik
- Thomas Marwitz
- Simon von Rönn
- Nikolai Prjanikov
- Jana Zeller


## License
This project is liscensed under the [GNU License](https://git.scc.kit.edu/synergy.o3as/o3webapp/-/blob/develop/LICENSE).


<p align="right">(<a href="#top">back to top</a>)</p>
