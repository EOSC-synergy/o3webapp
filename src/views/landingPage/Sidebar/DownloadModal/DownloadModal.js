import * as React from 'react';

/**
 * opens a modal to ensure user can downlaod plot
 * @param {Object} props 
 * @param {boolean} props.isOpen -> whether modal should be visible
 * @param {function} props.onClose -> handles closing the modal
 * @param {function} props.reportError -> enabling to report an error
 * @returns {JSX} a jsx containing a modal with a dropdown to choose the file type and a download button
 */
export default function DownloadModal(props) {

    let i = props.onClose;
    i = props.reportError;
    i = props.isOpen;


    const allAvailableDataFormats = [];

    const downloadImg = (imgFormat) => {};

    if (props.isOpen) {
        return (
        <>
            DownloadModal
        </>
        );
    }
    return (<></>);
}