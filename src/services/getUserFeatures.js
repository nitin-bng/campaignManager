const getUserFeatures = (data) =>{
    let result = {
        IVR: {Outgoing: false, Incoming:false},
        USSD: {Outgoing: false, Incoming:false},
        SMS: {Outgoing: false, Incoming:false},
    }

    data.forEach(feature=>{
        if(feature.name === 'Voice'){
            feature.subFeature.forEach(subFeature=>{
                if(subFeature.name === 'ODB'){
                    result = {...result, IVR:{...result.IVR, Outgoing:true}}
                }
                if(subFeature.name === 'Incoming'){
                    result = {...result, IVR:{...result.IVR, Incoming:true}}
                }
            })
        }
        if(feature.name === 'USSD'){
            feature.subFeature.forEach(subFeature=>{
                if(subFeature.name === 'USSD'){
                    result = {...result, USSD:{...result.USSD, Outgoing:true}}
                }
            })
        }
        if(feature.name === 'SMS'){
            feature.subFeature.forEach(subFeature=>{
                if(subFeature.name === 'Outgoing'){
                    result = {...result, SMS:{...result.SMS, Outgoing:true}}
                }
                if(subFeature.name === 'Incoming'){
                    result = {...result, SMS:{...result.SMS, Incoming:true}}
                }
            })
        }
    })
    return result
}

export {getUserFeatures}