import React from 'react'

export default function ModelGroup(props) {

    const [visibility, setVisibility] = React.useState(true)

    const [median, setMedian] = React.useState(false)
    const [mean, setMean] = React.useState(false)
    const [percentile, setPercentile] = React.useState(false)
    const [derivative, setDerivative] = React.useState(false)

    const handleMedian = () => {}
    const handleMean = () => {}
    const handlePercentile = () => {}
    const handleDerivative = () => {}
    const handleVisibility = () => {}
    const handleEditGroup = () => {
        // open some sort of popup
    }

    return (
        <div>

            <input text={"toggleVisibility"} value={visibility}/>
            <span>{props.groupName}</span>
            <Button text={"edit group"}/>
            <hr />
            <CheckBox value={median}>median</CheckBox>
            <CheckBox value={mean}>mean</CheckBox>
            <CheckBox value={percentile}>percentile</CheckBox>
            <CheckBox value={derivative}>derivative</CheckBox>
        </div>
    )
}