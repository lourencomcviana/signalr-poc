import { TestBed } from '@angular/core/testing';

import { SessionStorageService } from './storage.service';

describe('SessionStorageService', () => {
  let service: SessionStorageService;
  const key = 'key';
  let formatedKey: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionStorageService);
    formatedKey = service.formatKey(key);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save item', () => {
    service.save(key, { obj: true });
    const saida = sessionStorage.getItem(formatedKey);
    expect(saida).toBeTruthy();
    expect(saida).toEqual( '{"obj":true}');
  });

  it('should load and Map', () => {
    const testOjbect = new TestObj();
    testOjbect.listEx = [1, 2];
    testOjbect.strEx = 'test';
    testOjbect.boolEx = true;
    // salva o objeto
    service.save(key, testOjbect);
    // carrega o objeto
    const saida = service.LoadAndMap(key, new TestObj());
    // realiza os testes
    expect(saida).toBeTruthy();
    const saidaObj = saida as TestObj;
    expect(saidaObj.strEx).toEqual(testOjbect.strEx);
    expect(saidaObj.boolEx).toEqual(testOjbect.boolEx);
    expect(saidaObj.listEx).toEqual(testOjbect.listEx);
  });

  class TestObj {
    public constructor(
    ) {
      this.boolEx = false;
      this.strEx = '';
      this.listEx = [];
    }
    public boolEx: boolean;
    public strEx: string;
    public listEx: number[];
  }
});
