import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {PlaylistService} from '../playlist.service';
import {PlaylistItem} from '../playlist.item';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public items: PlaylistItem[];

  constructor(private playlistService: PlaylistService) {
  }

  ngOnInit() {
    this.subscription = this.playlistService.files.subscribe(this.onFilesChange.bind(this));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFilesChange(files: PlaylistItem[]) {
    this.items = files;
  }

}
