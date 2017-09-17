import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {PlaybackService} from '../playback.service';

@Component({
  selector: 'app-pcmview',
  templateUrl: './pcmview.component.html',
  styleUrls: ['./pcmview.component.css']
})
export class PcmviewComponent implements OnInit, OnDestroy {
  private _subPlaybackBuffer: Subscription;
  private _audioBuffer: AudioBuffer;

  @ViewChild('pcmview') canvasRef: ElementRef;

  constructor(private playbackService: PlaybackService) {
  }

  ngOnInit() {
    this._subPlaybackBuffer = this.playbackService.buffer.subscribe(this.onPlaybackBufferChange.bind(this));
  }

  ngOnDestroy() {
    this._subPlaybackBuffer.unsubscribe();
  }

  private onPlaybackBufferChange(buffer: AudioBuffer) {
    this._audioBuffer = buffer;
    this.drawCanvas();
  }

  private drawCanvas() {
    if (!this.canvasRef) {
      return;
    }

    const ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    const {height, width} = this.canvasRef.nativeElement.getBoundingClientRect();

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    if (this._audioBuffer) {
      const lineLimit = 2048;
      const pcmData = this._audioBuffer.getChannelData(0);
      const pcmLength = pcmData.length;
      const blockSize = Math.floor(pcmLength / lineLimit);
      const lineGap = width / lineLimit;

      ctx.strokeStyle = 'rgb(37,56,102)';
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(0, height / 2);
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let i = 0; i < lineLimit; i++) {
        const audioBufferKey = Math.floor(blockSize * i);
        const x = lineGap * i;
        const y = pcmData[audioBufferKey] * height / 2;

        ctx.moveTo(x, y);
        ctx.lineTo(x, (y * -1));
      }
    }

    ctx.stroke();
    ctx.restore();
  }
}
