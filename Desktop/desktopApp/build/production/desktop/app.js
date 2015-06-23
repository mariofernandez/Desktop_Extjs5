/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("Ext.ux.desktop.Desktop",Ext.panel.Panel,{activeWindowCls:"ux-desktop-active-win",inactiveWindowCls:"ux-desktop-inactive-win",lastActiveWindow:null,border:false,html:"&#160;",layout:"fit",xTickSize:1,yTickSize:1,app:null,shortcuts:null,shortcutItemSelector:"div.ux-desktop-shortcut",shortcutTpl:['<tpl for=".">','<div class="ux-desktop-shortcut" id="{name}-shortcut">','<div class="ux-desktop-shortcut-icon {iconCls}">','<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',"</div>",'<span class="ux-desktop-shortcut-text">{name}</span>',"</div>","</tpl>",'<div class="x-clear"></div>'],taskbarConfig:null,windowMenu:null,initComponent:function(){var c=this;c.windowMenu=new Ext.menu.Menu(c.createWindowMenu());c.bbar=c.taskbar=new Ext.ux.desktop.TaskBar(c.taskbarConfig);c.taskbar.windowMenu=c.windowMenu;c.windows=new Ext.util.MixedCollection();c.contextMenu=new Ext.menu.Menu(c.createDesktopMenu());c.items=[{xtype:"wallpaper",id:c.id+"_wallpaper"},c.createDataView()];Ext.panel.Panel.prototype.initComponent.call(this);c.shortcutsView=c.items.getAt(1);c.shortcutsView.on("itemclick",c.onShortcutItemClick,c);var d=c.wallpaper;c.wallpaper=c.items.getAt(0);if(d){c.setWallpaper(d,c.wallpaperStretch)}},afterRender:function(){var b=this;Ext.panel.Panel.prototype.afterRender.call(this);b.el.on("contextmenu",b.onDesktopMenu,b)},createDataView:function(){var b=this;return{xtype:"dataview",overItemCls:"x-view-over",trackOver:true,itemSelector:b.shortcutItemSelector,store:b.shortcuts,style:{position:"absolute"},x:0,y:0,tpl:new Ext.XTemplate(b.shortcutTpl)}},createDesktopMenu:function(){var c=this,d={items:c.contextMenuItems||[]};if(d.items.length){d.items.push("-")}d.items.push({text:"Tile",handler:c.tileWindows,scope:c,minWindows:1},{text:"Cascade",handler:c.cascadeWindows,scope:c,minWindows:1});return d},createWindowMenu:function(){var b=this;return{defaultAlign:"br-tr",items:[{text:"Restore",handler:b.onWindowMenuRestore,scope:b},{text:"Minimize",handler:b.onWindowMenuMinimize,scope:b},{text:"Maximize",handler:b.onWindowMenuMaximize,scope:b},"-",{text:"Close",handler:b.onWindowMenuClose,scope:b}],listeners:{beforeshow:b.onWindowMenuBeforeShow,hide:b.onWindowMenuHide,scope:b}}},onDesktopMenu:function(d){var e=this,f=e.contextMenu;d.stopEvent();if(!f.rendered){f.on("beforeshow",e.onDesktopMenuBeforeShow,e)}f.showAt(d.getXY());f.doConstrain()},onDesktopMenuBeforeShow:function(f){var d=this,e=d.windows.getCount();f.items.each(function(a){var b=a.minWindows||0;a.setDisabled(e<b)})},onShortcutItemClick:function(h,g){var k=this,f=k.app.getModule(g.data.module),j=f&&f.createWindow();if(j){k.restoreWindow(j)}},onWindowClose:function(c){var d=this;d.windows.remove(c);d.taskbar.removeTaskButton(c.taskButton);d.updateActiveWindow()},onWindowMenuBeforeShow:function(f){var e=f.items.items,d=f.theWin;e[0].setDisabled(d.maximized!==true&&d.hidden!==true);e[1].setDisabled(d.minimized===true);e[2].setDisabled(d.maximized===true||d.hidden===true)},onWindowMenuClose:function(){var d=this,c=d.windowMenu.theWin;c.close()},onWindowMenuHide:function(b){Ext.defer(function(){b.theWin=null},1)},onWindowMenuMaximize:function(){var d=this,c=d.windowMenu.theWin;c.maximize();c.toFront()},onWindowMenuMinimize:function(){var d=this,c=d.windowMenu.theWin;c.minimize()},onWindowMenuRestore:function(){var d=this,c=d.windowMenu.theWin;d.restoreWindow(c)},getWallpaper:function(){return this.wallpaper.wallpaper},setTickSize:function(f,k){var h=this,g=h.xTickSize=f,j=h.yTickSize=(arguments.length>1)?k:g;h.windows.each(function(b){var c=b.dd,a=b.resizer;c.xTickSize=g;c.yTickSize=j;a.widthIncrement=g;a.heightIncrement=j})},setWallpaper:function(c,d){this.wallpaper.setWallpaper(c,d);return this},cascadeWindows:function(){var e=0,f=0,d=this.getDesktopZIndexManager();d.eachBottomUp(function(a){if(a.isWindow&&a.isVisible()&&!a.maximized){a.setPosition(e,f);e+=20;f+=20}})},createWindow:function(k,f){var j=this,h,g=Ext.applyIf(k||{},{stateful:false,isWindow:true,constrainHeader:true,minimizable:true,maximizable:true});f=f||Ext.window.Window;h=j.add(new f(g));j.windows.add(h);h.taskButton=j.taskbar.addTaskButton(h);h.animateTarget=h.taskButton.el;h.on({activate:j.updateActiveWindow,beforeshow:j.updateActiveWindow,deactivate:j.updateActiveWindow,minimize:j.minimizeWindow,destroy:j.onWindowClose,scope:j});h.on({boxready:function(){h.dd.xTickSize=j.xTickSize;h.dd.yTickSize=j.yTickSize;if(h.resizer){h.resizer.widthIncrement=j.xTickSize;h.resizer.heightIncrement=j.yTickSize}},single:true});h.doClose=function(){h.doClose=Ext.emptyFn;h.el.disableShadow();h.el.fadeOut({listeners:{afteranimate:function(){h.destroy()}}})};return h},getActiveWindow:function(){var c=null,d=this.getDesktopZIndexManager();if(d){d.eachTopDown(function(a){if(a.isWindow&&!a.hidden){c=a;return false}return true})}return c},getDesktopZIndexManager:function(){var b=this.windows;return(b.getCount()&&b.getAt(0).zIndexManager)||null},getWindow:function(b){return this.windows.get(b)},minimizeWindow:function(b){b.minimized=true;b.hide()},restoreWindow:function(b){if(b.isVisible()){b.restore();b.toFront()}else{b.show()}return b},tileWindows:function(){var f=this,h=f.body.getWidth(true);var g=f.xTickSize,j=f.yTickSize,k=j;f.windows.each(function(a){if(a.isVisible()&&!a.maximized){var b=a.el.getWidth();if(g>f.xTickSize&&g+b>h){g=f.xTickSize;j=k}a.setPosition(g,j);g+=b+f.xTickSize;k=Math.max(k,j+a.el.getHeight()+f.yTickSize)}})},updateActiveWindow:function(){var d=this,f=d.getActiveWindow(),e=d.lastActiveWindow;if(e&&e.isDestroyed){d.lastActiveWindow=null;return}if(f===e){return}if(e){if(e.el.dom){e.addCls(d.inactiveWindowCls);e.removeCls(d.activeWindowCls)}e.active=false}d.lastActiveWindow=f;if(f){f.addCls(d.activeWindowCls);f.removeCls(d.inactiveWindowCls);f.minimized=false;f.active=true}d.taskbar.setActiveButton(f&&f.taskButton)}},0,["desktop"],["component","box","container","panel","desktop"],{component:true,box:true,container:true,panel:true,desktop:true},["widget.desktop"],0,[Ext.ux.desktop,"Desktop"],0));(Ext.cmd.derive("Ext.ux.desktop.App",Ext.Base,{isReady:false,modules:null,useQuickTips:true,constructor:function(d){var c=this;c.mixins.observable.constructor.call(this,d);if(Ext.isReady){Ext.Function.defer(c.init,10,c)}else{Ext.onReady(c.init,c)}},init:function(){var c=this,d;if(c.useQuickTips){Ext.QuickTips.init()}c.modules=c.getModules();if(c.modules){c.initModules(c.modules)}d=c.getDesktopConfig();c.desktop=new Ext.ux.desktop.Desktop(d);c.viewport=new Ext.container.Viewport({layout:"fit",items:[c.desktop]});Ext.getWin().on("beforeunload",c.onUnload,c);c.isReady=true;c.fireEvent("ready",c)},getDesktopConfig:function(){var c=this,d={app:c,taskbarConfig:c.getTaskbarConfig()};Ext.apply(d,c.desktopConfig);return d},getModules:Ext.emptyFn,getStartConfig:function(){var d=this,e={app:d,menu:[]},f;Ext.apply(e,d.startConfig);Ext.each(d.modules,function(a){f=a.launcher;if(f){f.handler=f.handler||Ext.bind(d.createWindow,d,[a]);e.menu.push(a.launcher)}});return e},createWindow:function(d){var c=d.createWindow();c.show()},getTaskbarConfig:function(){var c=this,d={app:c,startConfig:c.getStartConfig()};Ext.apply(d,c.taskbarConfig);return d},initModules:function(d){var c=this;Ext.each(d,function(a){a.app=c})},getModule:function(j){var k=this.modules;for(var h=0,f=k.length;h<f;h++){var g=k[h];if(g.id==j||g.appType==j){return g}}return null},onReady:function(c,d){if(this.isReady){c.call(d,this)}else{this.on({ready:c,scope:d,single:true})}},getDesktop:function(){return this.desktop},onUnload:function(b){if(this.fireEvent("beforeunload",this)===false){b.stopEvent()}}},1,0,0,0,0,[["observable",Ext.util.Observable]],[Ext.ux.desktop,"App"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("Ext.ux.desktop.Module",Ext.Base,{constructor:function(b){this.mixins.observable.constructor.call(this,b);this.init()},init:Ext.emptyFn},1,0,0,0,0,[["observable",Ext.util.Observable]],[Ext.ux.desktop,"Module"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("Ext.ux.desktop.ShortcutModel",Ext.data.Model,{fields:[{name:"name"},{name:"iconCls"},{name:"module"}]},0,0,0,0,0,0,[Ext.ux.desktop,"ShortcutModel"],0));(Ext.cmd.derive("Ext.ux.desktop.StartMenu",Ext.panel.Panel,{ariaRole:"menu",cls:"x-menu ux-start-menu",defaultAlign:"bl-tl",iconCls:"user",floating:true,shadow:true,width:300,initComponent:function(){var d=this,c=d.menu;d.menu=new Ext.menu.Menu({cls:"ux-start-menu-body",border:false,floating:false,items:c});d.menu.layout.align="stretch";d.items=[d.menu];d.layout="fit";Ext.menu.Manager.register(d);Ext.panel.Panel.prototype.initComponent.call(this);d.toolbar=new Ext.toolbar.Toolbar(Ext.apply({dock:"right",cls:"ux-start-menu-toolbar",vertical:true,width:100,listeners:{add:function(b,a){a.on({click:function(){d.hide()}})}}},d.toolConfig));d.toolbar.layout.align="stretch";d.addDocked(d.toolbar);delete d.toolItems},addMenuItem:function(){var b=this.menu;b.add.apply(b,arguments)},addToolItem:function(){var b=this.toolbar;b.add.apply(b,arguments)}},0,0,["component","box","container","panel"],{component:true,box:true,container:true,panel:true},0,0,[Ext.ux.desktop,"StartMenu"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("Ext.ux.desktop.TaskBar",Ext.toolbar.Toolbar,{cls:"ux-taskbar",startBtnText:"Start",initComponent:function(){var b=this;b.startMenu=new Ext.ux.desktop.StartMenu(b.startConfig);b.quickStart=new Ext.toolbar.Toolbar(b.getQuickStart());b.windowBar=new Ext.toolbar.Toolbar(b.getWindowBarConfig());b.tray=new Ext.toolbar.Toolbar(b.getTrayConfig());b.items=[{xtype:"button",cls:"ux-start-button",iconCls:"ux-start-button-icon",menu:b.startMenu,menuAlign:"bl-tl",text:b.startBtnText},b.quickStart,{xtype:"splitter",html:"&#160;",height:14,width:2,cls:"x-toolbar-separator x-toolbar-separator-horizontal"},b.windowBar,"-",b.tray];Ext.toolbar.Toolbar.prototype.initComponent.call(this)},afterLayout:function(){var b=this;Ext.toolbar.Toolbar.prototype.afterLayout.call(this);b.windowBar.el.on("contextmenu",b.onButtonContextMenu,b)},getQuickStart:function(){var c=this,d={minWidth:20,width:Ext.themeName==="neptune"?70:60,items:[],enableOverflow:true};Ext.each(this.quickStart,function(a){d.items.push({tooltip:{text:a.name,align:"bl-tl"},overflowText:a.name,iconCls:a.iconCls,module:a.module,handler:c.onQuickStartClick,scope:c})});return d},getTrayConfig:function(){var b={items:this.trayItems};delete this.trayItems;return b},getWindowBarConfig:function(){return{flex:1,cls:"ux-desktop-windowbar",items:["&#160;"],layout:{overflowHandler:"Scroller"}}},getWindowBtnFromEl:function(d){var c=this.windowBar.getChildByElement(d);return c||null},onQuickStartClick:function(d){var e=this.app.getModule(d.module),f;if(e){f=e.createWindow();f.show()}},onButtonContextMenu:function(g){var h=this,e=g.getTarget(),f=h.getWindowBtnFromEl(e);if(f){g.stopEvent();h.windowMenu.theWin=f.win;h.windowMenu.showBy(e)}},onWindowBtnClick:function(d){var c=d.win;if(c.minimized||c.hidden){d.disable();c.show(null,function(){d.enable()})}else{if(c.active){d.disable();c.on("hide",function(){d.enable()},null,{single:true});c.minimize()}else{c.toFront()}}},addTaskButton:function(f){var e={iconCls:f.iconCls,enableToggle:true,toggleGroup:"all",width:140,margin:"0 2 0 3",text:Ext.util.Format.ellipsis(f.title,20),listeners:{click:this.onWindowBtnClick,scope:this},win:f};var d=this.windowBar.add(e);d.toggle(true);return d},removeTaskButton:function(e){var f,d=this;d.windowBar.items.each(function(a){if(a===e){f=a}return !f});if(f){d.windowBar.remove(f)}return f},setActiveButton:function(b){if(b){b.toggle(true)}else{this.windowBar.items.each(function(a){if(a.isButton){a.toggle(false)}})}}},0,["taskbar"],["component","box","container","toolbar","taskbar"],{component:true,box:true,container:true,toolbar:true,taskbar:true},["widget.taskbar"],0,[Ext.ux.desktop,"TaskBar"],0));(Ext.cmd.derive("Ext.ux.desktop.TrayClock",Ext.toolbar.TextItem,{cls:"ux-desktop-trayclock",html:"&#160;",timeFormat:"g:i A",tpl:"{time}",initComponent:function(){var b=this;Ext.toolbar.TextItem.prototype.initComponent.call(this);if(typeof(b.tpl)=="string"){b.tpl=new Ext.XTemplate(b.tpl)}},afterRender:function(){var b=this;Ext.Function.defer(b.updateTime,100,b);Ext.toolbar.TextItem.prototype.afterRender.call(this)},onDestroy:function(){var b=this;if(b.timer){window.clearTimeout(b.timer);b.timer=null}Ext.toolbar.TextItem.prototype.onDestroy.call(this)},updateTime:function(){var e=this,d=Ext.Date.format(new Date(),e.timeFormat),f=e.tpl.apply({time:d});if(e.lastText!=f){e.setText(f);e.lastText=f}e.timer=Ext.Function.defer(e.updateTime,10000,e)}},0,["trayclock"],["component","box","tbitem","tbtext","trayclock"],{component:true,box:true,tbitem:true,tbtext:true,trayclock:true},["widget.trayclock"],0,[Ext.ux.desktop,"TrayClock"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("Ext.ux.desktop.Wallpaper",Ext.Component,{cls:"ux-wallpaper",html:'<img src="'+Ext.BLANK_IMAGE_URL+'">',stretch:false,wallpaper:null,stateful:true,stateId:"desk-wallpaper",afterRender:function(){var b=this;Ext.Component.prototype.afterRender.call(this);b.setWallpaper(b.wallpaper,b.stretch)},applyState:function(){var c=this,d=c.wallpaper;Ext.Component.prototype.applyState.apply(this,arguments);if(d!=c.wallpaper){c.setWallpaper(c.wallpaper)}},getState:function(){return this.wallpaper&&{wallpaper:this.wallpaper}},setWallpaper:function(f,g){var k=this,h,j;k.stretch=(g!==false);k.wallpaper=f;if(k.rendered){h=k.el.dom.firstChild;if(!f||f==Ext.BLANK_IMAGE_URL){Ext.fly(h).hide()}else{if(k.stretch){h.src=f;k.el.removeCls("ux-wallpaper-tiled");Ext.fly(h).setStyle({width:"100%",height:"100%"}).show()}else{Ext.fly(h).hide();j="url("+f+")";k.el.addCls("ux-wallpaper-tiled")}}k.el.setStyle({backgroundImage:j||""});if(k.stateful){k.saveState()}}return k}},0,["wallpaper"],["component","box","wallpaper"],{component:true,box:true,wallpaper:true},["widget.wallpaper"],0,[Ext.ux.desktop,"Wallpaper"],0));(Ext.cmd.derive("desktop.Application",Ext.app.Application,{name:"desktop",stores:[],launch:function(){}},0,0,0,0,0,0,[desktop,"Application"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("desktop.modulos.accordion.AccordionWindow",Ext.ux.desktop.Module,{id:"acc-win",init:function(){this.launcher={text:"Accordion Window",iconCls:"accordion"}},createTree:function(){var b=Ext.create("Ext.tree.Panel",{id:"im-tree",title:"Online Users",rootVisible:false,lines:false,autoScroll:true,tools:[{type:"refresh",listeners:{buffer:300,click:function(c,f){b.setLoading(true,b.body);var a=b.getRootNode();a.collapseChildren(true,false);Ext.Function.defer(function(){b.setLoading(false);a.expand(true,true)},1000)}}}],store:Ext.create("Ext.data.TreeStore",{root:{text:"Online",expanded:true,children:[{text:"Friends",expanded:true,children:[{text:"Brian",iconCls:"user",leaf:true},{text:"Kevin",iconCls:"user",leaf:true},{text:"Mark",iconCls:"user",leaf:true},{text:"Matt",iconCls:"user",leaf:true},{text:"Michael",iconCls:"user",leaf:true},{text:"Mike Jr",iconCls:"user",leaf:true},{text:"Mike Sr",iconCls:"user",leaf:true},{text:"JR",iconCls:"user",leaf:true},{text:"Rich",iconCls:"user",leaf:true},{text:"Nige",iconCls:"user",leaf:true},{text:"Zac",iconCls:"user",leaf:true}]},{text:"Family",expanded:true,children:[{text:"Kiana",iconCls:"user-girl",leaf:true},{text:"Aubrey",iconCls:"user-girl",leaf:true},{text:"Cale",iconCls:"user-kid",leaf:true}]}]}})});return b},createWindow:function(){var c=this.app.getDesktop();var d=c.getWindow("acc-win");if(!d){d=c.createWindow({id:"acc-win",title:"Accordion Window",width:250,height:400,iconCls:"accordion",animCollapse:false,constrainHeader:true,bodyBorder:Ext.themeName!=="neptune",tbar:{xtype:"toolbar",ui:"plain",items:[{tooltip:{title:"Rich Tooltips",text:"Let your users know what they can do!"},iconCls:"connect"},"-",{tooltip:"Add a new user",iconCls:"user-add"}," ",{tooltip:"Remove the selected user",iconCls:"user-delete"}]},layout:"accordion",border:false,items:[this.createTree(),{title:"Settings",html:"<p>Something useful would be in here.</p>",autoScroll:true},{title:"Even More Stuff",html:"<p>Something useful would be in here.</p>"},{title:"My Stuff",html:"<p>Something useful would be in here.</p>"}]})}return d}},0,0,0,0,0,0,[desktop.modulos.accordion,"AccordionWindow"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("desktop.modulos.configuracion.Settings",Ext.window.Window,{layout:"anchor",title:"Change Settings",modal:true,width:640,height:480,border:false,initComponent:function(){var b=this;b.selected=b.desktop.getWallpaper();b.stretch=b.desktop.wallpaper.stretch;b.preview=Ext.create("widget.wallpaper");b.preview.setWallpaper(b.selected);b.tree=b.createTree();b.buttons=[{text:"OK",handler:b.onOK,scope:b},{text:"Cancel",handler:b.close,scope:b}];b.items=[{anchor:"0 -30",border:false,layout:"border",items:[b.tree,{xtype:"panel",title:"Preview",region:"center",layout:"fit",items:[b.preview]}]},{xtype:"checkbox",boxLabel:"Stretch to fit",checked:b.stretch,listeners:{change:function(a){b.stretch=a.checked}}}];Ext.window.Window.prototype.initComponent.call(this)},createTree:function(){var d=this;function f(a){return{img:a,text:d.getTextOfWallpaper(a),iconCls:"",leaf:true}}var e=new Ext.tree.Panel({title:"Desktop Background",rootVisible:false,lines:false,autoScroll:true,width:150,region:"west",split:true,minWidth:100,listeners:{afterrender:{fn:this.setInitialSelection,delay:100},select:this.onSelect,scope:this},store:new Ext.data.TreeStore({model:"desktop.modulos.configuracion.model.Wallpaper",root:{text:"Wallpaper",expanded:true,children:[{text:"None",iconCls:"",leaf:true},f("Blue-Sencha.jpg"),f("Dark-Sencha.jpg"),f("Wood-Sencha.jpg"),f("blue.jpg"),f("desk.jpg"),f("desktop.jpg"),f("desktop2.jpg"),f("sky.jpg")]}})});return e},getTextOfWallpaper:function(h){var g=h,e=h.lastIndexOf("/");if(e>=0){g=g.substring(e+1)}var f=g.lastIndexOf(".");g=Ext.String.capitalize(g.substring(0,f));g=g.replace(/[-]/g," ");return g},onOK:function(){var b=this;if(b.selected){b.desktop.setWallpaper(b.selected,b.stretch)}b.destroy()},onSelect:function(e,d){var f=this;if(d.data.img){f.selected="resources/images/wallpapers/"+d.data.img}else{f.selected=Ext.BLANK_IMAGE_URL}f.preview.setWallpaper(f.selected)},setInitialSelection:function(){var d=this.desktop.getWallpaper();if(d){var c="/Wallpaper/"+this.getTextOfWallpaper(d);this.tree.selectPath(c,"text")}}},0,0,["component","box","container","panel","window"],{component:true,box:true,container:true,panel:true,window:true},0,0,[desktop.modulos.configuracion,"Settings"],0));(Ext.cmd.derive("desktop.modulos.configuracion.model.Wallpaper",Ext.data.TreeModel,{fields:[{name:"text"},{name:"img"}]},0,0,0,0,0,0,[desktop.modulos.configuracion.model,"Wallpaper"],0));
/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
(Ext.cmd.derive("desktop.view.main.Main",Ext.ux.desktop.App,{init:function(){Ext.ux.desktop.App.prototype.init.call(this)},getModules:function(){return[new desktop.modulos.accordion.AccordionWindow({prueba:"hola"})]},getDesktopConfig:function(){var c=this,d=Ext.ux.desktop.App.prototype.getDesktopConfig.call(this);return Ext.apply(d,{contextMenuItems:[{text:"Change Settings",handler:c.onSettings,scope:c}],shortcuts:Ext.create("Ext.data.Store",{model:"Ext.ux.desktop.ShortcutModel",data:[{name:"Grid Window",iconCls:"grid-shortcut",module:"grid-win"},{name:"Accordion Window",iconCls:"accordion-shortcut",module:"acc-win"},{name:"Notepad",iconCls:"notepad-shortcut",module:"notepad"}]}),wallpaper:"resources/images/wallpapers/Blue-Sencha.jpg",wallpaperStretch:true})},getStartConfig:function(){var c=this,d=Ext.ux.desktop.App.prototype.getStartConfig.call(this);return Ext.apply(d,{title:"Mario Adrian",iconCls:"user",height:300,toolConfig:{width:100,items:[{text:"Settings",iconCls:"settings",handler:c.onSettings,scope:c},"-",{text:"Logout",iconCls:"logout",handler:c.onLogout,scope:c}]}})},getTaskbarConfig:function(){var b=Ext.ux.desktop.App.prototype.getTaskbarConfig.call(this);return Ext.apply(b,{quickStart:[{name:"Accordion Window",iconCls:"accordion",module:"acc-win"},{name:"Grid Window",iconCls:"icon-grid",module:"grid-win"}],trayItems:[{xtype:"trayclock",flex:1}]})},onLogout:function(){Ext.Msg.confirm("Logout","Are you sure you want to logout?")},onSettings:function(){var b=new desktop.modulos.configuracion.Settings({desktop:this.desktop});b.show()}},0,0,0,0,0,0,[desktop.view.main,"Main"],0));Ext.application({name:"desktop",extend:desktop.Application,autoCreateViewport:"desktop.view.main.Main"});