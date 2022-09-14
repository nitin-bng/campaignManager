import { TextField } from "@material-ui/core"

const IfUssdSelected = ({hideItemStyle}) =>{



    return (
        <div className={hideItemStyle} hideItem>
            <TextField>This is message</TextField>
        </div>
    )
}

export {IfUssdSelected}