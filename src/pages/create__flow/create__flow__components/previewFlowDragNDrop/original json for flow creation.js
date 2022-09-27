const data = [
  {
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
        language: [
          {
            level: 0,
            node_type: "LANG_SELECTION",
            id: "0",
            actions: [
              {
                id: "0_5",
                input: {
                  ivr_key: 1,
                  sms_key: "",
                },
                language: "_H",
                languageName: "Hindi",
                lang_file: {
                  ivr: "",
                  sms: "",
                },
                actionType: {
                  ivr: "PLAY",
                  sms: "HITURL_SMS",
                },
                action_delay_min: 0,
                repeatCount: 0,
                waitTime: "1",
              },
              {
                id: "0_5",
                input: {
                  ivr_key: 2,
                  sms_key: "",
                },
                language: "_E",
                languageName: "English",
                lang_file: {
                  ivr: "",
                  sms: "",
                },
                actionType: {
                  ivr: "PLAY",
                  sms: "HITURL_SMS",
                },
                action_delay_min: 0,
                repeatCount: 0,
                waitTime: "2",
              },
              {
                id: "0_5",
                input: {
                  ivr_key: 2,
                  sms_key: "",
                },
                language: "_E",
                languageName: "arabic",
                lang_file: {
                  ivr: "",
                  sms: "",
                },
                actionType: {
                  ivr: "PLAY",
                  sms: "HITURL_SMS",
                },
                action_delay_min: 0,
                repeatCount: 0,
                waitTime: "2",
              },
              {
                id: "0_5",
                input: {
                  ivr_key: 2,
                  sms_key: "",
                },
                language: "_E",
                languageName: "spanish",
                lang_file: {
                  ivr: "",
                  sms: "",
                },
                actionType: {
                  ivr: "PLAY",
                  sms: "HITURL_SMS",
                },
                action_delay_min: 0,
                repeatCount: 0,
                waitTime: "2",
              },
            ],
          },
        ],
        selectedLanguages: [],
        flow_type: "SINGLE_CH_FLOW",
        defaultLanguage: "_E",
        languageChange: ["_H", "_E"],
        channel: "IVR",
        channel_local: [],
        channelChange: [],
        main_file: {
          ivr: {
            _H: "",
            _E: "",
          },
          sms: {
            _H: "",
            _E: "",
          },
          ussd: {},
        },
        actionType: {
          ivr: "PLAY",
          sms: "SCHEDULE_SMS",
          ussd: "HITURL_USSD",
        },
        actions: [
          {
            input: {
              ivr_key: 1,
              sms_key: "",
            },
            sms: "",
            file: {
              ivr: {
                _H: "",
                _E: "",
              },
              sms: {
                _H: "",
                _E: "",
              },
            },
            actionType: {
              ivr: "",
              sms: "",
            },
            node_type: "PROCESSING",
            dtmf_key: 1,
            audio_file: {},
            type: "PLAY",
            level: 1,
            waitTime: "4",
            dtmf_count: 2,
            actions: [
              {
                dtmf_key: 1,
                audio_file: {},
                parent_dtmf: 1,
                type: "PLAY",
                level: 2,
                waitTime: "5",
                url: "",
                dtmf_count: 0,
                actions: [],
                action_tag: "",
                sms: "",
                file: {
                  ivr: {
                    _H: "",
                    _E: "",
                  },
                  sms: {
                    _H: "",
                    _E: "",
                  },
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 1,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                id: "1_1",
                repeat: {
                  value: false,
                  dtmf: 0,
                  audio_file: [],
                  max_count: 0,
                },
              },
              {
                dtmf_key: 2,
                audio_file: {},
                parent_dtmf: 1,
                type: "PLAY",
                level: 2,
                waitTime: "6",
                url: "",
                dtmf_count: 0,
                actions: [],
                action_tag: "",
                sms: "",
                file: {
                  ivr: {
                    _H: "",
                    _E: "",
                  },
                  sms: {
                    _H: "",
                    _E: "",
                  },
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 2,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                id: "1_2",
                repeat: {
                  value: false,
                  dtmf: 0,
                  audio_file: [],
                  max_count: 0,
                },
              },
            ],
            action_tag: "",
            id: 1,
            repeat: {
              value: false,
              dtmf: 0,
              audio_file: [],
            },
          },
          {
            input: {
              ivr_key: 2,
              sms_key: "",
            },
            sms: "",
            file: {
              ivr: {
                _H: "",
                _E: "",
              },
              sms: {
                _H: "",
                _E: "",
              },
            },
            actionType: {
              ivr: "",
              sms: "",
            },
            node_type: "PROCESSING",
            dtmf_key: 2,
            audio_file: {},
            type: "PLAY",
            level: 1,
            waitTime: "7",
            dtmf_count: 1,
            actions: [
              {
                dtmf_key: 1,
                audio_file: {},
                parent_dtmf: 2,
                type: "PLAY",
                level: 2,
                waitTime: "8",
                url: "",
                dtmf_count: 0,
                actions: [],
                action_tag: "",
                sms: "",
                file: {
                  ivr: {
                    _H: "",
                    _E: "",
                  },
                  sms: {
                    _H: "",
                    _E: "",
                  },
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 1,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                id: "2_1",
                repeat: {
                  value: false,
                  dtmf: 0,
                  audio_file: [],
                  max_count: 0,
                },
              },
            ],
            action_tag: "",
            id: 2,
            repeat: {
              value: false,
              dtmf: 0,
              audio_file: [],
            },
          },
          {
            input: {
              ivr_key: 2,
              sms_key: "",
            },
            sms: "",
            file: {
              ivr: {
                _H: "",
                _E: "",
              },
              sms: {
                _H: "",
                _E: "",
              },
            },
            actionType: {
              ivr: "",
              sms: "",
            },
            node_type: "PROCESSING",
            dtmf_key: 3,
            audio_file: {},
            type: "PLAY",
            level: 1,
            waitTime: "7",
            dtmf_count: 1,
            actions: [
              {
                dtmf_key: 1,
                audio_file: {},
                parent_dtmf: 2,
                type: "PLAY",
                level: 2,
                waitTime: "8",
                url: "",
                dtmf_count: 0,
                actions: [{
                  dtmf_key: 1,
                  audio_file: {},
                  parent_dtmf: 2,
                  type: "PLAY",
                  level: 3,
                  waitTime: "8",
                  url: "",
                  dtmf_count: 0,
                  actions: [],
                  action_tag: "",
                  sms: "",
                  file: {
                    ivr: {
                      _H: "",
                      _E: "",
                    },
                    sms: {
                      _H: "",
                      _E: "",
                    },
                  },
                  node_type: "PROCESSING",
                  input: {
                    ivr_key: 1,
                    sms_key: "",
                  },
                  actionType: {
                    ivr: "",
                    sms: "",
                  },
                  id: "3_1",
                  repeat: {
                    value: false,
                    dtmf: 0,
                    audio_file: [],
                    max_count: 0,
                  },
                },],
                action_tag: "",
                sms: "",
                file: {
                  ivr: {
                    _H: "",
                    _E: "",
                  },
                  sms: {
                    _H: "",
                    _E: "",
                  },
                },
                node_type: "PROCESSING",
                input: {
                  ivr_key: 1,
                  sms_key: "",
                },
                actionType: {
                  ivr: "",
                  sms: "",
                },
                id: "3_1",
                repeat: {
                  value: false,
                  dtmf: 0,
                  audio_file: [],
                  max_count: 0,
                },
              },
            ],
            action_tag: "",
            id: 3,
            repeat: {
              value: false,
              dtmf: 0,
              audio_file: [],
            },
          },
        ],
        waitTime: "3",
        repeat: {
          value: false,
          dtmf: 0,
          audio_file: [],
        },
        flowName: "hello",
        main_audio_dtmfCount: 2,
      },
    },
  },
];

export default data;