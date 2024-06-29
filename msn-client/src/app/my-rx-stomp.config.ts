import { RxStompConfig } from '@stomp/rx-stomp';

export const myRxStompConfig: RxStompConfig = {
    brokerURL: 'ws://api.nicholsonrj.com/ws',
  
    heartbeatIncoming: 0, 
    heartbeatOutgoing: 0, 

    reconnectDelay: 200,
  
    // Will log diagnostics on console
    // It can be quite verbose, not recommended in production
    // Skip this key to stop logging to console
    debug: (msg: string): void => {
      console.log( msg);
    }
  };