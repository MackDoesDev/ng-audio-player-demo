import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {PlaylistItem} from './playlist.item';

@Injectable()
export class PlaylistService {
  /**
   * map of all items in the playlist
   * @type {Array<PlaylistItem>}
   * @private
   */
  private _items: PlaylistItem[] = [];
  /**
   * the currently selected item (or null if no items was yet selected)
   * @type {PlaylistItem}
   * @private
   */
  private _currentItem: PlaylistItem;
  /**
   * counter to generate unique IDs for the items in this list
   * @type {number}
   * @private
   */
  private _idCounter = 0;

  // Subjects for public properties
  private _itemsSubject: BehaviorSubject<PlaylistItem[]> = new BehaviorSubject(this._items);
  private _currentItemSubject: BehaviorSubject<PlaylistItem> = new BehaviorSubject(this._currentItem);

  /**
   * observable interface for the items in this playlist
   * @type {Observable<Array<PlaylistItem>>}
   */
  public readonly files: Observable<PlaylistItem[]> = this._itemsSubject.asObservable();
  /**
   * observable interface for the currently selected item
   * @type {Observable<PlaylistItem>}
   */
  public readonly currentFile: Observable<PlaylistItem> = this._currentItemSubject.asObservable();

  /**
   * Add items to this playlist and selects the first one if no other
   * item is currently selected.
   *
   * @param items
   */
  public addItems(items: FileList) {
    const listLength = items.length;

    for (let i = 0; i < listLength; i++) {
      const item = new PlaylistItem(items.item(i), this._idCounter++);

      this._items.push(item);
    }

    this._itemsSubject.next(this._items);

    if (!this._currentItem) {
      this._currentItem = this._items[0];
      this._currentItemSubject.next(this._currentItem);
    }
  }

  /**
   * Selects the item with the given itemId.
   *
   * @param itemId
   */
  public selectItem(itemId: number) {
    const idx = this._items.findIndex(item => item.itemId === itemId);

    if (idx >= 0) {
      this._currentItem = this._items[idx];
      this._currentItemSubject.next(this._currentItem);
    }
  }

  /**
   * Skips the given amount of steps through this playlist.
   *
   * @example PlaylistService.skipBy(3) skips 3 items forward
   * @example PlaylistService.skipBy(-5) skips 5 items backward
   * @param steps
   */
  public skipBy(steps: number) {
    if (!this._currentItem) {
      return;
    }

    const currentId = this._currentItem.itemId;
    const currentIdx = this._items.findIndex(item => item.itemId === currentId);

    if (currentIdx >= 0) {
      let newIdx = currentIdx + steps;
      if (newIdx < 0 || newIdx >= this._items.length) {
        newIdx = 0;
      }

      this._currentItem = this._items[newIdx];
      this._currentItemSubject.next(this._currentItem);
    }
  }

  /**
   * Skips one item forward.
   */
  public skipOneForward() {
    this.skipBy(1);
  }

  /**
   * Skips one item backward
   */
  public skipOneBackward() {
    this.skipBy(-1);
  }
}
