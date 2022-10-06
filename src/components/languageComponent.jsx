import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useContext } from "react";
import { Languages } from "../helpers/All__mapping";
import { CommonContext } from "../helpers/CommonContext";
import RenderingComponentOnLanguageSelect from "../pages/create__flow/create__flow__components/create__flow__component/if__ivr__selected/rendering__component__on__language__select/RenderingComponentOnLanguageSelect";
import RenderingComponentOnLanguageSelectOfSMS from "../pages/create__flow/create__flow__components/create__flow__component/if__sms__selected/rendering__component__on__language__select__sms/RenderingComponentOnLanguageSelectOfSMS";
import { useError } from "../store/errorContext";
import { store } from "../store/store";


const LanguageComponent = ({ props }) => {
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


  return (
    <>
      {ifIVRselectedThenLanguage.length > 1 ? (
        <div className="hello">
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export { LanguageComponent };
