import * as React from 'react';

/**
 * opens a modal to ensure user can downlaod plot
 * @param {*} props 
 *  props.open -> whether modal should be visible
 *  props.onClose -> handles closing the modal
 *  props.error -> enabling to report an error
 * @returns a jsx containing a modal with a dropdown to choose the file type and a download button
 */
export default function DownloadModal(props) {

    let i = props.onClose;
    i = props.error;


    const allAvailableDataFormats = [];

    const downloadImg = (imgType) => {};

    if (props.open) {
        return (<></>);
    }
    return (<></>);
}