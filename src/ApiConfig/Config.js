const config = {
    server: {
        path: 'http://34.214.61.86',
        port: ':5000',
        port2: ':5002',
        port1: ':8085', // login Api port
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



