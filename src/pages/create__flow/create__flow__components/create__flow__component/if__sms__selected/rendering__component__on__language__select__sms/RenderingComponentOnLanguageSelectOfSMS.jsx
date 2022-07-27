import React from 'react'

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";


const RenderingComponentOnLanguageSelectOfSMS = (props) => {
  return (
    <>
    <div className="rendering__component__on__language__select">
            <div className="rendering__component__on__language__select__container">
            <div className="language__specific__wait__time__container">
              <Box
                component="form"
                style={{ width: "100%" }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="if__IVR__selected"
                  type="number"
                  label={"input key for " + props.lang + " language"}
                  variant="outlined"
                />
              </Box>
            </div>
            </div>
        </div>
    </>
  )
}

export default RenderingComponentOnLanguageSelectOfSMS