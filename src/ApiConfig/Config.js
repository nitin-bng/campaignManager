const config = {
    server: {
        // path: 'http://41.217.203.246',
        path: 'http://34.214.61.86',
        _port1: ":5001",
        get port1() {
            return this._port1
        },
        set port1(value) {
            this._port1 = value
        },
        port2: ':5002',
        port3: ':8087',  // login Api port
    },
    api: {
        login: '/login',
        signUp: '/user/signup',
        getOtp: '/user/sendotp',
        verifyOtp: '/user/verify?phoneNumber',
        getFeature: '/features',
        setOperator: '/operator/all',
        forgotpassword : '/forgotpassword',
        createUserConfig: '/update/config/',
        createFlow: '/bng/ui/',
        createFlowWithoutContent: '/bng/ui/flow?isContent=false',
    }
}
export default config





// http://41.217.203.246:5001/cm/wf/reloadFlowCache