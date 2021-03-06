const Clutter = imports.gi.Clutter;
const Gtk = imports.gi.Gtk;
const St = imports.gi.St;
const Lang = imports.lang;

const Applet = imports.ui.applet;
const ExtensionSystem = imports.ui.extensionSystem;
const extensions = imports.ui.extension.objects;
const ModalDialog = imports.ui. modalDialog;

const EXTENSION_UUID = 'gTile@shuairan';
const gTile = extensions[EXTENSION_UUID];

function MyApplet(metadata, orientation, panelHeight) {
    this._init(metadata, orientation, panelHeight);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(metadata, orientation, panelHeight, instanceId){
        global.log("HELLO!");
        Applet.IconApplet.prototype._init.call(this, orientation, panelHeight, instanceId);
        Gtk.IconTheme.get_default().append_search_path(metadata.path);

        this.set_applet_icon_symbolic_name('tiling-icon');
        this.set_applet_tooltip(_("Launch GTile"));

        this.modal = new ModalDialog.ModalDialog();
        this.modal.setButtons([{ label: _("Cancel"),
                                 action: Lang.bind(this, this._closeDialog),
                                 key: Clutter.Escape}]);
        this.notInstalledLabel = new St.Label({text: _("gTile is not installed or incompatible with Cinnamon verision.\nPlease install/update it in order to use the applet\n")});
        this.notEnabledLabel = new St.Label({text: _("gTile is not enabled.\nPlease enable it in order to use the applet\n")});
        this.modal.contentLayout.add(this.notInstalledLabel);
        this.modal.contentLayout.add(this.notEnabledLabel);
    },

    on_applet_clicked: function(){
        if (!gTile){
            global.log("gTile applet clicked while gTile is not installed/incompatible with Cinnamon version");
            this.modal.open();
            this.notInstalledLabel.show();
            this.notEnabledLabel.hide();
        } else if (ExtensionSystem.enabledExtensions.indexOf(EXTENSION_UUID) == -1){
            global.log("gTile applet clicked while gTile is not enabled");
            this.modal.open();
            this.notInstalledLabel.hide();
            this.notEnabledLabel.show();
        } else {
            gTile.module.toggleTiling();
        }
    },

    _closeDialog: function(){
        this.modal.close();
    }
};

function main(metadata, orientation, panelHeight, instanceId){
    let myApplet = new MyApplet(metadata, orientation, panelHeight, instanceId);
    return myApplet;
}
