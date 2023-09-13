import { Covenant } from './covenant.model';

export class CounterParty {
  idCounterparty!: number;
  name!: string;
  email!: string;
  phoneNumber!: string;
  covenants!: Array<Covenant>;
}
