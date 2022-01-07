import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { useGetModelsQuery } from "../../../../../../services/API/apiSlice"
import { addedModelGroup, updatedModelGroup } from "../../../../../../store/modelsSlice"

/**
 * opens a modal where the user can add a new model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible
 * @param {function} props.reportError -> error handling
 * @returns {JSX} a jsx containing a modal with a transfer list with all available models
 */
function AddModelGroupModal(props) {

    let i = props.isOpen;
    i = props.onClose;
    i = props.reportError;

    // const dispatch = useDispatch()
    
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [groupName, setGroupName] = React.useState('');

    // const leftChecked = intersection(checked, left);
    // const rightChecked = intersection(checked, right);

    const leftChecked = [];
    const rightChecked = [];

    const handleChangeElement = (value) => () => {
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
        // setRight(right.concat(left));
        // setLeft([]);
    };

    const handleCheckedRight = () => {
        // setRight(right.concat(leftChecked));
        // setLeft(not(left, leftChecked));
        // setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        // setLeft(left.concat(rightChecked));
        // setRight(not(right, rightChecked));
        // setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        // setLeft(left.concat(right));
        // setRight([]);
    };

    const addNewGroup = () => {
        handleAllLeft();
        setGroupName('');
        // dispatch(addedModelGroup({groupName})) // add data (modelList)
    }

    const updateGroupName = (event) => {
        event.preventDefault();
    }

    const searchData = (event, data) => {

    }

    const getAllAvailableModels = () => {
        // const {data, isSuccess, isLoading, isError, error} = useGetModelsQuery()
        // display spinner until loading finished
    }

    return (
        <>
            AddModelGroupModal
            {props.isOpen && <></>}
        </>
    );
}

export default AddModelGroupModal;