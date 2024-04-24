import Clutter from '@girs/clutter-14';
import GObject from '@girs/gobject-2.0';
import Shell from '@girs/shell-14';
import St from '@girs/st-14';
import { registerGObjectClass, SignalsDefinition } from '@pano/utils/gjs';
import { IPanoItemType } from '@pano/utils/panoItemType';

export type PanoItemHeaderSignalType = 'on-remove' | 'on-favorite';
interface PanoItemHeaderSignals extends SignalsDefinition<PanoItemHeaderSignalType> {
  'on-remove': Record<string, never>;
  'on-favorite': Record<string, never>;
}

@registerGObjectClass
export class PanoItemHeader extends St.BoxLayout {
  static metaInfo: GObject.MetaInfo<Record<string, never>, Record<string, never>, PanoItemHeaderSignals> = {
    GTypeName: 'PanoItemHeader',
    Signals: {
      'on-remove': {},
      'on-favorite': {},
    },
  };

  private favoriteButton: St.Button;
  actionContainer: St.BoxLayout;
  itemType: IPanoItemType;

  constructor(itemType: IPanoItemType) {
    super({
      styleClass: `pano-item-header pano-item-header-${itemType.classSuffix}`,
      vertical: false,
    });
    this.itemType = itemType;

    const themeContext = St.ThemeContext.get_for_stage(Shell.Global.get().get_stage());

    this.set_height(34);

    themeContext.connect('notify::scale-factor', () => {
      this.set_height(34);
    });

    this.actionContainer = new St.BoxLayout({
      styleClass: 'pano-item-actions',
      xExpand: true,
      yExpand: true,
      xAlign: Clutter.ActorAlign.END,
      yAlign: Clutter.ActorAlign.START,
    });

    const favoriteIcon = new St.Icon({
      styleClass: 'pano-item-action-button-icon',
      iconName: 'view-pin-symbolic',
    });

    this.favoriteButton = new St.Button({
      styleClass: 'pano-item-action-button pano-item-favorite-button',
      child: favoriteIcon,
    });

    this.favoriteButton.connect('clicked', () => {
      this.emit('on-favorite');
      return Clutter.EVENT_PROPAGATE;
    });

    const removeIcon = new St.Icon({
      styleClass: 'pano-item-action-button-icon pano-item-action-button-remove-icon',
      iconName: 'user-trash-symbolic',
    });

    const removeButton = new St.Button({
      styleClass: 'pano-item-action-button pano-item-remove-button',
      child: removeIcon,
    });

    removeButton.connect('clicked', () => {
      this.emit('on-remove');
      return Clutter.EVENT_PROPAGATE;
    });

    this.actionContainer.add_child(this.favoriteButton);
    this.actionContainer.add_child(removeButton);

    this.add_child(this.actionContainer);
  }

  setFavorite(isFavorite: boolean): void {
    if (isFavorite) {
      this.favoriteButton.add_style_pseudo_class('active');
    } else {
      this.favoriteButton.remove_style_pseudo_class('active');
    }
  }
}
