import { REGEX_PRE_REGISTRY } from '../models';

export class RegexEngine {
  private readonly REGISTRY_KEY = '__REGEX_ENGINE_REGISTRY__';

  constructor() {
    if (!globalThis[this.REGISTRY_KEY]) {
      globalThis[this.REGISTRY_KEY] = new Map<string, string>();
    }
    Object.defineProperties(this, REGEX_PRE_REGISTRY);
  }

  // private get _store(): Map<string, string> {
  //   return globalThis[this.REGISTRY_KEY];
  // }
}
