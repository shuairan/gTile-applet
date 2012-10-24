const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Lang = imports.lang;

const Applet = imports.ui.applet;
const ExtensionSystem = imports.ui.extensionSystem;
const ModalDialog = imports.ui. modalDialog;

const EXTENSION_UUID = 'gTile@shuairan';
const gTile = ExtensionSystem.extensionStateObjs[EXTENSION_UUID];

function MyApplet(orientation, panelHeight) {
    this._init(orientation, panelHeight);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation, panelHeight){
        Applet.IconApplet.prototype._init.call(this, orientation, panelHeight);

        this.set_applet_icon_name('tiling-icon');
        this.set_applet_tooltip(_("Launch GTile"));

        this.modal = new ModalDialog.ModalDialog();
        this.modal.setButtons([{ label: _("Cancel"),
                                 action: Lang.bind(this, this._closeDialog),
                                 key: Clutter.Escape}]);
        this.notInstalledLabel = new St.Label({text: _("gTile is not installed. Please enable it in order to use the applet\n")});
        this.notEnabledLabel = new St.Label({text: _("gTile is not enabled. Please enable it in order to use the applet\n")});
        this.modal.contentLayout.add(this.notInstalledLabel);
        this.modal.contentLayout.add(this.notEnabledLabel);
    },

    on_applet_clicked: function(){
        if (!gTile){
            global.log("gTile applet clicked while gTile is not installed");
            this.modal.open();
            this.notInstalledLabel.show();
            this.notEnabledLabel.hide();
        } else if (ExtensionSystem.enabledExtensions.indexOf(EXTENSION_UUID) == -1){
            global.log("gTile applet clicked while gTile is not enabled");
            this.modal.open();
            this.notInstalledLabel.hide();
            this.notEnabledLabel.show();
        } else {
            gTile.toggleTiling();
        }
    },

    _closeDialog: function(){
        this.modal.close();
    }
};

function main(metadata, orientation, panelHeight){
    let myApplet = new MyApplet(orientation, panelHeight);
    return myApplet;
}