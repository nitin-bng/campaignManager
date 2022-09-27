const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';


const createNodesAndEdges = (data) =>{
    console.log("rishabh data", data);
    let initialNodes = [
        {
          id: "0",
          type: "input",
          data: { label: "hello" },
          position
        },
      ];
      let initialEdges = []
      
      if (data.ivrCampFlowData.flow.language[0].actions.length !== 0) {
        data.ivrCampFlowData.flow.language[0].actions.forEach((element, idx) => {
          console.log("ele", element, idx);
          initialNodes = [...initialNodes, {
            id: element.id+"_"+idx,
            type: "processing",
            data: { label: element.languageName + "language node"},
            position
          }];
            initialEdges = [...initialEdges,   { id: 'e0'+element.id+"_"+idx, source: '0', target: element.id+"_"+idx, type: edgeType}]    
          console.log("initial", initialNodes);
          data.ivrCampFlowData.flow.actions.forEach((ele, index)=>{
                initialEdges = [...initialEdges,  {id: 'e'+element.id+"_"+idx+ele.level+"_"+ele.dtmf_key+"_"+index, source: element.id+"_"+idx, target: ele.level+"_"+ele.dtmf_key+"_"+index, type: edgeType}]
          })
        });
      }

      const recursiveFunc = (element, idx, proprandom) =>{
        element.actions.forEach((ele, index)=>{
          let randomness = Math.random()
          initialNodes = [...initialNodes, {
          id: ele.level+"_"+ele.dtmf_key+"_"+index+randomness,
          type: "processing",
          data: { label:"DTMF"+ ele.id },
          position
      }];
      initialEdges = [...initialEdges,  {id: 'e'+element.level+"_"+element.dtmf_key+"_"+idx+proprandom+ele.level+"_"+ele.dtmf_key+"_"+index+randomness, source: element.level+"_"+element.dtmf_key+"_"+idx+proprandom, target: ele.level+"_"+ele.dtmf_key+"_"+index+randomness, type: edgeType}]
      if(ele.actions.length){
        recursiveFunc(ele, index, randomness)
      }

    })}
      if(data.ivrCampFlowData.flow.actions.length !== 0){
        data.ivrCampFlowData.flow.actions.forEach((element, idx)=>{
            initialNodes =  [...initialNodes, {
            id: element.level+"_"+element.dtmf_key+"_"+idx,
            type: "processing",
            data: { label:"DTMF"+ element.dtmf_key },
            position
          }];
        if(element.actions.length){
          recursiveFunc(element, idx, '')
        }
    })
        }
        

return {initialNodes, initialEdges}
}


export {createNodesAndEdges}

  