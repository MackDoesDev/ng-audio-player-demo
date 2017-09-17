import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PlaylistService} from './playlist.service';
import {DropzoneComponent} from './dropzone/dropzone.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlayerComponent} from './player/player.component';
import {PlaybackService} from './playback.service';
import { PcmviewComponent } from './pcmview/pcmview.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { PlaylistItemComponent } from './playlist-item/playlist-item.component';

@NgModule({
  declarations: [
    AppComponent,
    DropzoneComponent,
    PlaylistComponent,
    PlayerComponent,
    PcmviewComponent,
    VisualizerComponent,
    PlaylistItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [PlaylistService, PlaybackService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
