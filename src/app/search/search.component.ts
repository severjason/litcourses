import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Title} from '@angular/platform-browser';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  templateUrl: './search.component.html',
  providers: [ApiService],
})

export class SearchComponent implements OnInit {

  private _title = 'Find tracks from iTunes';
  public searchForm: FormGroup;
  public searchInput: AbstractControl;

  constructor(
    private _titleService: Title,
    private _apiService: ApiService,
    private _fb: FormBuilder) {

    this.searchForm = this.fb.group({'searchInput': ['', Validators.required]});

    this.searchInput = this.searchForm.controls['searchInput'];
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
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

  public onSubmit(value: any): void {
    console.log(value.searchInput);
    this.api.getTrackList(value.searchInput)
      .subscribe(
        res => {
          console.log(res);
          this.searchForm.controls['searchInput'].reset();
        },
        error => {
          console.log(error);
        }
      )
  }
}
