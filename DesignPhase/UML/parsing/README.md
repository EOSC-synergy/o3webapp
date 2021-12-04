## Attention
the parser.py tool is not very robust and takes a few assumptions about how your React component code is structured

## Assumptions
- React Component needs to be in a Javascript file (.js)
- Components have to be written as functions (not classes!)
- The react component should be the first function that is defined in the file
- functions inside of the component (=methods) have to be declared using the "new" arrow syntax
- each state variable has to be declared by "React.useState..." in an individual lines
- If existent the docstring of the component will be added as a "description" too. Make sure to use linebreaks generously so the lines don't become too long and blow up the component in the diagram
- callbacks are only recognized if the are passed to the direct children. More layers are currently not supported, however this becomes messy very quickly and usually indicates that Redux could be a better option

## General information
- The path to the src/ directory of the React app and the name of the output file can be specified in the script 
- The output is a plain .txt file ready to be parsed with  
[plantuml.jar](https://plantuml.com/de/download)
- if the parsing fails just reach out to me
- The code is a mess, I know, please don't judge. This won't be the standard for our project
- The idea of representing the react components with UML in a class diagram came from this guys [blog](https://zf4.biz/blog/visualizing-react)