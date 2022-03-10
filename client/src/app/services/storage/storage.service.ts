import {Injectable} from '@angular/core';
import BaseStorageService from './base-storage.service';
import {EventManager} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService extends BaseStorageService{

  constructor(eventManger: EventManager) {
    super('ss', sessionStorage, eventManger);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends BaseStorageService{

  constructor(eventManger: EventManager) {
    super('ls', localStorage, eventManger);
  }
}

