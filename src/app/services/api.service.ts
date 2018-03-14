import {Injectable, SecurityContext} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class ApiService {

  private _apiUrl: string;

  static handleError(error: Response) {
    console.log(error.statusText || `Can't join the server.`);
    return Observable.throw(error.statusText);
  }

  constructor(
    private _http: Http,
    private _sanitizer: DomSanitizer) {
    this.apiUrl = 'https://itunes.apple.com/search?term=';
  }

  private get apiUrl(): string {
    return this._apiUrl;
  }

  private set apiUrl(newValue: string) {
    this._apiUrl = newValue;
  }

  private get http(): Http {
    return this._http;
  }

  private get sanitizer() {
    return this._sanitizer;
  }

  public getTrackList(artist: string): Observable<any> {
    return this.http.get(this.apiUrl + this.sanitizer.sanitize(SecurityContext.URL, artist))
      .map((res: Response) => res.json())
      .catch(ApiService.handleError);
  }
}
