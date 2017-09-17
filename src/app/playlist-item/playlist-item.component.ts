import {Component, Input} from '@angular/core';
import {PlaylistItem} from '../playlist.item';

@Component({
  selector: 'app-playlist-item',
  templateUrl: './playlist-item.component.html',
  styleUrls: ['./playlist-item.component.css']
})
export class PlaylistItemComponent {
  @Input() playlistItem: PlaylistItem;
}
