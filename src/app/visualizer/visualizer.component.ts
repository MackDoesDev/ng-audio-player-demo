import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {PlaybackService} from '../playback.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {
  private _analizer: AnalyserNode;
  private _ctx: CanvasRenderingContext2D;
  private _dataArray: Uint8Array;
  private _bufferLength: number;

  @ViewChild('visualizer') canvasRef: ElementRef;

  constructor(private playbackService: PlaybackService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this._ctx = this.canvasRef.nativeElement.getContext('2d');

    const gradient = this._ctx.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(1, 'rgba(91,141,255,.9)');
    gradient.addColorStop(0, 'rgba(37,56,102,.2)');

    this._ctx.fillStyle = gradient;

    this._analizer = this.playbackService.analizer;
    this._bufferLength = this._analizer.frequencyBinCount;
    this._dataArray = new Uint8Array(this._bufferLength);

    this.ngZone.runOutsideAngular(() => this.paintCanvas());
  }

  private paintCanvas() {
    const width = 960;
    const height = 128;
    const barWidth = 1.8; // ((width / 2) / this._bufferLength);
    let barHeight, x1 = 0, x2 = width;

    this._analizer.getByteFrequencyData(this._dataArray);
    this._ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this._bufferLength; i++) {
      x2 -= barWidth + 0.2;
      barHeight = this._dataArray[i] / 2;
      this._ctx.fillRect(x1, height - barHeight, barWidth, barHeight);
      this._ctx.fillRect(x2, height - barHeight, barWidth, barHeight);
      x1 += barWidth + 0.2;
    }

    requestAnimationFrame(this.paintCanvas.bind(this));
  }

}
