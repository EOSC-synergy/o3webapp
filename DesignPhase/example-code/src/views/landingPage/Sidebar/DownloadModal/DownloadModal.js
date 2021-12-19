import * as React from 'react';

/**
 * opens a modal to ensure user can downlaod plot
 * @param {Object} props 
 * @param {boolean} props.open -> whether modal should be visible
 * @param {function} props.onClose -> handles closing the modal
 * @param {function} props.error -> enabling to report an error
 * @returns {JSX} a jsx containing a modal with a dropdown to choose the file type and a download button
 */
export default function DownloadModal(props) {

    let i = props.onClose;
    i = props.error;
    i = props.open;


    const allAvailableDataFormats = [];

    const downloadImg = (imgType) => {};

    if (props.open) {
        return (<></>);
    }
    return (<></>);
}