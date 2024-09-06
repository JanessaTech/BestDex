import type ConfigType from "./config.types";

const defautConfig: ConfigType = {
    env: 'mainnet',
    SignInEth: 'Sign in with Ethereum to BEST DEX written by JanessaTech. Email:janessatech.web3@gmail.com',
    BACKEND_ADDR: "http://localhost:3100",
    multer: {
        profileSize: 1048576, // less than 1M,
        fileTypes: /jpeg|jpg|png|gif/,  // file types accepted
        acceptedImageTypes: ['image/gif', 'image/jpeg', 'image/png'],
        profileFieldPrefix:'profile',
    },
}

export default defautConfig