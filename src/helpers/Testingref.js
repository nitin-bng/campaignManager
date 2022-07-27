import React,{useContext, useEffect, useRef} from 'react'

const levelStartRefs = useRef([]);
const arr = [1,2,3,4,5]
const levelStartInput = (item, idxx) => {
  return (
    <div
      className="flex justify-center relative mb-1"
      ref={(el) => {
        levelStartRefs.current[idxx] = el;
      }}
    >
      <div className="flex justify-center ">
        {/** levelStart dropdown button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dropdownPopoverBotLossPer
              ? closeDropdownPopoverBotLossPer()
              : openDropdownPopoverBotLossPer();
          }}
          className="focus:outline-none"
        ></button>
      </div>

      {/** levelStart drpodown */}
      <div className="top-11 ">
        <input
          type="number"
          className={
            "bg-white border w-24 px-1 border-gray-300 text-base z-50 float-center py-2 list-none text-center rounded focus:outline-none"
          }
          id="levelStart"
          value={item.levelStart}
          autoFocus
          onChange={(event) => {
            let newJsonEntry;
            item.levelStart = parseInt(event.target.value);
            newJsonEntry = {
              level: item.level,
              levelStart: parseInt(event.target.value),
              levelEnd: item.levelEnd,
              botLossPer: item.botLossPer,
              levelExpendPer: item.levelExpendPer,
              actionLossPer: item.actionLossPer,
              newBotLossPer: item.newBotLossPer,
            };
            if (resultInfom && resultInfom.length === 0) {
              setResultInfom([...resultInfom, newJsonEntry]);
            } else {
              const existingJson = resultInfom.find((itmm) => {
                return itmm.userId === item.userId;
              });

              if (existingJson) {
                const newJsnIdx = resultInfom.indexOf(existingJson);
                if (newJsnIdx !== -1) {
                  const cpyArr = JSON.parse(JSON.stringify(resultInfom));
                  item.levelStart = parseInt(event.target.value);
                  newJsonEntry = {
                    level: item.level,
                    levelStart: parseInt(event.target.value),
                    levelEnd: item.levelEnd,
                    botLossPer: item.botLossPer,
                    levelExpendPer: item.levelExpendPer,
                    actionLossPer: item.actionLossPer,
                    newBotLossPer: item.newBotLossPer,
                  };

                  cpyArr[newJsnIdx] = newJsonEntry;
                  setResultInfom(cpyArr);
                }
              } else {
                setResultInfom([...resultInfom, newJsonEntry]);
              }
            }
          }}
        />
      </div>
    </div>
  );
};
