/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
//Ext.define('desktop.view.main.Main', {

    /*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.desktop.Desktop
 * @extends Ext.panel.Panel
 * <p>This class manages the wallpaper, shortcuts and taskbar.</p>
 */

Ext.define('desktop.view.main.Main', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',

        'Ext.ux.desktop.ShortcutModel',

        /*'Desktop.SystemStatus',
        'Desktop.VideoWindow',
        'Desktop.GridWindow',
        'Desktop.TabWindow',*/
        'desktop.modulos.accordion.AccordionWindow',/*,
        'Desktop.Notepad',
        'Desktop.BogusMenuModule',
        'Desktop.BogusModule',

        'Desktop.Blockalanche'*/
        'desktop.modulos.menu.BogusMenuModule',
        'desktop.modulos.menu.BogusModule',
        'desktop.modulos.configuracion.Settings',
        //'desktop.modulos.configuracion.dkt',
        'desktop.modulos.configuracion.model.Wallpaper'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

    getModules : function(){
       this.post('prueba','consulta', {
                    
                    scope   : this,
                    success : function(response){
                        var respuesta = Ext.decode(response.responseText);
                        console.log(respuesta);
                       
                    }
                });    
        return [
            //new Desktop.VideoWindow(),
            //new Desktop.Blockalanche(),
            /*new Desktop.SystemStatus(),
            new Desktop.GridWindow(),
            new Desktop.TabWindow(),*/
            new desktop.modulos.accordion.AccordionWindow({
                prueba:'hola'
            }),
            //new Desktop.Notepad(),
            new desktop.modulos.menu.BogusMenuModule()
        ];
    },

    getDesktopConfig: function () {

        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' },
                    { name: 'Accordion Window', iconCls: 'accordion-shortcut', module: 'acc-win' },
                    { name: 'Notepad', iconCls: 'notepad-shortcut', module: 'notepad' }//,
                    //{ name: 'System Status', iconCls: 'cpu-shortcut', module: 'systemstatus'}
                ]
            }),

            wallpaper: 'resources/images/wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: true
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();
        var menu  = me.menuPanels(me, me.modules);
       /* console.log(ret);
        console.log(menu);*/
        return Ext.apply(menu, {
            title: 'Mario Adri&aacute;n',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },
    /****************************************************
    *    Autor: Mario Adrián Martínez Fernández
    *           mario.martinez.f@hotmail.es    
    *    Fecha: 23 de junio de 2015
    *    Descripción: Crea el menu el cual tendra permisos el 
    *            usuario.
    *    Parametros: 
    *        app: Recibe el contexto de la aplicación
    *                (desktop).
    *        modules: Recibe el arreglo de modulos cargados
    *                     a los cuales en un momento dado
    *                     el usuario tendra permisos.
    *****************************************************/
    menuPanels:function(app, modules){
        console.log(modules);
        var cfg = {
                app: app,
                menu: []
            };
            var launcher={
                text: 'Accordion Window',
                iconCls:'accordion',
                handler: function() {
                    return false;
                },
                menu: {
                    items: []
                }
            };
             //launcher.handler = launcher.handler || Ext.bind(app.createWindow, app, [modules[0]]);

            cfg.menu.push(launcher);
            console.log(cfg.menu[0]);
            cfg.menu[0].menu.items.push({
                text: 'Window 1',
                iconCls:'bogus',
                handler : Ext.bind(app.createWindow, app, [modules[0]]),
                scope: this,
                windowId: 1
            });

            return cfg;
        /*console.log(app);*/
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?');
    },

    onSettings: function () {
        var dlg = new desktop.modulos.configuracion.Settings({
            desktop: this.desktop
        });
        dlg.show();
    },
    post: function (clas,metod,obj){
        obj.params= Ext.isEmpty(obj.params)?{_dc:""}:obj.params;
        Ext.Ajax.request({
           url:"index.php"+"/"+clas+"/"+metod,
           scope:obj.scope,
           success: obj.success,
           failure: obj.failure,
           params: obj.params
        });
    }
});
