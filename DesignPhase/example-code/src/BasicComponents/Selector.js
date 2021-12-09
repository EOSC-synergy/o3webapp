import * as React from 'react';
import {Button, SearchBar, CheckList, Divider, TextBox} from './BasicComponents'

function func() {
    return "TODO"
}

export default function Selector() {

    return (<div>
        <Divider text="Select Name" />
        <TextBox text="" />
        <Divider text="Add new models" />
        <SearchBar />
        <CheckList />
        <Button text=">>" onClick={func} />
        <Button text=">" onClick={func} />
        <Button text="<" onClick={func} />
        <Button text="<<" onClick={func} />
        <SearchBar />
        <CheckList />
        <Button text="Add group" onClick={func} />
    </div>);
}