import React, { useContext, useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CommonContext } from "../../../../../../helpers/CommonContext";
import "./renderingcomponentonlanguageselect.css";

const RenderingComponentOnLanguageSelect = (props) => {
  console.log("language props ====>",props);
  const { dtmfTime, setDtmfTime } = useContext(CommonContext);

  const saveValues = (e) => {
    // console.log(e.target.value);
    props.setDtmfTime(e.target.value);
  };
  useEffect(() => {
    // console.log("dtmfTime", dtmfTime);
  }, [dtmfTime]);

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
                label={"Wait time for " + props.lang + " language"}
                variant="outlined"
                value={props.dtmfTime}
                onChange={saveValues}
              />
            </Box>
          </div>

          <div className="file__chooser__container">
            <input accept="audio/*" type="file" class="custom-file-input" placeholder={props.lang} />
            {/* <span>{props.lang}</span> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default RenderingComponentOnLanguageSelect;
