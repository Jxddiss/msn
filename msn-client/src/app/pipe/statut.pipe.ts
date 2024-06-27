import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../constants/status.const';

@Pipe({
  name: 'statutPipe'
})
export class StatutPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const statut = value as string;
    if (Status.hasOwnProperty(statut.toUpperCase())) {
      return Status[statut.toUpperCase()];
    } else {
      return "bob";
    }
  }

}
