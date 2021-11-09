export default abstract class BaseStorageService {
  protected constructor(private prefix: string, protected storage: Storage) {
  }

  public static Map<T  extends object>(source: any, destination: any): T {
    if (!source ) {
      throw new Error('source must be an instance of an object');
    }
    if (!destination ) {
      throw new Error('destination must be an instance of an object');
    }
    if (typeof source !== typeof destination) {
      throw new Error('destination and source must implement the same type');
    }
    const keys = Object.keys(source);
    keys.forEach(key => {
      destination[key] = (source as any)[key] ;
    });
    return destination;
  }

  public save(key: string, obj: any): void {
    this.storage.setItem(this.formatKey(key), JSON.stringify(obj));
  }

  public load(key: string): any | undefined {
    const itemStr = this.storage.getItem(this.formatKey(key));
    if (itemStr) {
      try{
        return JSON.parse(itemStr);
      } catch (e) {
        return itemStr;
      }
    }
  }

  public delete(key: string): void {
    this.storage.removeItem(this.formatKey(key));
  }

  public LoadAndMap<T  extends object>(key: string, destination: T): T | undefined {
    const source = this.load(key);
    if (!source) {
      return undefined;
    }
    return BaseStorageService.Map(source, destination) as T;
  }

  public formatKey(key: string): string {
    return `${this.prefix}_${key}`;
  }
}
