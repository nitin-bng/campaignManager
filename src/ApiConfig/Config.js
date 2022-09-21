const config = {
    server: {
        // path: 'http://41.217.203.246',
        path: 'http://34.214.61.86',
        // path: 'http://localhost',
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



