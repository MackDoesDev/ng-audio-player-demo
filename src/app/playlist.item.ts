export class PlaylistItem {
  public readonly file: File;
  public readonly itemId: number;

  constructor(file: File, itemId: number) {
    this.file = file;
    this.itemId = itemId;
  }
}
