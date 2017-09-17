import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

export enum PlaybackState {
  IDLE = 0,
  LOADING = 1,
  LOADED = 2,
  PLAYING = 3,
  PAUSED = 4,
  STOPPED = 5,
  FINISHED = 6
}

@Injectable()
export class PlaybackService {

  private _ctx: AudioContext;
  private _buffer: AudioBuffer;
  private _source: AudioBufferSourceNode;
  private _isPlaying = false;
  private _isStopped = false;
  private _progOffset = 0;
  private _progStart = 0;

  private _bufferSubject: BehaviorSubject<AudioBuffer> = new BehaviorSubject(this._buffer);
  private _stateSubject: BehaviorSubject<PlaybackState> = new BehaviorSubject(PlaybackState.IDLE);

  public readonly buffer: Observable<AudioBuffer> = this._bufferSubject.asObservable();
  public readonly state: Observable<PlaybackState> = this._stateSubject.asObservable();
  public readonly analizer: AnalyserNode;

  constructor() {
    this._ctx = new AudioContext();
    this.analizer = this._ctx.createAnalyser();
    this.analizer.smoothingTimeConstant = 0.7;
    this.analizer.fftSize = 512;
    this.analizer.connect(this._ctx.destination);
  }

  public setAudioFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      this._ctx.decodeAudioData(event.target.result, this.initBuffer.bind(this));
    };
    fileReader.readAsArrayBuffer(file);
    this._stateSubject.next(PlaybackState.LOADING);
  }

  public start() {
    if (!this._buffer || this._isPlaying) {
      return;
    }

    this.initSource();
    this._source.start(0, this._progOffset);
    this._progStart = Date.now();
    this._isPlaying = true;
    this._isStopped = false;
    this._stateSubject.next(PlaybackState.PLAYING);
  }

  public stop(pause?: boolean) {
    if (!this._isPlaying) {
      return;
    }

    this._isPlaying = false;
    this._isStopped = true;
    this._source.stop(0);

    if (pause) {
      this._progOffset = (Date.now() - this._progStart) / 1000 + this._progOffset;
      this._stateSubject.next(PlaybackState.PAUSED);
    } else {
      this._progOffset = 0;
      this._stateSubject.next(PlaybackState.STOPPED);
    }
  }

  public pause() {
    this.stop(true);
  }

  private initBuffer(buffer: AudioBuffer) {
    let autoStart = false;
    if (this._isPlaying) {
      autoStart = true;
      this.stop(false);
    }

    this._buffer = buffer;
    this._bufferSubject.next(this._buffer);
    this._stateSubject.next(PlaybackState.LOADED);

    if (autoStart) {
      this.start();
    }
  }

  private initSource() {
    if (this._source) {
      this._source.disconnect(this.analizer);
    }

    this._source = this._ctx.createBufferSource();
    this._source.buffer = this._buffer;
    this._source.onended = this.onSourceEnded.bind(this);
    this._source.connect(this.analizer);
  }

  private onSourceEnded() {
    if (!this._isStopped) {
      this._progOffset = 0;
      this._stateSubject.next(PlaybackState.FINISHED);
    }
    this._isPlaying = false;
  }

}
