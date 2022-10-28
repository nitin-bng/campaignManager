import { TextField } from "@mui/material"

export const MessageUploadForThankYou = ({lang, hideItemStyle, localStore, languageNames, handleThankYouMsg}) =>{


return <div style={{width:"40%", display:"inline-block", margin:"0 5%"}} className={hideItemStyle}>
<TextField
  hideItemStyle={hideItemStyle}
  localStore={localStore}
  lang={lang}
  id="outlined-multiline-static"
  label={`Thank you message in ${languageNames[lang]}`}
  multiline
  rows={2}
  variant="outlined"
  onChange={(e) => handleThankYouMsg(e.target.value, lang)}
  // error={
  //   showError
  //     ? localStore.ivrCampFlowData.flow.main_file.ussd[lang]
  //       ? false
  //       : true
  //     : false
  // }
  style={{ width: "10%", marginTop: "1rem" }}
/>
</div>
}
