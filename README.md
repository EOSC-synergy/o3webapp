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
    The product provides an intuitive user interface for detailed visualizations,
    e.g. ozone recovery analysis, and calculation of statistical values. Furthermore,
    plotted data can be downloaded to share gathered information.
    To get more information about the "O3as: Ozone Assessment" project, visit: https://o3as.data.kit.edu/
  </p>
</div>

## Built With

- [node.js](https://nodejs.org/en/)
- [npm.js](https://www.npmjs.com/)
- [React.js](https://reactjs.org/)
- [Redux.js](https://redux.js.org/)
- [Apexcharts.js](https://apexcharts.com/)
- [pdfmake](http://pdfmake.org/#/)
- [Jest.js](https://jestjs.io/)
- [MaterialUI](https://mui.com/)
- [axios](https://axios-http.com/docs/intro)


## Prerequisites

Make sure that you have installed

- node.js (https://nodejs.dev/learn/how-to-install-nodejs)

## How to Install and Run the Project

- After cloning the project execute this command in order to install the necessary packages:

```
    npm install
```

- If you want to start the App localy, execute:

```
    npm start
```

- To run the tests and to see the test coverage, execute:

```
    npm run test -- --coverage .
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

There is a runnig instants on the VM. You can visit the WebApp via this link: http://o3web.test.fedcloud.eu:3000/

- If you have a private key and and you want to connect to the VM where the WebApp is deployed, execute:

```
    ssh -i <your_private_key> cloudadm@o3web.test.fedcloud.eu
```

- After connecting to the VM and you want to see the logging of the application, including messages from the container, execute:

```
    sudo docker-compose -f app
```

### Where the data come from

The required data for this Webapp is provided via the Swagger REST API for O3as.
In order to see the API and try some request, visit: 
https://api.o3as.fedcloud.eu/api/v1/ui/

### How to Configurate the Webapp

Configuration can be done in the config file.
The default config specifies where to put certain fields, if after calling the API it is necessary to place them somewhere.
Special config files for endpoints can be specified.

## Documentation
You can find the documentation under this link:
https://blank.org/


## Credits

Developers which worked on this project:

- Furkan Çevik
- Thomas Marwitz
- Simon von Rönn
- Nikolai Prjanikov
- Jana Zeller


## License
You can find the license under this link:
https://git.scc.kit.edu/synergy.o3as/o3webapp/-/blob/issue_readMe_%2365/LICENSE


<p align="right">(<a href="#top">back to top</a>)</p>
