const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';


const createNodesAndEdges = (data) =>{
    let initialNodes = [
        {
          id: '0',
          type: 'output',
          data: {label: data.ivrCampFlowData.flow.flowName},
          position,
          style: {
            background: '#2B6CB0',
            color: 'white',
          },
        },
        {
          id: "1",
          type: "processing",
          data: {label: `Welcome ${data.ivrCampFlowData.flow.language[0].actions.length > 1 ? '& Language Selection' : ''} Node`},
          position
        },
      ];
      let initialEdges = [{ id: 'flowName', source: '0', target: '1', type: edgeType}]
      let lastNodes = []
      
      if (data.ivrCampFlowData.flow.language[0].actions.length !== 0) {
        data.ivrCampFlowData.flow.language[0].actions.forEach((element, idx) => {
          initialNodes = [...initialNodes, {
            id: element.id+"_"+idx,
            type: "processing",
            data: { label: data.ivrCampFlowData.flow.language[0].actions.length > 1 ? `Response In ${element.languageName}` : element.languageName},
            position,
            style: {
              background: 'red',
              color: 'white',
            },
          }];
            initialEdges = [...initialEdges,   { id: 'e0'+element.id+"_"+idx, source: '1', target: element.id+"_"+idx, type: edgeType, label: element.input[data.ivrCampFlowData.flow.channel.toLowerCase() +'_key']}]
            lastNodes = [...lastNodes, element.id+"_"+idx]    
          data.ivrCampFlowData.flow.actions.forEach((ele, index)=>{
                initialEdges = [...initialEdges,  {id: 'e'+element.id+"_"+idx+ele.level+"_"+ele.dtmf_key+"_"+index, source: element.id+"_"+idx, target: ele.level+"_"+ele.dtmf_key+"_"+index, type: edgeType, label: ele.input[data.ivrCampFlowData.flow.channel.toLowerCase() +'_key']}]
          })
        });
      }

      const recursiveFunc = (element, idx, proprandom) =>{
        element.actions.forEach((ele, index)=>{
          let randomness = Math.random()
          initialNodes = [...initialNodes, {
          id: ele.level+"_"+ele.dtmf_key+"_"+index+randomness,
          type: "processing",
          data: { label:"Option "+ ele.id +` [${ele.type}]` },
          position,
          
      }];
      initialEdges = [...initialEdges,  {id: 'e'+element.level+"_"+element.dtmf_key+"_"+idx+proprandom+ele.level+"_"+ele.dtmf_key+"_"+index+randomness, source: element.level+"_"+element.dtmf_key+"_"+idx+proprandom, target: ele.level+"_"+ele.dtmf_key+"_"+index+randomness, type: edgeType, label: ele.input[data.ivrCampFlowData.flow.channel.toLowerCase() +'_key']}]
      if(ele.actions.length){
        recursiveFunc(ele, index, randomness)
      }else{
        lastNodes = [...lastNodes, ele.level+"_"+ele.dtmf_key+"_"+index+randomness]
      }

    })}
      if(data.ivrCampFlowData.flow.actions.length !== 0){
        lastNodes = []
        data.ivrCampFlowData.flow.actions.forEach((element, idx)=>{
            if(element.node_type !== 'END'){
              initialNodes =  [...initialNodes, {
              id: element.level+"_"+element.dtmf_key+"_"+idx,
              type: "processing",
              data: { label:"Option "+ element.dtmf_key + ` [${element.type}]` },
              position,
              style: {
                background: 'yellow',
                color: 'black',
              },
              }];
            if(element.actions.length){
              recursiveFunc(element, idx, '')
            }else{
              lastNodes = [...lastNodes, element.level+"_"+element.dtmf_key+"_"+idx]
        }}
    })
        }

    if(data.ivrCampFlowData.flow.actions.find(item=>item.node_type === 'END')){
      initialNodes = [...initialNodes, 
        {
          id: '2',
          type: "processing",
          data: {label: `Thank you Node`},
          position,
          // style: {
          //   background: '#2B6CB0',
          //   color: 'red',
          // },
        },
      ]

      for(let i=0; i<lastNodes.length; i++){
        initialEdges = [...initialEdges,   { id: initialEdges.length +1, source: lastNodes[i], target: '2', type: edgeType}] 
      }
    }
        

return {initialNodes, initialEdges}
}


export {createNodesAndEdges}

  