import {Component} from '@angular/core';

import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.css']
})
export class DropzoneComponent {

  constructor(private playlist: PlaylistService) {
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    // @todo: handle file drops with wrong mimetype
    /*for (let i = 0; i < files.length; i++) {
     const file = files.item(i);

     if (file.type !== 'audio/mp3') {
     console.error('Not a MP3!!!');
     }
     }*/

    this.playlist.addItems(files);
  }

}
