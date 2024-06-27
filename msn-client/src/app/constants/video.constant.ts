export const peerConnectionConfig : RTCConfiguration = {
    iceServers: [
        {
            urls: "stun:stun1.l.google.com:19302"
        },
        {
            urls:'turn:relay1.expressturn.com:3478',
            username:'ef8EOWQXK1M7HXY1AI',
            credential:'mor3P6U6DOFc1r3R'
        }
    ],
    bundlePolicy:"max-compat"
};