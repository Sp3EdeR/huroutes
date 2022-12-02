const huroutes={'opt':{'route':{'colors':['#744','#944','#a5423f','#b04039','#bc3d34','#c7392e','#d23427','#dd2e20','#e92618','#f4190e','#f00'],'opacities':[1,0.66,0.70,0.75,0.8,0.85,0.9,0.95,1,1,1],'focusColor':'#00f','focusOpacity':1},'map':{'bounds':[[48.509,15.659],[45.742,23.193]],'tiles':{'Térkép':L.tileLayer.provider('OpenStreetMap',{className:'tile-openstreetmap'}),'Domborzat':L.tileLayer.provider('OpenTopoMap',{className:'tile-opentopomap'}),'Műhold':L.tileLayer.provider('Esri.WorldImagery',{className:'tile-sattelite'}),'Google Térkép':L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0','mt1','mt2','mt3'],className:'tile-googlemap'}),'Google Domborzat':L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0','mt1','mt2','mt3'],className:'tile-googleterrain'}),'Google Műhold':L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0','mt1','mt2','mt3'],className:'tile-googlesattelite'})},'overlays':{'Domborzat Kiemelés':L.tileLayer('https://map.turistautak.hu/tiles/shading/{z}/{x}/{y}.png',{attribution:'&copy; turistautak.hu',minZoom:5,maxZoom:18,zIndex:5,className:'overlay-dem'}),'Turistautak':L.tileLayer('https://{s}.tile.openstreetmap.hu/tt/{z}/{x}/{y}.png',{attribution:'&copy; turistautak.hu',minZoom:5,maxZoom:18,zIndex:100,className:'overlay-turistautak'})},'tileOverlays':{'Műhold':L.tileLayer('https://map.turistautak.hu/tiles/lines/{z}/{x}/{y}.png',{attribution:'&copy; turistautak.hu',minZoom:5,maxZoom:18,zIndex:10,className:'overlay-satteliteroads'})}},'navLinkProviders':{'Google':coord=>{const link='https://www.google.com/maps/dir/?api=1&travelmode=driving&destination={0},{1}';return link.format(coord.lat,coord.lng);},'Waze':coord=>{const link='https://www.waze.com/ul?ll={0}%2C{1}&navigate=yes';return link.format(coord.lat,coord.lng);},'Apple':coord=>{const link='http://maps.apple.com/?daddr={0},{1}&dirflg=d';return link.format(coord.lat,coord.lng);}},'downloads':{'GPS Exchange Format (gpx)':{'ext':'gpx','mimeType':'application/gpx+xml','fileTemplate':'<?xml version="1.0" standalone="yes"?>\
<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="huroutes" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\
<metadata>\
  <name>{0}</name>\
  <desc>Driving route downloaded from huroutes.</desc>\
  <author>huroutes</author>\
  <link>https://sp3eder.github.io/huroutes/#{0}</link>\
</metadata>\
<trk><trkseg>{1}</trkseg></trk>\
</gpx>','pointTemplate':'<trkpt lat="{0}" lon="{1}"/>'},'Keyhole Markup Language (kml)':{'ext':'kml','mimeType':'application/vnd.google-earth.kml+xml','fileTemplate':'<?xml version="1.0" encoding="UTF-8"?>\
<kml xmlns="http://www.opengis.net/kml/2.2"><Document>\
  <name>{0}</name>\
  <description>Driving route downloaded from <a href="https://sp3eder.github.io/huroutes/#{0}">huroutes</a>.</description>\
  <Style id="linestyle"><LineStyle><color>ffff0000</color><width>6</width></LineStyle></Style>\
  <Placemark>\
    <styleUrl>#linestyle</styleUrl>\
    <LineString>\
      <tessellate>1</tessellate>\
      <coordinates>{1}</coordinates>\
    </LineString>\
  </Placemark>\
</Document></kml>','pointTemplate':'{1},{0},0 '}},'streetView':'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={0},{1}&heading={2}','markers':{'zoomTo':16},'themes':{'Rendszer színmód használata':{'default':'Világos','mapping':{'dark':'Sötét'}},'Világos':{'classes':['bootstrap','maps-light','huroutes-light']},'Sötét':{'classes':['bootstrap-dark','maps-dark','huroutes-dark']},'Sötét világos térképpel':{'classes':['bootstrap-dark','maps-light','huroutes-dark']}}},'lang':{'default':'hu-HU','hu-HU':{'updateDate':'Az útvonal legutóbbi felderítésének ideje.','rating':'Az útvonal értékelése vezethetőség, változatosság, izgalom szempontjaiból.','navToPoi':' Navigáció <span class="nav-start">ehhez a helyhez</span>.','sharePoi':'Hely <span class="share">megosztása</span>.','navStartTooltip':'Navigálás az útvonal elejére.','navEndTooltip':'Navigálás az útvonal végére.','dlRouteTooltip':'Az útvonal letöltése.','shareTooltip':'Az útvonal megosztása.','streetViewTooltip':'Street view megnyitása.','routeLength':'Hossza: {0}km.','locatePopup':'Az aktuális pozícióm mutatása.'}}};String.prototype.format=function(){var args=arguments;return this.replace(/\{(\d+)\}/g,function(m,n){return args[n];});};(function(){var langDict=selectLanguage();var map;var nextDropId=0;$(document).ready(function(){map=L.map('map',{zoomControl:false}).fitBounds(huroutes.opt.map.bounds);const tiles=huroutes.opt.map.tiles;(tiles[localStorage.mapstyle]||tiles[Object.keys(tiles)[0]]).addTo(map);const overlays=huroutes.opt.map.overlays;(localStorage.overlays||'').split('|').forEach(item=>{const overlay=overlays[item];if(overlay)
overlay.addTo(map);});const tileOverlay=huroutes.opt.map.tileOverlays[localStorage.mapstyle];if(tileOverlay)
tileOverlay.addTo(map);map.createPane('bkgRoutes');map.getPane('bkgRoutes').style.zIndex=450;$.getJSON('data.json',initializeContent).fail(function(){console.error('Failed loading the route database.');});initColorSelector();initCtrls(tiles,overlays);$('#options-dialog').on('hidden.bs.modal',updateOptions);initSidebarEvents();initNavSelector();initDownloadTypeSelector();initAdToast();navigateTo(fragment.get())});var stopFollowingLocation=()=>{};function initCtrls(tiles,overlays)
{L.control.scale({position:'bottomright',imperial:false}).addTo(map);L.control.zoom({position:'bottomright'}).addTo(map);L.control.layers(tiles,overlays,{position:'bottomleft'}).addTo(map);map.on('baselayerchange',(layer)=>{localStorage.mapstyle=layer.name;Object.entries(huroutes.opt.map.tileOverlays).forEach(([name,overlay])=>{if(name==layer.name)
overlay.addTo(map);else if(map.hasLayer(overlay))
overlay.remove();});const tileOverlay=huroutes.opt.map.tileOverlays[layer.name];if(tileOverlay)
tileOverlay.addTo(map);});map.on('overlayadd',(overlay)=>{var overlays=localStorage.overlays;overlays=overlays?overlays.split('|'):[];overlays.push(overlay.name);localStorage.overlays=overlays.join('|');});map.on('overlayremove',(overlay)=>{var overlays=(localStorage.overlays||'').split('|');const idx=overlays.indexOf(overlay.name);if(idx!=-1)
overlays.splice(idx,1);localStorage.overlays=overlays.join('|');});var locationCtrl=L.control.locate({cacheLocation:false,clickBehavior:{inView:'stop',outOfView:'setView',inViewNotFollowing:'setView'},initialZoomLevel:huroutes.opt.markers.zoomTo,keepCurrentZoomLevel:true,position:'bottomright',flyTo:true,locateOptions:{enableHighAccuracy:true},onLocationError:()=>{$('#toast-location-error').toast('show');localStorage.removeItem('showLocation');},setView:'untilPan',showPopup:false,strings:{title:langDict.locatePopup}}).addTo(map);map.on('locateactivate',()=>localStorage.showLocation=true);map.on('locatedeactivate',()=>localStorage.removeItem('showLocation'));if(localStorage.showLocation)
{var oldView=locationCtrl.options.setView;locationCtrl.options.setView=false;locationCtrl.start();locationCtrl.options.setView=oldView;try{locationCtrl.stopFollowing();}catch{}}
stopFollowingLocation=()=>locationCtrl.stopFollowing();$(document).on('contextmenu',e=>$(e.target).attr('data-toggle')!='tooltip'&&!$(e.target).parents('[data-toggle="tooltip"]').length);}
function initializeContent(data)
{if(!Array.isArray(data)||!data.length)
{console.error('The map data is empty.');return;}
addDataGroup($('#menubox'),null,data);}
function addDataGroup(parentElem,id,content)
{var elem=$('<ul class="menu list-unstyled components"/>');if(id)
{elem.prop('id',id);elem.addClass('collapse');}
content.forEach(item=>{addDataItem(elem,item);});parentElem.append(elem);}
function addDataItem(parentElem,item)
{if(!item.ttl)
{console.error('Titleless menu item defined in the database.');return;}
var elem=$('<li class="menu"/>');if(Array.isArray(item.cnt))
{var dropId=createMenuItem(elem,item);addDataGroup(elem,dropId,item.cnt);}
else if(item.kml)
createMenuRouteItem(elem,item);else
console.error(item.ttl+' is an unknown item type.')
parentElem.append(elem);}
function createMenuItem(elem,data)
{var dropId='menu'+nextDropId++;elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl));if(data.md||data.kml||data.pnt)
console.error('Menu {0} contains route data that it should not.'.format(data.ttl));return dropId;}
function createMenuRouteItem(elem,data)
{elem.addClass('menuitem');var dropId='menu'+nextDropId++;elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl).click(function(){navigateTo('#'+$(this).parents('li').first().attr('data-routeid'));}));var elemDiv=$('<div class="menu list-unstyled collapse panel"/>').prop('id',dropId);createInfoPanel(elemDiv,data);elem.append(elemDiv);var routeId=addRoute(data);elem.attr('data-routeid',routeId);}
function createInfoPanel(elem,data)
{if(!data.bkg)
{if(!data.rat)
console.warn('No rating given for '+data.ttl);if(!data.upd)
console.warn('No last update date given for '+data.ttl);}
if(data.rat||data.upd)
{var elemHeader=$('<p class="route-header"/>');if(data.upd)
{var eUpd=$('\
<span class="update-date" title="{0}" data-toggle="tooltip" data-placement="bottom">\
  <i class="far fa-clock"></i> {1}\
</span>'.format(langDict.updateDate,data.upd)).tooltip();elemHeader.append(eUpd);}
if(data.rat)
{var starsOutter=$('<span class="stars-outer" title="{0}" data-toggle="tooltip" data-placement="bottom"/>'.format(langDict.rating)).tooltip();for(var i=0;i<5;++i)
starsOutter.append($('<i class="far fa-star"></i>'));var rating=normRating(data.rat);var starsInner=$('<span class="stars-inner" style="width:{0};" />'.format(rating*10+'%'));for(var i=0;i<5;++i)
starsInner.append($('<i class="fas fa-star"></i>'));starsOutter.append(starsInner);elemHeader.append(starsOutter);}
elem.append(elemHeader);}
if(data.md)
{var descCont=$('<div class="route-desc"/>');const addMarkdown=text=>descCont.append($(markdown.makeHtml(text)));if(data.md.substr(-3)==='.md')
$.ajax(data.md).then(addMarkdown,function(){console.log('Error loading details for '+data.ttl);});else
addMarkdown(data.md);elem.append(descCont);}
else
console.warn('No description given for '+data.ttl);elem.append($('<div class="route-links"/>'));}
function addRoute(data)
{const colors=huroutes.opt.route.colors;const opacities=huroutes.opt.route.opacities;var routeId=data.kml.match(/data\/([\w-]+).kml/)[1];var rating=normRating(data.rat);var pathWeight=3+(!data.bkg&&rating/2);var layer=L.geoJson(null,{filter:feature=>feature.geometry.type=="LineString",pane:data.bkg?'bkgRoutes':'shadowPane',style:{color:data.bkg?colors[0]:colors[rating],opacity:data.bkg?opacities[0]:opacities[rating],weight:pathWeight},focusedStyle:{color:huroutes.opt.route.focusColor,opacity:huroutes.opt.route.focusOpacity,weight:pathWeight+2}});layer.on('click',event=>!navigateTo(event.target));layer.on('mouseover',event=>event.target.focused||event.target.setStyle(event.target.options.focusedStyle));layer.on('mouseout',event=>event.target.focused||event.target.setStyle(event.target.options.style));layer.on('layeradd',event=>{var elem=$('li[data-routeid={0}] .route-links'.format(routeId));var coords=event.layer.getLatLngs();if(Array.isArray(coords)&&2<=coords.length)
{var length=0.0;for(var i=1;i<coords.length;++i)
length+=coords[i-1].distanceTo(coords[i]);elem.append($(('<p>'+langDict.routeLength+'</p>').format((length/1000).toFixed(1))));var elemLinks=$('<div class="route-ctrls btn-toolbar" role="toolbar"/>');addNavigationLinks(elemLinks,coords[0],coords[coords.length-1]);var mididx=Math.floor(coords.length/2);addStreetViewLink(elemLinks,coords[mididx],coords[mididx+1]);elem.append(elemLinks);addDlShareLinks(elemLinks,coords,routeId);}
if(fragment.isIt(routeId))
navigateTo(layer);});layer.routeId=routeId;omnivore.kml(data.kml,null,layer).addTo(map);return routeId;}
function initColorSelector()
{const themes=huroutes.opt.themes;const uniqueArray=arr=>$.grep(arr,(item,idx)=>idx===$.inArray(item,arr));const allThemeClasses=uniqueArray($.map(Object.values(themes).filter(i=>i.classes!=undefined),i=>i.classes));const currentColorTheme=()=>themes[localStorage.theme]?localStorage.theme:Object.keys(themes)[0];const isSystemColorTheme=themeName=>!themes[themeName].classes;const getMediaQuery=color=>'(prefers-color-scheme: {0})'.format(color);function applyTheme(themeName)
{let data=themes[themeName];if(isSystemColorTheme(themeName))
{let selected=data.default;$.each(data.mapping,(color,themeName)=>{if(matchMedia(getMediaQuery(color)).matches)
selected=themeName;});applyTheme(selected);}
else
$('body').removeClass(allThemeClasses).addClass(data.classes);}
applyTheme(currentColorTheme());const handleMediaChanged=e=>isSystemColorTheme(currentColorTheme())&&applyTheme(currentColorTheme());let media=matchMedia(getMediaQuery('dark'))
if(media.addEventListener)
media.addEventListener('change',handleMediaChanged);else
media.addListener(handleMediaChanged);var elem=$('#color-themes');$.each(themes,(theme,data)=>{const id=theme.toLowerCase().replace(/ /g,'');let elemOpt=$('<div><input type="radio" name="theme" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'.format(id,theme,theme==currentColorTheme()?'checked':''));elemOpt.children('input').click(()=>applyTheme(localStorage.theme=theme));elem.append(elemOpt);});}
var navigation={provs:huroutes.opt.navLinkProviders,getId:function(){return this.provs[localStorage.navprovider]?localStorage.navprovider:Object.keys(this.provs)[0];},getLink:function(coord){return this.provs[this.getId()](coord);}}
function initNavSelector()
{var elem=$('#nav-options');$.each(navigation.provs,(key,value)=>{const id=key.toLowerCase().replace(/ /g,'');elem.append($('<div><input type="radio" name="navProv" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'.format(id,key,key==navigation.getId()?'checked':'')));});}
function planTo(coord)
{open(navigation.getLink(coord),'_blank');return false;}
function addNavigationLinks(elem,start,end)
{var eNav=$('\
<div class="btn-group mr-2" role="group">\
  <a href="#" class="nav-start btn btn-primary" title="{0}" data-toggle="tooltip" data-placement="bottom"><i class="fas fa-step-backward"></i></a>\
  <a href="#" class="btn btn-primary btn-wide disabled"><i class="fas fa-route"></i></a>\
  <a href="#" class="nav-end btn btn-primary" title="{1}" data-toggle="tooltip" data-placement="bottom"><i class="fas fa-step-forward"></i></a>\
</div>'.format(langDict.navStartTooltip,langDict.navEndTooltip));eNav.find('.nav-start').click(()=>planTo(start)).tooltip();eNav.find('.nav-end').click(()=>planTo(end)).tooltip();eNav.tooltip();elem.append(eNav);}
function addPoiLinks(elem,title,coord)
{var eLinks=$('<p> {0} {1}</p>'.format(langDict.navToPoi,langDict.sharePoi));var eNav=eLinks.find('.nav-start');eNav.replaceWith($('<a href="#" />').append(eNav.html()).click(()=>planTo(coord)));var eShare=eLinks.find('.share');eShare.replaceWith($('<a href="#" />').append(eShare.html()).click(()=>{navigator.share({title:title,url:location.href});return false;}));elem.append(eLinks);}
var dlRoute={fmts:huroutes.opt.downloads,getId:function(){return this.fmts[localStorage.dltype]?localStorage.dltype:Object.keys(this.fmts)[0];},download:function(coords,routeId){var fmt=this.fmts[this.getId()];var file=fmt.fileTemplate.format(routeId,coords.map(coord=>fmt.pointTemplate.format(coord.lat,coord.lng)).join(''));downloadString(routeId+'.'+fmt.ext,fmt.mimeType,file);}}
function initDownloadTypeSelector()
{var elem=$('#download-types');$.each(dlRoute.fmts,(key,value)=>{const id=key.toLowerCase().replace(/ /g,'');elem.append($('<div><input type="radio" name="dlType" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'.format(id,key,key==dlRoute.getId()?'checked':'')));});}
function addDlShareLinks(elem,coords,routeId)
{var eDownload=$('\
<div class="btn-group mr-2" role="group">\
  <a href="#" class="download btn btn-primary" title="{0}" data-toggle="tooltip" data-placement="bottom"><i class="fas fa-download"></i></a>\
  <a href="#{2}" class="share btn btn-primary" title="{1}" data-toggle="tooltip" data-placement="bottom"><i class="fas fa-share-alt"></i></a>\
</div>'.format(langDict.dlRouteTooltip,langDict.shareTooltip,routeId));eDownload.find('.download').click(()=>dlRoute.download(coords,routeId)??false).tooltip();eDownload.find('.share').click(e=>{var routeId=$(e.currentTarget).attr('href');navigator.share({title:routeId.slice(1),url:location.href.split("#")[0]+routeId});return false;}).tooltip();elem.append(eDownload);}
function addStreetViewLink(elem,coord,coordNext)
{const streetViewAt=(coord,coordNext)=>{var angle=[coordNext.lat-coord.lat,coordNext.lng-coord.lng];angle=90-Math.atan2(angle[0],angle[1])*(180/Math.PI);if(angle<-180)
angle+=360;open(huroutes.opt.streetView.format(coord.lat,coord.lng,angle),'_blank');return false;}
var eNav=$('\
<div class="btn-group mr-2" role="group" title="{0}" data-toggle="tooltip" data-placement="bottom">\
  <a href="#" class="strt-vw btn btn-primary"><i class="fas fa-street-view"></i></a>\
</div>'.format(langDict.streetViewTooltip));eNav.find('.strt-vw').click(()=>streetViewAt(coord,coordNext));eNav.tooltip();elem.append(eNav);}
function updateOptions()
{var selection=$('input[name=navProv]:checked').val();if(selection)
localStorage.navprovider=selection;selection=$('input[name=dlType]:checked').val();if(selection)
localStorage.dltype=selection;}
const fragment={isIt:str=>location.hash=='#'+str,isGeoData:(hash=null)=>(hash??location.hash).includes('#geo:'),asGeoData:(hash=null)=>{const re=/#geo:([^@]+)@(-?[0-9\\.]+),(-?[0-9\\.]+)(?:\/(?:[?&](?:b=([^&]+)))*)?/;m=re.exec(hash??location.hash);return m?{title:decodeURIComponent(m[1]),geo:L.latLng(Number(m[2]),Number(m[3])),desc:markdown.makeHtml(decodeURIComponent(m[4]??""))}:null;},get:()=>location.hash,set:(hash,state)=>fragment.get()!=hash&&history.pushState(state,'',hash)};function navigateTo(target,routeId)
{var success=false;if(typeof target==='string'||target instanceof String)
{if(fragment.isGeoData(target))
{routeId=routeId??navigateTo.lastRouteId
let data=fragment.asGeoData(target);success=data&&(activateMarker(data,routeId)??true)}
else if(target.startsWith('#'))
{routeId=target.split('#')[1];let layer=null;map.eachLayer(i=>i.routeId==routeId&&(layer=i));success=layer&&(activateRoute(layer)??true)}}
else if(target.hasOwnProperty('routeId'))
{activateRoute(target)
success=true
routeId=target.routeId;target='#'+routeId;}
if(success)
fragment.set(target,navigateTo.lastRouteId=routeId);return success;}
addEventListener('popstate',event=>{if(fragment.get())
navigateTo(fragment.get(),event.state);else
{$('.collapse').collapse('hide');removeFocus();map.flyToBounds(huroutes.opt.map.bounds);}});function removeFocus()
{try{stopFollowingLocation();}catch{}
map.eachLayer(layer=>{if(layer.focused)
{layer.setStyle(layer.options.style);layer.focused=false;}});marker.remove()}
function openRouteDesc(routeId)
{var menuItem=routeId?$('li[data-routeid='+routeId+']'):$();var related=menuItem.parents('.collapse').add(menuItem.children('.collapse'));var unrelated=$('.collapse').not(related);unrelated.collapse('hide');related.collapse('show');var scrollWait=setInterval(function(){var sidebar=$('#sidebar');if(0<sidebar.find('.collapsing').length)
return;if(menuItem.length)
{var ctrl=$([sidebar[0],$('body')[0],$('html')[0]]).filter((i,e)=>e.clientHeight<e.scrollHeight).first();ctrl.animate({scrollTop:menuItem.offset().top+sidebar.scrollTop()});}
clearInterval(scrollWait);},100);}
function activateRoute(layer)
{removeFocus();layer.setStyle(layer.options.focusedStyle);layer.focused=true;var bounds=layer.getBounds();map.flyToBounds(bounds);openRouteDesc(layer.routeId);sidebar.open();}
var marker={remove:()=>{}};function activateMarker(data,routeId)
{removeFocus();marker=L.marker(data.geo,{autoPanOnFocus:false});marker.addTo(map);body=$('<div><p><b>{0}</b></p></div>'.format(data.title));if(data.desc)
body.append($(data.desc));addPoiLinks(body,data.title,data.geo);marker.bindPopup(body[0],{autoPan:false,closeButton:false,autoClose:false,closeOnEscapeKey:false,closeOnClick:false}).openPopup();const areaAround=0.005;map.flyTo(data.geo,huroutes.opt.markers.zoomTo,{animate:true});openRouteDesc(routeId);sidebar.close();}
var markdown={engine:new showdown.Converter(),makeHtml(text)
{var ret=$(this.engine.makeHtml(text));ret.find('a[href^="#"]').click(function(){return!navigateTo(this.href);});ret.find('a:not([href^="#"])').attr('target','_blank');return ret;}}
function normRating(rat)
{var i=rat?Math.round(rat):5;if(i<1)
i=1;else if(10<i)
i=10;return i;}
function selectLanguage()
{const defaultLang=huroutes.lang[huroutes.lang.default];if(typeof(language)==='undefined')
return defaultLang;const lang=huroutes.lang[language];if(lang===undefined)
{console.error('Cannot find the requested language.');return defaultLang;}
return lang;}
function downloadString(fileName,mimeType,data,charset='utf-8')
{var anchor=$('<a id="download" style="display:none" download="{0}"/>'.format(fileName));anchor.attr('href','data:{0};charset={1},{2}'.format(mimeType,charset,encodeURIComponent(data)));$('body').append(anchor);anchor[0].click();anchor.remove();}
function initAdToast()
{setTimeout(function(){androidApToast()},5000);function androidApToast(){if(localStorage.shownAndroidAd||!navigator.userAgent.includes("Android")||navigator.userAgent.includes("huroutes"))
return;var androidToast=$('#toast-android-app')
androidToast.toast('show')
androidToast.on('hide.bs.toast',()=>localStorage.shownAndroidAd=true)
androidToast.find('a[href]').on('click',()=>androidToast.toast('hide'))}}
var sidebar={open:()=>{},close:()=>{}}
function initSidebarEvents(){class SidebarChange{constructor(){this.enabled=true;}
tempDisable()
{this.enabled=false;setTimeout(()=>this.enabled=true,200);}}
var change=new SidebarChange;var isOpen=true;sidebar.open=function()
{if(!change.enabled)
return;isOpen=true;$('#sidebar').removeClass('closed');$('#void-close-sidebar').addClass('show');$('#void-open-sidebar').removeClass('show');change.tempDisable();};sidebar.close=function()
{if(!change.enabled)
return;isOpen=false;$('#sidebar').addClass('closed');$('#void-close-sidebar').removeClass('show');$('#void-open-sidebar').addClass('show');change.tempDisable();};$('#void-open-sidebar').on('click mouseover',sidebar.open);$('#void-close-sidebar').on('click mouseover',sidebar.close);$('#void-close-sidebar').swipe({swipeLeft:sidebar.close});$('#void-open-sidebar').swipe({swipeRight:sidebar.open});if(navigator.userAgent.includes('Mobile'))
$('#sidebar').swipe({swipeLeft:sidebar.close});$(window).resize(function(){if(!isOpen&&768<$(window).innerWidth())
sidebar.open()})}})();