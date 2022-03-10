import {Injectable} from '@angular/core';
import BaseStorageService from './base-storage.service';
import {EventManager} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends BaseStorageService{

  constructor() {
    super('ss', sessionStorage);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends BaseStorageService{

  constructor() {
    super('ls', localStorage);
  }
}

