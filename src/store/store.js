// store.js
import { sub } from "date-fns";
import React, { createContext, useReducer, useState } from "react";

const initialState = {
  navBarToggle: {
    toggle: false,
  },
  user: {},
  temp: {
    uploads: [],
  },
  languages: [
    {
      lang: "English",
      code: "_E",
      input: "ENG",
    },
    {
      lang: "Hindi",
      code: "_H",
      input: "HIN",
    },
    {
      lang: "Spanish",
      code: "_S",
      input: "SPA",
    },
    {
      lang: "Arabic",
      code: "_A",
      input: "ARB",
    },
  ],
  channelSwitch: [
    {
      lang: "ivrTosms",
      code: "9",
    },
    {
      lang: "smsToivr",
      code: "C2IVR",
    },
  ],
  // localStore.ivrCampFlowData.flow.language[0].actions
  ivrCampFlowData: {
    flow: {
      language_local: ["en"],
      language: [{actions:[]}],
      selectedLanguages: [],
      // flow_type: "PARALLEL_CH_FLOW",
      flow_type: "SINGLE_CH_FLOW",
      defaultLanguage: "_E",
      languageChange: [],
      channel: [],
      channel_local: [],
      channelChange: [],
      // input: {},
      main_file: {
        ivr: {},
        sms: {},
      },
      actionType: {
        ivr: "PLAY",
        sms: "SCHEDULE_SMS",
      },
      waitTime: '',
      actions: [],
      repeat: {
        value: false,
        dtmf: 0,
        audio_file: [],
      },
    },
  },
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  // console.log("....store....");
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_DATA":
        // console.log("store : 1", state, action.nState);
        const newState = { ...state, ...action.nState };
        return newState;
      case "EMPTY_DATA":
        return {
          navBarToggle: {
            toggle: false,
          },
          user: {},
          temp: {
            uploads: [],
          },
          languages: [
            {
              lang: "English",
              code: "_E",
              input: "ENG",
            },
            {
              lang: "Hindi",
              code: "_H",
              input: "HIN",
            },
            {
              lang: "Spanish",
              code: "_S",
              input: "SPA",
            },
            {
              lang: "Arabic",
              code: "_A",
              input: "ARB",
            },
          ],
          channelSwitch: [
            {
              lang: "ivrTosms",
              code: "9",
            },
            {
              lang: "smsToivr",
              code: "C2IVR",
            },
          ],
          ivrCampFlowData: {
            flow: {
              language_local: ["en"],
              language: [{actions:[]}],
              selectedLanguages: [],
              // flow_type: "PARALLEL_CH_FLOW",
              flow_type: "SINGLE_CH_FLOW",
              defaultLanguage: "_E",
              languageChange: [],
              channel: [],
              channel_local: [],
              channelChange: [],
              // input: {},
              main_file: {
                ivr: {},
                sms: {},
              },
              actionType: {
                ivr: "PLAY",
                sms: "SCHEDULE_SMS",
              },
              actions: [],
              waitTime:'',
              repeat: {
                value: false,
                dtmf: 0,
                audio_file: [],
              },
            },
          },
        };
      case "SET_LANGUAGE":
        // console.log("store : 2");
        const IvrFlowlang = { ...state, ...action.nState };
        return IvrFlowlang;
      case "SET_REPEAT":
        // const repeatState = { ...state, ...action.nState }
        // console.log("0000000000000000000, ", action.nState, "state", state)
        const ls1 = state;
        ls1.ivrCampFlowData.flow.repeat.value =
          action.nState.ivrCampFlowData.flow.repeat.value;
        return ls1;

      case "SET_DTMF_SUB":
        // console.log("store : 3");
        // console.log("%csub_audio_dtmfCount", 'background: pink; color: #bada55', action)
        const sdb_ls = state;
        // console.log("ssss", sdb_ls, store)
        const path = action.nState[0].id.split("_");
        sdb_ls.ivrCampFlowData.flow.actions[path[0] - 1].actions =
          action.nState;
        sdb_ls.ivrCampFlowData.flow.actions[path[0] - 1].dtmf_count =
          action.nState.length;
        const subdtmf = { ...state, ...sdb_ls };
        return subdtmf;

      case "SET_DTMF_MAIN":
        debugger;
        // console.log("store : 4");
        // console.log("%caction", 'background: #222; color: #bada55', action);
        const lc = state;

        // console.log("GENERATING ", action.nState.ivrCampFlowData.flow.main_audio_dtmfCount, "DTMF CARDS FOR MAIN LEVEL");

        let oldNumOfCards = 0;
        if (
          lc.ivrCampFlowData.flow.actions &&
          lc.ivrCampFlowData.flow.actions.length > 0
        ) {
          oldNumOfCards = lc.ivrCampFlowData.flow.actions.length;
        }

        const newNumOfCards =
          action.nState.ivrCampFlowData.flow.main_audio_dtmfCount;

        if (newNumOfCards >= oldNumOfCards) {
          let languageSelect = {};
          lc.ivrCampFlowData.flow.languageChange.map((e) => {
            languageSelect[e] = "";
          });
          //push blank dtmf cards into the array
          genArray(newNumOfCards - oldNumOfCards).map((e) => {
            lc.ivrCampFlowData.flow.actions.push({
              input: {
                ivr_key: oldNumOfCards + e,
                sms_key: "",
              },
              sms: "",
              file: {
                ivr: languageSelect,
                sms: languageSelect,
              },
              actionType: {
                ivr: "",
                sms: "",
              },
              node_type: "PROCESSING",
              dtmf_key: oldNumOfCards + e,
              audio_file: {},
              type: "PLAY",
              level: 1,
              waitTime: "",
              dtmf_count: 0,
              actions: [],
              action_tag: "",

              id: oldNumOfCards + e,
              repeat: {
                value: false,
                dtmf: 0,
                audio_file: [],
              },
            });
          });
        } else {
          //delete cards from the end of the array
          for (var i = 0; i < oldNumOfCards - newNumOfCards; i++)
            lc.ivrCampFlowData.flow.actions.pop();
        }
        // console.log(" LC ---> ", lc);
        const dtmfMain = { ...state, ...lc };
        return dtmfMain;

      case "SET_DTMF_TYPE":
        // console.log("store : 5");
        // console.log("%cDTMF TYPE CHANGE", 'background: pink; color: #bada55', action)
        const dtmfType = { ...state };
        return dtmfType;

      case "SET_MAIN_AUDIO_FILE":
        // console.log("%cSET_MAIN_AUDIO_FILE", 'background: pink; color: #bada55', action)
        const mainAudioFile = { ...state };
        return mainAudioFile;

      default:
        throw new Error();
    }
  }, initialState);
  const [campaignName, setCampaignName] = useState(null);
  const [campaignSchedulePriority, setCampaignSchedulePriority] =
    useState(null);

  return (
    <Provider
      value={{
        state,
        dispatch,
        campaignName,
        setCampaignName,
        campaignSchedulePriority,
        setCampaignSchedulePriority,
      }}
    >
      {children}
    </Provider>
  );
};

const genArray = (n) => {
  return Array(n)
    .fill()
    .map((x, i) => i + 1);
};

export { store, StateProvider };
