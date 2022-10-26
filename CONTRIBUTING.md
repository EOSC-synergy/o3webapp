# Contributing

Contributions are welcome, and they are greatly appreciated! 
When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a [code of conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.


## Reporting bugs
Report bugs at https://github.com/EOSC-synergy/o3webapp/issues

If you are reporting a bug, please include:

* Your operating system name and version.
* Any details about your local setup that might be helpful in troubleshooting.
* If you can, provide detailed steps to reproduce the bug.
* If you don't have steps to reproduce the bug, just note your observations in
  as much detail as you can. Questions to start a discussion about the issue
  are welcome.

### Submit Feedback
The best way to send feedback is to file an issue at the follwing URL:

https://github.com/EOSC-synergy/o3webapp/issues

If you are proposing a feature:

* Explain in detail how it would work.
* Keep the scope as narrow as possible, to make it easier to implement.
* Remember that this is a volunteer-driven project, and that contributions
  are welcome :)

## Pull Request Process

You are welcome to open Pull Requests for either fixing a bug, adding a new feature, contributing to the documentation, etc.

1. Fork the repository and create a new branch from `main`.
2. If you’ve fixed a bug or added code that should be tested, add tests!
3. If the Pull Request adds functionality, the docs should be updated,
   [jsdoc](https://jsdoc.app/index.html) and [better docs](https://betterdocs.co/) are used for documentation.
4. Ensure the test suite passes: `npm run test -- --watchAll --coverage`.
5. Make sure your code lints (for example via `eslint src/ -f checkstyle`).
6. Update the README.md with details of changes, e.g. new environment variables, 
   exposed ports, container parameters etc.
6. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
7. Push the changes to your fork.
8. Create a Pull Request to this repository.
9. Review and address comments on your pull request.


## Coding Standards
* [npm.js](https://www.npmjs.com/) package manager
* [React.js](https://reactjs.org/) main Javascript Framework
* [Redux.js](https://redux.js.org/) internal store, simplifies communication between different components
* [Apexcharts.js](https://apexcharts.com/) used for rendering of the graph. Used through the [React wrapper](https://apexcharts.com/docs/react-charts/)
* [pdfmake](http://pdfmake.org/#/) used to export a pdf
* [Jest.js](https://jestjs.io/) main framework for testing
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) provides more React specific tests
* [MaterialUI](https://mui.com/) provides styled input components (similar to Bootstrap)
* [axios](https://axios-http.com/docs/intro) used for API communication
* [jsdoc](https://jsdoc.app/index.html) used standard for documenting the code
* [better docs](https://betterdocs.co/) provides custom `@component` tags specifically for React Apps, as well as `@category` tags
