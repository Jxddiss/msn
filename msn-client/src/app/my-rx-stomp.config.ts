import { inject } from '@angular/core';
import { RxStompConfig } from '@stomp/rx-stomp';
import { AuthentificationService } from './service/authentification.service';

export const myRxStompConfig: RxStompConfig = {
    brokerURL: 'ws://localhost:8080/ws',
  
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