import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Title} from '@angular/platform-browser';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './search.component.html',
  providers: [ApiService],
})

export class SearchComponent implements OnInit {

  private _title = 'Tracks search app';
  private _trackList: any[];
  private _trackListReceived: boolean;
  private _loading: boolean;
  private _error = {
    status: false,
    message: '',
  };

  public searchForm: FormGroup;
  public searchInput: AbstractControl;

  constructor(private _titleService: Title,
              private _apiService: ApiService,
              private _fb: FormBuilder) {

    this.searchForm = this.fb.group({'searchInput': ['', Validators.required]});
    this.searchInput = this.searchForm.controls['searchInput'];
    this._loading = false;
    this._trackListReceived = false;
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.clearTrackList();
  }

  private get fb(): FormBuilder {
    return this._fb;
  }

  private get titleService(): Title {
    return this._titleService;
  }

  private get title(): string {
    return this._title;
  }

  private get api(): ApiService {
    return this._apiService;
  }

  private loaded(): void {
    this._loading = false;
  }

  private loading(): void {
    this._loading = true;
  }

  private saveTrackList(trackList: any): void {
    this._trackListReceived = true;
    this._trackList = trackList.map((res) => {
      return {
        trackId: res.trackId,
        artistName: res.artistName,
        collectionName: res.collectionName,
        collectionPrice: res.collectionPrice,
        artworkUrl100: res.artworkUrl100,
        primaryGenreName: res.primaryGenreName,
        opened: false,
        trackName: res.trackName,
        trackCount: res.trackCount,
        trackPrice: res.trackPrice,
        trackTimeMillis: res.trackTimeMillis
      }
    })
  }

  private setError(message: string): void {
    this._error = {
      status: true,
      message: message,
    }
  }

  private clearError(): void {
    this._error = {
      status: false,
      message: '',
    }
  }

  private clearTrackList(): void {
    this._trackList = [];
    this._trackListReceived = false;
  }

  public clearInput(): void {
    this.searchForm.controls['searchInput'].reset();
  }

  public noError(): boolean {
    return !this._error.status;
  }

  public showErrorMessage(): string {
    return this._error.message;
  }

  public isLoading(): boolean {
    return this._loading;
  }

  public trackListReceived(): boolean {
    return this._trackListReceived;
  }

  public noTracks(): boolean {
    return this._trackListReceived && this._trackList.length === 0;
  }

  public getTrackList(): any[] {
    return this._trackList;
  }

  public onSubmit(value: any): void {
    this.clearTrackList();
    this.clearError();
    this.loading();
    this.api.getTrackList(value.searchInput)
      .subscribe(
        res => {
          this.loaded();
          this.saveTrackList(res.results);
          this.clearInput();
        },
        error => {
          this.loaded();
          this.setError(error.statusText || 'Can`t join the server');
          this.clearInput();
        }
      )
  }

  public toggleInfo(track: any): void | boolean {
    if (track.opened === true) {
      track.opened = false;
      return false;
    }
    this.getTrackList().map((trackFromList: any) => {
      return (track.trackId === trackFromList.trackId) ? trackFromList.opened = true : trackFromList.opened = false;
    });
  }
}
