const config = {
    server: {
        path: 'http://34.214.61.86',
        port: ':5000',
        port1: ':8085'  // login Api port
    },
    api: {
        login: '/login',
        signUp: '/user/signup',
        getOtp: '/user/sendotp',
        verifyOtp: '/user/verify?phoneNumber',
        getFeature: '/features',
        setOperator: '/operator/all',
        forgotpassword : '/forgotpassword',
        createUserConfig: '/update/config/'
    }
}
export default config

