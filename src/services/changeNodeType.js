const changeNodeType = (actions) =>  actions.map(obj=>{
        if(obj.actions.length){
            obj = {...obj, node_type: "PROCESSING", actions: changeNodeType(obj.actions)}
        }
        else{
            obj = {...obj, node_type: "LEAF"}
        }
        return obj
    })

export {changeNodeType}