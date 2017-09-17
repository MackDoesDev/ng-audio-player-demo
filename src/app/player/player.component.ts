import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {PlaylistService} from '../playlist.service';
import {PlaylistItem} from '../playlist.item';
import {PlaybackService, PlaybackState} from '../playback.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  private _subPlaylistCurrentItem: Subscription;
  private _subPlaybackBuffer: Subscription;
  private _subPlaybackState: Subscription;

  public currentTitle = '';
  public currentDuration = 0;
  public currentSampleRate = 0;
  public isStereo = false;

  public classesPlayButton = {
    'fa': true,
    'fa-play': true,
    'fa-pause': false
  };

  constructor(private playlistService: PlaylistService,
              private playbackService: PlaybackService) {
  }

  ngOnInit() {
    this._subPlaylistCurrentItem = this.playlistService.currentFile.subscribe(this.onPlaylistCurrentItemChange.bind(this));
    this._subPlaybackBuffer = this.playbackService.buffer.subscribe(this.onPlaybackBufferChange.bind(this));
    this._subPlaybackState = this.playbackService.state.subscribe(this.onPlaybackStateChange.bind(this));
  }

  ngOnDestroy() {
    this._subPlaylistCurrentItem.unsubscribe();
    this._subPlaybackState.unsubscribe();
  }

  onTogglePlay() {
    if (this.classesPlayButton['fa-play']) {
      this.playbackService.start();
      this.classesPlayButton['fa-play'] = false;
      this.classesPlayButton['fa-pause'] = true;
    } else {
      this.playbackService.pause();
      this.classesPlayButton['fa-play'] = true;
      this.classesPlayButton['fa-pause'] = false;
    }
  }

  onStop() {
    this.playbackService.stop();
  }

  onSkipForward() {
    this.playlistService.skipOneForward();
  }

  onSkipBackward() {
    this.playlistService.skipOneBackward();
  }

  private onPlaylistCurrentItemChange(item: PlaylistItem) {
    if (!item) {
      return;
    }

    this.currentTitle = item.file.name;
    this.playbackService.setAudioFile(item.file);
  }

  private onPlaybackBufferChange(buffer: AudioBuffer) {
    if (!buffer) {
      return;
    }

    this.currentDuration = buffer.duration;
    this.currentSampleRate = buffer.sampleRate;
    this.isStereo = buffer.numberOfChannels >= 2;
  }

  private onPlaybackStateChange(state: PlaybackState) {

  }
}
