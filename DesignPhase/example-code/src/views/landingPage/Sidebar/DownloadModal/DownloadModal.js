import * as React from 'react';

/**
 * opens a modal to ensure user can downlaod plot
 * @param {*} props 
 *  props.open -> whether modal should be visible
 *  props.onClose -> handles closing the modal
 *  props.error -> enabling to report an error
 * @returns 
 */
export default function DownloadModal(props) {

    props.onClose;
    props.error;
    
    if (props.open) {
        return (<></>);
    }
    return (<></>);
}