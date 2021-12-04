import React from 'react'

/**
 * empty description
 * the props are just an example
 * they make no sense for the
 * top level component
 */
export default function App(props) {

  const [exampleState, setExampleState] = React.useState(""); 

  const foo = () => {
    console.log("bar")
  }

  return (
    <div className="App" id={props.id}>
      Add components here
    </div>
  );
}