import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material"
import { useContext } from "react";
import { Languages } from "../helpers/All__mapping";
import { CommonContext } from "../helpers/CommonContext";
import RenderingComponentOnLanguageSelect from "../pages/create__flow/create__flow__components/create__flow__component/if__ivr__selected/rendering__component__on__language__select/RenderingComponentOnLanguageSelect"
import RenderingComponentOnLanguageSelectOfSMS from "../pages/create__flow/create__flow__components/create__flow__component/if__sms__selected/rendering__component__on__language__select__sms/RenderingComponentOnLanguageSelectOfSMS"
import { useError } from "../store/errorContext";
import { store } from "../store/store";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const LanguageComponent = ({props}) =>{
    const { showError, errorDispatch } = useError();
    const {
        dtmfTimeHindi,
        setDtmfTimeHindi,
        dtmfTimeEnglish,
        setDtmfTimeEnglish,
        dtmfTimeArabic,
        setDtmfTimeArabic,
        dtmfTimeSpanish,
        setDtmfTimeSpanish,
        ifIVRselectedThenLanguage,
        setIfIVRselectedThenLanguage,
        channel,
      } = useContext(CommonContext);
      const globalState = useContext(store);
      const { dispatch } = globalState;
      let localStore = globalState.state;
      const languages = globalState.state.languages;
      const languagesCode = [];

      const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      };

      const handleLanguageChange = (e) => {
        debugger;
        const {
          target: { value },
        } = e;
    
        setIfIVRselectedThenLanguage(
          typeof value === "string" ? value.split(",") : value
        );
        console.log("globalState", globalState);
        console.log("dispatch", dispatch);
        let languageChangeList = [];
        let finalLanguageList = [
          {
            level: 0,
            node_type: "LANG_SELECTION",
            id: "0",
            actions: "",
          },
        ];
        for (var x = 0; x < e.target.value.length; x++) {
          for (var y in languages) {
            if (e.target.value[x] == languages[y].lang) {
              languagesCode.push(languages[y].code);
              languageChangeList.push({
                id: "0_5",
                input: {
                  ivr_key: x + 1,
                  sms_key: "",
                  ussd_key: ''
                },
                language: languages[y].code,
                languageName: languages[y].lang,
                lang_file: {
                  ivr: "",
                  sms: "",
                },
                actionType: {
                  ivr: "PLAY",
                  sms: "HITURL_SMS",
                  ussd: "HITURL_USSD"
                },
                action_delay_min: 0,
                repeatCount: 0,
                waitTime: "",
              });
            }
          }
        }
        console.log("languages[y]====>", languages[y].code);
        console.log("languagesCode languagesCode=======>", languagesCode);
        finalLanguageList[0].actions = languageChangeList;
        localStore.ivrCampFlowData.flow["languageChange"] = languagesCode;
        for (
          let i = 0;
          i < localStore.ivrCampFlowData.flow.languageChange.length;
          i++
        ) {
          localStore.ivrCampFlowData.flow.main_file["ivr"][
            localStore.ivrCampFlowData.flow.languageChange[i]
          ] = "";
    
          localStore.ivrCampFlowData.flow.main_file["sms"][
            localStore.ivrCampFlowData.flow.languageChange[i]
          ] = "";
        }
    
        console.log("finalLanguageList finalLanguageList", finalLanguageList);
        localStore.ivrCampFlowData.flow.language = finalLanguageList;
        dispatch({ type: "SET_DATA", nState: localStore });
        console.log(localStore);
      };

    return <>
                        <div className="call__flow__details__languages__dropdown__container">
                  <FormControl style={{ width: "50%" }}>
                    <InputLabel
                      style={{
                        backgroundColor: "white",
                        paddingRight: "4px",
                      }}
                      id="demo-multiple-checkbox-label"
                      required
                      error={
                        showError
                          ? ifIVRselectedThenLanguage.length
                            ? false
                            : true
                          : false
                      }
                    >
                      Select Languages
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={
                        localStore.ivrCampFlowData.flow.language[0].actions
                          ? localStore.ivrCampFlowData.flow.language[0].actions.map(
                              (item) => item.languageName
                            )
                          : ifIVRselectedThenLanguage
                      }
                      onChange={handleLanguageChange}
                      input={<OutlinedInput label="Select language" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                      disabled={props.disableEditingWhileCreatingCamp}
                      required
                      error={
                        showError
                          ? ifIVRselectedThenLanguage.length
                            ? false
                            : true
                          : false
                      }
                    >
                      {Languages.map((Languages) => (
                        <MenuItem key={Languages} value={Languages}>
                          <Checkbox
                            checked={
                              ifIVRselectedThenLanguage.indexOf(Languages) > -1
                            }
                          />
                          <ListItemText primary={Languages} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              {
                ifIVRselectedThenLanguage.length > 1 ? <div className="hello">
                {ifIVRselectedThenLanguage.indexOf("Hindi") !== -1 &&
                (channel === "IVR" || channel === "USSD") ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={1}
                    lang="Hindi"
                    dtmfTime={dtmfTimeHindi}
                    setDtmfTime={setDtmfTimeHindi}
                    languageCode="_H"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("English") !== -1 &&
                (channel === "IVR" || channel === "USSD") ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={2}
                    lang="English"
                    dtmfTime={dtmfTimeEnglish}
                    setDtmfTime={setDtmfTimeEnglish}
                    languageCode="_E"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Arabic") !== -1 &&
                (channel === "IVR" || channel === "USSD") ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={3}
                    lang="Arabic"
                    dtmfTime={dtmfTimeArabic}
                    setDtmfTime={setDtmfTimeArabic}
                    languageCode="_A"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Spanish") !== -1 &&
                (channel === "IVR" || channel === "USSD") ? (
                  <RenderingComponentOnLanguageSelect
                    indxx={4}
                    lang="Spanish"
                    dtmfTime={dtmfTimeSpanish}
                    setDtmfTime={setDtmfTimeSpanish}
                    languageCode="_S"
                    hideItemStyle={props.hideItemStyle}
                    disableEditingWhileCreatingCamp={
                      props.disableEditingWhileCreatingCamp
                    }
                  />
                ) : (
                  ""
                )}

                {/* .................. sms .................. */}
                {ifIVRselectedThenLanguage.indexOf("Hindi") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Hindi" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("English") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="English" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Arabic") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Arabic" />
                ) : (
                  ""
                )}
                {ifIVRselectedThenLanguage.indexOf("Spanish") !== -1 &&
                channel === "SMS" ? (
                  <RenderingComponentOnLanguageSelectOfSMS lang="Spanish" />
                ) : (
                  ""
                )}
              </div> : <></>
              }
    </>
}

export {LanguageComponent}