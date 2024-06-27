import { myRxStompConfig } from './my-rx-stomp.config';
import { RxStompService } from './service/rx-stomp.service';

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}