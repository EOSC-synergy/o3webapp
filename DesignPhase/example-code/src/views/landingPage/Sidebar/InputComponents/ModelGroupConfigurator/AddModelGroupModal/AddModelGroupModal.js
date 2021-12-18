import React, { useState } from "react";

/**
 * opens a modal where the user can add a new model group
 * @param {*} props 
 *  props.onClose -> function to call if modal should be closed
 *  props.open -> boolean whether the modal should be visible
 *  props.error -> error handling
 *  props.addModaelGroup -> function to add a model group
 * @returns a jsx containing a modal with a transfer list with all available models
 */
export default function AddModelGroupModal(props) {

    props.open;
    props.onClose;
    props.error;

    // TODO: -> Redux
    props.addModelGroup;

    const dispatch = useDispatch()
    
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(models);
    const [right, setRight] = React.useState([]);
    const [groupName, setGroupName] = React.useState('');

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const addNewGroup = () => {
        props.addModelGroup(groupName, right);
        handleAllLeft();
        setGroupName('');
        dispatch(ADD_GROUP(groupName, someData))
        props.onClose();
    }

    const updateGroupName = (event) => {
        event.preventDefault();
        setGroupName(event.target.value);
    }

    const searchDataLeft = (event) => {

    }

    const searchDataRight = (event) => {

    }

    const searchData = (event) => {

    }

    // TODOD: API Call
    const getAllAvailableModels = () => {
        return null;
    }

    return (
        <>
            {props.open && <></>}
        </>
    );
}