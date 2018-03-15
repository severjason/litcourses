import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Title} from '@angular/platform-browser';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [ApiService],
})

export class SearchComponent implements OnInit {

  private _title = 'Find tracks from iTunes';
  private _trackList: any;
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
    this._trackList = {
      resultCount: trackList.resultCount,
      results: trackList.results.map((res) => {
        return {
          artistName: res.artistName,
          artworkUrl100: res.artworkUrl100,
          collectionName: res.collectionName,
          collectionPrice: res.collectionPrice,
          primaryGenreName: res.primaryGenreName,
          trackName: res.trackName,
          trackCount: res.trackCount,
          trackPrice: res.trackPrice,
          trackTimeMillis: res.trackTimeMillis,
        }
      })
    }
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
    this._trackList = {}
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

  public noTracks(): boolean {
    return this._trackList.resultCount === 0;
  }

  public getTrackList(): any[] {
    return this._trackList.results;
  }

  public onSubmit(value: any): void {
    this.clearTrackList();
    this.clearError();
    this.loading();
    this.api.getTrackList(value.searchInput)
      .subscribe(
        res => {
          this.loaded();
          this.saveTrackList(res);
          console.log(this.getTrackList());
          this.searchForm.controls['searchInput'].reset();
        },
        error => {
          this.loaded();
          this.setError(error.statusText || 'Can`t join the server');
        }
      )
  }
}
