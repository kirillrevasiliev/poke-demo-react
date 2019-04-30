import { createContext } from 'react';
import { Store } from './store';
import { Auth } from './auth';

export class RootStore {
  constructor() {
    this.store = new Store(this);
    this.auth = new Auth(this);
  }
}

export default createContext(new RootStore());
