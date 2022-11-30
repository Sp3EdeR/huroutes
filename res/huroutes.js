/** Configuration and language string data. */
const huroutes = {
    'opt': {
        // Route drawing configuration
        'route': {
            // Route path colors; first index is for background routes, the rest are from rating 1 to 10.
            'colors': [ '#744', '#944', '#a5423f', '#b04039', '#bc3d34', '#c7392e', '#d23427', '#dd2e20', '#e92618', '#f4190e', '#f00' ],
            // Opacity values for route paths; same order as colours.
            'opacities': [   1,   0.66,      0.70,      0.75,       0.8,      0.85,       0.9,      0.95,         1,         1,      1 ],
            // The color of clicked/focused routes
            'focusColor': '#00f',
            // The opacity of clicked/focused routes
            'focusOpacity': 1
        },
        // Map display configuration
        'map': {
            // The starting view bounds for the map
            'bounds': [[48.509, 15.659], [45.742, 23.193]],
            // The map tile sources supported in the layer selector. The first one is the default map.
            'tiles': {
                'Térkép': L.tileLayer.provider('OpenStreetMap',{className: 'tile-openstreetmap'}),
                'Domborzat': L.tileLayer.provider('OpenTopoMap',{className: 'tile-opentopomap'}),
                'Műhold': L.tileLayer.provider('Esri.WorldImagery',{className: 'tile-sattelite'}),
                'Google Térkép': L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0', 'mt1', 'mt2', 'mt3'],className: 'tile-googlemap'}),
                'Google Domborzat': L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0', 'mt1', 'mt2', 'mt3'],className: 'tile-googleterrain'}),
                'Google Műhold': L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0', 'mt1', 'mt2', 'mt3'],className: 'tile-googlesattelite'})
            },
            // Choosable overlay sources supported in the layer selector. All are off by default.
            'overlays': {
                'Domborzat Kiemelés': L.tileLayer('https://map.turistautak.hu/tiles/shading/{z}/{x}/{y}.png', {attribution:'&copy; turistautak.hu',minZoom:5,maxZoom: 18,zIndex:5,className: 'overlay-dem'}),
                'Turistautak': L.tileLayer('https://{s}.tile.openstreetmap.hu/tt/{z}/{x}/{y}.png', {attribution:'&copy; turistautak.hu',minZoom:5,maxZoom: 18,zIndex:100,className: 'overlay-turistautak'})
            },
            // Overlay sources that are always shown and hidden along with specific map tile sources.
            // The name of the overlay must be the same as the tile layer to which it is bound.
            'tileOverlays': {
                'Műhold': L.tileLayer('https://map.turistautak.hu/tiles/lines/{z}/{x}/{y}.png', {attribution:'&copy; turistautak.hu',minZoom:5,maxZoom: 18,zIndex:10,className: 'overlay-satteliteroads'})
            }
        },
        // A list of navigation service providers that can be chosen for the "navigate to" links'.
        // The default provider used is the first one.
        'navLinkProviders': {
            'Google': coord => {
                const link = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination={0},{1}';
                return link.format(coord.lat, coord.lng);
            },
            'Waze': coord => {
                const link = 'https://www.waze.com/ul?ll={0}%2C{1}&navigate=yes';
                return link.format(coord.lat, coord.lng);
            },
            'Apple': coord => {
                const link = 'http://maps.apple.com/?daddr={0},{1}&dirflg=d';
                return link.format(coord.lat, coord.lng);
            }
        },
        // Route path data download formats.
        // Each config contains the file extension, mime type and format-string templates that help generate the file contents.
        // The default download format is the first one.
        'downloads': {
            'GPS Exchange Format (gpx)': {
                'ext': 'gpx',
                'mimeType': 'application/gpx+xml',
                'fileTemplate':
'<?xml version="1.0" standalone="yes"?>\
<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="huroutes" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\
<metadata>\
  <name>{0}</name>\
  <desc>Driving route downloaded from huroutes.</desc>\
  <author>huroutes</author>\
  <link>https://sp3eder.github.io/huroutes/#{0}</link>\
</metadata>\
<trk><trkseg>{1}</trkseg></trk>\
</gpx>',
                'pointTemplate': '<trkpt lat="{0}" lon="{1}"/>'
            },
            'Keyhole Markup Language (kml)': {
                'ext': 'kml',
                'mimeType': 'application/vnd.google-earth.kml+xml',
                'fileTemplate':
'<?xml version="1.0" encoding="UTF-8"?>\
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
</Document></kml>',
                'pointTemplate': '{1},{0},0 '
            }
        },
        // The street view link format-string template
        'streetView': 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={0},{1}&heading={2}',
        // Configuration for the current location or placemarkers
        'markers': {
            'zoomTo': 16 // The zoom level for the camera upon jumping to a marker
        },
        // The color themes supported by huroutes
        // The classes property specifies the CSS classes to apply to the <body> to apply the theme
        // The default theme is the first one
        'themes': {
            'Rendszer színmód használata': {
                // A special color theme - this adapts to the system or browser native color theme
                'default': 'Világos', // The default theme to use
                'mapping': {'dark': 'Sötét'} // A mapping from media query color themes to huroutes color theme
            },
            'Világos': { 'classes': ['bootstrap', 'maps-light', 'huroutes-light'] },
            'Sötét': { 'classes': ['bootstrap-dark', 'maps-dark', 'huroutes-dark'] },
            'Sötét világos térképpel': { 'classes': ['bootstrap-dark', 'maps-light', 'huroutes-dark'] }
        }
    },
    // Language configuration strings for the JS-generated content
    'lang': {
        'default': 'hu-HU', // The default language to be used in huroutes
        'hu-HU': {
            'updateDate': '<span class="update-date" title="Az útvonal legutóbbi felderítésének ideje."><i class="far fa-clock"></i> {0}</span>',
            'rating': '<span class="stars-outer" title="Az útvonal értékelése vezethetőség, változatosság, izgalom szempontjaiból." />',
            'navigation': ' Navigáció <span class="nav-start">az elejére</span> vagy <span class="nav-end">a végére</span>.',
            'navToPoi': ' Navigáció <span class="nav-start">ehhez a helyhez</span>.',
            'downloadRoute': '<span class="download">Útvonal letöltése</span>.',
            'openStreetView': '<span class="strt-vw">Street view megnyitása</span>.',
            'routeLength': 'Hossza: {0}km.',
            'locatePopup': 'Az aktuális pozícióm mutatása.'
        }
    }
};

/** A simple string formatting extension function.
  * Avoiding string templates due to their relatively late browser adoption.
  */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

// The main code is encapsulated within this closure
(function() {

var langDict = selectLanguage();    // The current language translation dictionary
var map;                            // The global map object
var nextDropId = 0;                 // Unique ID generation counter

// This is the initialization function
$(document).ready(function() {
    // Initializing the map and its contents
    map = L.map('map', { zoomControl: false }).fitBounds(huroutes.opt.map.bounds);
    const tiles = huroutes.opt.map.tiles;
    (tiles[localStorage.mapstyle] || tiles[Object.keys(tiles)[0]]).addTo(map);
    const overlays = huroutes.opt.map.overlays;
    (localStorage.overlays || '').split('|').forEach(item => {
        const overlay = overlays[item];
        if (overlay)
            overlay.addTo(map);
    });
    const tileOverlay = huroutes.opt.map.tileOverlays[localStorage.mapstyle];
    if (tileOverlay)
        tileOverlay.addTo(map);

    // Creating a separate pane for background routes to ensure that they are behind normal routes
    map.createPane('bkgRoutes');
    map.getPane('bkgRoutes').style.zIndex = 450;

    // Asynchronously loads the huroutes database
    $.getJSON('data.json', initializeContent)
        .fail(function() {
            console.error('Failed loading the route database.');
        });

    // Initializing misc. huroutes app components
    initColorSelector();
    initCtrls(tiles, overlays);
    $('#options-dialog').on('hidden.bs.modal', updateOptions);
    initSidebarEvents();
    initNavSelector();
    initDownloadTypeSelector();
    initAdToast();

    // Navigates to the page-location specified by the fragment, if any was given
    navigateTo(fragment.get())
});

/** Stops following the current location with the camera. */
var stopFollowingLocation = ()=>{};
/**
 * Initializes the display and behavior of map controllers.
 * @param {object} tiles A dictionary of map tile provider objects.
 * @param {object} overlays A dictionary of overlay tile provider objects.
 */
function initCtrls(tiles, overlays)
{
    // Zoom and scale display controls at the bottom-right
    L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // The map tile and overlay display control at the bottom-left
    L.control.layers(tiles, overlays, { position: 'bottomleft' }).addTo(map);
    map.on('baselayerchange', (layer) => {
        localStorage.mapstyle = layer.name;
        Object.entries(huroutes.opt.map.tileOverlays).forEach(([name, overlay]) => {
            if (name == layer.name)
                overlay.addTo(map);
            else if (map.hasLayer(overlay))
                overlay.remove();
        });
        const tileOverlay = huroutes.opt.map.tileOverlays[layer.name];
        if (tileOverlay)
            tileOverlay.addTo(map);
    });
    map.on('overlayadd', (overlay) => {
        var overlays = localStorage.overlays;
        overlays = overlays ? overlays.split('|') : [];
        overlays.push(overlay.name);
        localStorage.overlays = overlays.join('|');
    });
    map.on('overlayremove', (overlay) => {
        var overlays = (localStorage.overlays || '').split('|');
        const idx = overlays.indexOf(overlay.name);
        if (idx != -1)
        overlays.splice(idx, 1);
        localStorage.overlays = overlays.join('|');
    });

    // The location arrow control that allows showing the user's location, bottom-right
    var locationCtrl = L.control.locate({
        cacheLocation: false,
        clickBehavior: { inView: 'stop', outOfView: 'setView', inViewNotFollowing: 'setView' },
        initialZoomLevel: huroutes.opt.markers.zoomTo,
        keepCurrentZoomLevel: true,
        position: 'bottomright',
        flyTo: true,
        locateOptions: { enableHighAccuracy: true },
        onLocationError: () => {
            $('#toast-location-error').toast('show');
            localStorage.removeItem('showLocation');
        },
        setView: 'untilPan',
        showPopup: false,
        strings: { title: langDict.locatePopup }
    }).addTo(map);
    map.on('locateactivate', () => localStorage.showLocation = true);
    map.on('locatedeactivate', () => localStorage.removeItem('showLocation'));
    if (localStorage.showLocation)
    {
        var oldView = locationCtrl.options.setView;
        locationCtrl.options.setView = false;
        locationCtrl.start();
        locationCtrl.options.setView = oldView;
        try { locationCtrl.stopFollowing(); } catch { }
    }
    stopFollowingLocation = () => locationCtrl.stopFollowing();
}

/**
 * Loads route data into the web application.
 * @param {object} data The huroutes database.
 */
function initializeContent(data)
{
    if (!Array.isArray(data) || !data.length)
    {
        console.error('The map data is empty.');
        return;
    }
    addDataGroup($('#menubox'), null, data);
}

/**
 * Adds the contents of a data group (menu) to the main menu.
 * @param {jquery} parentElem The menu element that receives generated content.
 * @param {string} id The ID string assigned to the menu item.
 * @param {object} content The huroutes database fragment contained by this group.
 */
function addDataGroup(parentElem, id, content)
{
    var elem = $('<ul class="menu list-unstyled components"/>');
    if (id)
    {
        elem.prop('id', id);
        elem.addClass('collapse');
    }
    content.forEach(item => {
        addDataItem(elem, item);
    });
    parentElem.append(elem);
}

/**
 * Adds the contents of the data item to the main menu.
 * @param {jquery} parentElem The menu element that receives generated content.
 * @param {object} item The huroutes database fragment that describes this item.
 */
function addDataItem(parentElem, item)
{
    if (!item.ttl)
    {
        console.error('Titleless menu item defined in the database.');
        return;
    }
    var elem = $('<li class="menu"/>');
    if (Array.isArray(item.cnt))
    {
        var dropId = createMenuItem(elem, item);
        addDataGroup(elem, dropId, item.cnt);
    }
    else if (item.kml)
        createMenuRouteItem(elem, item);
    else
        console.error(item.ttl + ' is an unknown item type.')
    parentElem.append(elem);
}

/**
 * Creates a DOM menu item.
 * @param {jquery} elem The element that will contain the generated DOM.
 * @param {object} data The huroutes database fragment that describes the menu item.
 * @returns 
 */
function createMenuItem(elem, data)
{
    var dropId = 'menu' + nextDropId++;
    elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl));
    if (data.md || data.kml || data.pnt)
        console.error('Menu {0} contains route data that it should not.'.format(data.ttl));
    return dropId;
}

/**
 * Creates a DOM menu item that represents a route.
 * @param {jquery} elem The element that will contain the generated DOM.
 * @param {object} data The huroutes database fragment that describes the route.
 */
function createMenuRouteItem(elem, data)
{
    elem.addClass('menuitem');
    var dropId = 'menu' + nextDropId++;
    elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl).click(function() {
        navigateTo('#' + $(this).parents('li').first().attr('data-routeid'));
    }));
    var elemDiv = $('<div class="menu list-unstyled collapse panel"/>').prop('id', dropId);
    createInfoPanel(elemDiv, data);
    elem.append(elemDiv);
    var routeId = addRoute(data);
    elem.attr('data-routeid', routeId);
}

/**
 * Creates an info panel in the menu that describes the route.
 * @param {jquery} elem The element that will contain the generated DOM.
 * @param {object} data The huroutes database fragment that describes the route.
 */
function createInfoPanel(elem, data)
{
    // Checking for database issues
    if (!data.bkg)
    {
        if (!data.rat)
            console.warn('No rating given for ' + data.ttl);
        if (!data.upd)
            console.warn('No last update date given for ' + data.ttl);
    }
    // Creating the route heading with rating and date
    if (data.rat || data.upd)
    {
        var elemHeader = $('<p class="route-header"/>');
        if (data.upd)
        {
            elemHeader.append($(langDict.updateDate.format(data.upd)));
        }
        if (data.rat)
        {
            var rating = normRating(data.rat);
            var starsInner = $('<span class="stars-inner" style="width:{0};" />'.format(rating * 10 + '%'));
            for (var i = 0; i < 5; ++i)
                starsInner.append($('<i class="fas fa-star"></i>'));
            var starsOutter = $(langDict.rating);
            for (var i = 0; i < 5; ++i)
                starsOutter.append($('<i class="far fa-star"></i>'));
            starsOutter.append(starsInner);
            elemHeader.append(starsOutter);
        }
        elem.append(elemHeader);
    }
    // Creating the route description panel with markdown contents
    if (data.md)
    {
        var descCont = $('<div class="route-desc"/>');
        const addMarkdown = text => descCont.append($(markdown.makeHtml(text)));
        if (data.md.substr(-3) === '.md')
            $.ajax(data.md)
                .then(addMarkdown, function() {
                    console.log('Error loading details for ' + data.ttl);
                });
        else
            addMarkdown(data.md);
        elem.append(descCont);
    }
    else
        console.warn('No description given for ' + data.ttl);
    elem.append($('<div class="route-links"/>'));
}

/**
 * Adds a route to the map and adds some stats on it into the menu.
 * @param {object} data The huroutes database fragment that describes the route.
 * @returns {string} The added route's unique ID.
 */
function addRoute(data)
{
    const colors = huroutes.opt.route.colors;
    const opacities = huroutes.opt.route.opacities;

    var routeId = data.kml.match(/data\/([\w-]+).kml/)[1];
    var rating = normRating(data.rat);
    var pathWeight = 3 + (!data.bkg && rating / 2);
    var layer = L.geoJson(null, {
        filter: feature => feature.geometry.type == "LineString",
        pane: data.bkg ? 'bkgRoutes' : 'shadowPane',
        style: {
            color: data.bkg ? colors[0] : colors[rating],
            opacity: data.bkg ? opacities[0] : opacities[rating],
            weight: pathWeight
        },
        focusedStyle: {
            color: huroutes.opt.route.focusColor,
            opacity: huroutes.opt.route.focusOpacity,
            weight: pathWeight + 2
        }
    });
    layer.on('click', event => !navigateTo(event.target));
    layer.on('mouseover', event => event.target.focused || event.target.setStyle(event.target.options.focusedStyle));
    layer.on('mouseout', event => event.target.focused || event.target.setStyle(event.target.options.style));
    layer.on('layeradd', event => {
        var elem = $('li[data-routeid={0}] .route-links'.format(routeId));

        var coords = event.layer.getLatLngs();
        if (Array.isArray(coords) && 2 <= coords.length)
        {
            // Add statistics and links for this route to the menu.
            var length = 0.0;
            for (var i = 1; i < coords.length; ++i)
                length += coords[i - 1].distanceTo(coords[i]);
            elem.append($(('<p>' + langDict.routeLength + '</p>').format((length / 1000).toFixed(1))));
            var elemLinks = $('<p/>');
            addNavigationLinks(elemLinks, coords[0], coords[coords.length - 1]);
            elemLinks.append($('<br/>'));
            addDownloadLink(elemLinks, coords, routeId);
            elemLinks.append($('<br/>'));
            var mididx = Math.floor(coords.length / 2);
            addStreetViewLink(elemLinks, coords[mididx], coords[mididx + 1]);
            elem.append(elemLinks);
        }

        if (fragment.isIt(routeId))
            navigateTo(layer); // event.layer is a different instance; must use layer from closure
    });
    layer.routeId = routeId;
    // Load the KML file data into the Leaflet layer
    omnivore.kml(data.kml, null, layer).addTo(map);
    return routeId;
}

/**
 * Initializes the color theme selector configuration
 */
function initColorSelector()
{
    const themes = huroutes.opt.themes;
    // Returns an array with duplicate elements filtered
    const uniqueArray = arr => $.grep(arr, (item, idx) => idx === $.inArray(item, arr));
    // A variable that holds all theme CSS classes (for cleanup)
    const allThemeClasses = uniqueArray($.map(
        Object.values(themes).filter(i => i.classes != undefined), i => i.classes
    ));
    // Gets the current theme - the default if localStorage is unset
    const currentColorTheme = () => themes[localStorage.theme] ? localStorage.theme : Object.keys(themes)[0];
    // Returns whether the given theme is the system color theme
    const isSystemColorTheme = themeName => !themes[themeName].classes;
    // Returns a media query string to test for the given color theme
    const getMediaQuery = color => '(prefers-color-scheme: {0})'.format(color);

    /**
     * Applies the given theme to the DOM by settings its classes for the body tag.
     * @param {string} themeName The name of the theme to apply.
     */
    function applyTheme(themeName)
    {
        let data = themes[themeName];
        if (isSystemColorTheme(themeName))
        {
            let selected = data.default;
            $.each(data.mapping, (color, themeName) => {
                if (matchMedia(getMediaQuery(color)).matches)
                    selected = themeName;
            });
            applyTheme(selected);
        }
        else
            $('body').removeClass(allThemeClasses).addClass(data.classes);
    }

    applyTheme(currentColorTheme());
    
    // Install a media changed event listener to change themes on system color theme change
    const handleMediaChanged =
        e => isSystemColorTheme(currentColorTheme()) && applyTheme(currentColorTheme());
    let media = matchMedia(getMediaQuery('dark'))
    if (media.addEventListener)
        media.addEventListener('change', handleMediaChanged);
    else
        media.addListener(handleMediaChanged);

    // Generate the config dialog DOM
    var elem = $('#color-themes');
    $.each(themes, (theme, data) => {
        const id = theme.toLowerCase().replace(/ /g, '');
        let elemOpt = $('<div><input type="radio" name="theme" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'
            .format(id, theme, theme == currentColorTheme() ? 'checked' : ''));
        elemOpt.children('input').click(() => applyTheme(localStorage.theme = theme));
        elem.append(elemOpt);
    });

}

/** Singleton for managing the navigation link provider configuration. */
var navigation = {
    /** Shorthand for the navigation link providers data. */
    provs: huroutes.opt.navLinkProviders,
    /** Returns the currently selected navigation provider ID. */
    getId: function() {
        return this.provs[localStorage.navprovider] ? localStorage.navprovider : Object.keys(this.provs)[0];
    },
    /** Returns a navigation link. */
    getLink: function(coord) { return this.provs[this.getId()](coord); }
}

/** Initializes the navigation link configuration. */
function initNavSelector()
{
    var elem = $('#nav-options');
    $.each(navigation.provs, (key, value) => {
        const id = key.toLowerCase().replace(/ /g, '');
        elem.append(
            $('<div><input type="radio" name="navProv" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'
                .format(id, key, key == navigation.getId() ? 'checked' : '')));
    });
}

/**
 * Wraps the given HTML into a single element for easier manipulation.
 * @param {jquery} html The HTML to wrap.
 * @returns {jquery} The wrapped HTML code.
 */
function makeSectionElement(html)
{
    return $('<span> {0}</span>'.format(html));
}

/**
 * Initiates planning to the selected coordinate with the configured provider.
 * @param {object} coord A WGS84 coordinate object with lat and lng properties.
 * @returns false.
 */
function planTo(coord)
{
    open(navigation.getLink(coord), '_blank');
    return false;
}

/**
 * Creates navigation links for routes.
 * @param {jquery} elem The element that will contain the navigation link DOM.
 * @param {object} start The coordinate where the "start" link navigates to.
 * @param {object} end The coordinate where the "end" link navigates to.
 */
function addNavigationLinks(elem, start, end)
{
    var eNav = makeSectionElement(langDict.navigation);
    var eStart = eNav.find('span.nav-start');
    eStart.replaceWith($('<a href="#" />').append(eStart.html()).click(() => planTo(start)));
    var eEnd = eNav.find('span.nav-end');
    eEnd.replaceWith($('<a href="#" />').append(eEnd.html()).click(() => planTo(end)));
    elem.append(eNav);
}

/**
 * Creates a navigation link for a place marker.
 * @param {jquery} elem The element that will contain the navigation link DOM.
 * @param {*} coord The coordinate where the link navigates to.
 */
function addPoiNavigationLinks(elem, coord)
{
    var eNav = $('<p> {0}</p>'.format(langDict.navToPoi));
    var eStart = eNav.find('span.nav-start');
    eStart.replaceWith($('<a href="#" />').append(eStart.html()).click(() => planTo(coord)));
    elem.append(eNav);
}

/** Singleton for managing route downloading format configuration. */
var dlRoute = {
    /** Shorthand for the route download format data. */
    fmts: huroutes.opt.downloads,
    /** Returns the currently selected route format ID. */
    getId: function() {
        return this.fmts[localStorage.dltype] ? localStorage.dltype : Object.keys(this.fmts)[0];
    },
    /** Initiates the download of the route in the selected format. */
    download: function(coords, routeId) {
        var fmt = this.fmts[this.getId()];
        var file = fmt.fileTemplate.format(
            routeId,
            coords.map(coord => fmt.pointTemplate.format(coord.lat, coord.lng)).join(''));
        downloadString(routeId + '.' + fmt.ext, fmt.mimeType, file);
    }
}

/** Initializes the download format configuration. */
function initDownloadTypeSelector()
{
    var elem = $('#download-types');
    $.each(dlRoute.fmts, (key, value) => {
        const id = key.toLowerCase().replace(/ /g, '');
        elem.append(
            $('<div><input type="radio" name="dlType" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'
                .format(id, key, key == dlRoute.getId() ? 'checked' : '')));
    });
}

/**
 * Creates a download link for routes.
 * @param {jquery} elem The element that will contain the download link DOM.
 * @param {object} coords The array of coordinates that make the route path up.
 * @param {string} routeId The route's unique ID.
 */
function addDownloadLink(elem, coords, routeId)
{
    var eDownload = makeSectionElement(langDict.downloadRoute);
    var eLink = eDownload.find('span.download');
    eLink.replaceWith($('<a href="#"/>').append(eLink.html()).click(() => dlRoute.download(coords, routeId) ?? false));
    elem.append(eDownload);
}

/**
 * Creates a street view link for routes.
 * @param {jquery} elem The element that will contain the street view link DOM.
 * @param {object} coord The coordinate where street view is to be opened.
 * @param {object} coordNext The coordinate toward which the street view camera is to be aimed.
 */
 function addStreetViewLink(elem, coord, coordNext)
{
    const streetViewAt = (coord, coordNext) => {
        var angle = [ coordNext.lat - coord.lat, coordNext.lng - coord.lng ];
        angle = 90 - Math.atan2(angle[0], angle[1]) * (180/Math.PI);
        if (angle < -180)
            angle += 360;
        open(huroutes.opt.streetView.format(coord.lat, coord.lng, angle), '_blank');
        return false;
    }
    var eNav = makeSectionElement(langDict.openStreetView);
    var eLink = eNav.find('span.strt-vw');
    eLink.replaceWith($('<a href="#"/>').append(eLink.html()).click(() => streetViewAt(coord, coordNext)));
    elem.append(eNav);
}

/** Stores the app options according to the user's selection. */
function updateOptions()
{
    var selection = $('input[name=navProv]:checked').val();
    if (selection)
        localStorage.navprovider = selection;
    selection = $('input[name=dlType]:checked').val();
    if (selection)
        localStorage.dltype = selection;
}

/** A singleton that helps with (de)coding the URL fragment. */
const fragment = {
    /**
     * Tests whether the given string is the current fragment.
     * @param {string} str The string tested.
     * @returns true if this is the current fragment, false otherwise.
     */
    isIt: str => location.hash == '#' + str,

    /**
     * Returns whether the given string or the current fragment is a geo: link.
     * @param {string} hash Optional. If given, tests whether the string starts with #geo.
     */
    isGeoData: (hash = null) => (hash ?? location.hash).includes('#geo:'),
    /**
     * Decodes the given string or the current fragment as a geo: link.
     * @param {string} hash Optional. If given, decodes the string's contents.
     * @returns {object} The geo: link data.
     */
    asGeoData: (hash = null) => {
        const re = /#geo:([^@]+)@(-?[0-9\\.]+),(-?[0-9\\.]+)(?:\/(?:[?&](?:b=([^&]+)))*)?/;
        m = re.exec(hash ?? location.hash);
        return m ? {
            title: decodeURIComponent(m[1]),
            geo: L.latLng(Number(m[2]), Number(m[3])),
            desc: markdown.makeHtml(decodeURIComponent(m[4] ?? ""))
        } : null;
    },
    /** Returns the current fragment. */
    get: () => location.hash,
    /** Changes the current fragment by pushing a history state. */
    set: (hash, state) => fragment.get() != hash && history.pushState(state, '', hash)
};

/**
 * Displays the specified route on screen in the menu and map.
 * @param {string|object} target A fragment representing a route ID or a route layer to view.
 * @param {string} routeId The route's unique ID.
 * @returns true if the route was found, false otherwise.
 */
function navigateTo(target, routeId) // target accepts fragment string and layer
{
    var success = false;
    if (typeof target === 'string' || target instanceof String)
    {
        if (fragment.isGeoData(target))
        {
            routeId = routeId ?? navigateTo.lastRouteId
            let data = fragment.asGeoData(target);
            success = data && (activateMarker(data, routeId) ?? true)
        }
        else if (target.startsWith('#'))
        {
            routeId = target.split('#')[1];
            let layer = null;
            map.eachLayer(i => i.routeId == routeId && (layer = i));
            success = layer && (activateRoute(layer) ?? true)
        }
    }
    else if (target.hasOwnProperty('routeId'))
    {
        activateRoute(target)
        success = true
        routeId = target.routeId;
        target = '#' + routeId;
    }
    if (success)
        fragment.set(target, navigateTo.lastRouteId = routeId);
    return success;
}

// Handles browser back/forward navigation.
addEventListener('popstate', event => {
    if (fragment.get())
        navigateTo(fragment.get(), event.state);
    else
    {
        $('.collapse').collapse('hide');
        removeFocus();
        map.flyToBounds(huroutes.opt.map.bounds);
    }
});

/**
 * Removes map focus from everything:
 * - The current location is no longer followed.
 * - The current route no longer has the focused style.
 * - The active placemarker is hidden.
 */
function removeFocus()
{
    try { stopFollowingLocation(); } catch { }
    map.eachLayer(layer => {
        if (layer.focused)
        {
            layer.setStyle(layer.options.style);
            layer.focused = false;
        }
    });
    marker.remove()
}

/** Opens the specified route's menu while closing all other menus. */
function openRouteDesc(routeId)
{
    var menuItem = routeId ? $('li[data-routeid=' + routeId + ']') : $();
    var related = menuItem.parents('.collapse').add(menuItem.children('.collapse'));
    var unrelated = $('.collapse').not(related);
    unrelated.collapse('hide');
    related.collapse('show');
    var scrollWait = setInterval(function() {
        var sidebar = $('#sidebar');
        if (0 < sidebar.find('.collapsing').length)
            return;
        if (menuItem.length)
        {
            var ctrl = $([sidebar[0], $('body')[0], $('html')[0]]).filter((i, e) => e.clientHeight < e.scrollHeight).first();
            ctrl.animate({ scrollTop: menuItem.offset().top + sidebar.scrollTop() });
        }
        clearInterval(scrollWait);
    }, 100);
}

/** Does the complete process to set the given route as the active one. */
function activateRoute(layer)
{
    removeFocus();
    layer.setStyle(layer.options.focusedStyle);
    layer.focused = true;

    var bounds = layer.getBounds();
    map.flyToBounds(bounds);

    openRouteDesc(layer.routeId);
    sidebar.open();
}

/** A marker object that can be used to manipulate the active placemarker. no-op by default. */
var marker = {remove:()=>{}};
/**
 * Displays and views the given place marker.
 * When a valid route ID is given, the route's description is opened. Otherwise the menu is closed.
 * @param {object} data The placemarker's data to show.
 * @param {string} routeId The ID of the route associated with this placemarker.
 */
function activateMarker(data, routeId)
{
    removeFocus();

    marker = L.marker(data.geo, {autoPanOnFocus: false});
    marker.addTo(map);
    body = $('<div><p><b>{0}</b></p></div>'.format(data.title));
    if (data.desc)
        body.append($(data.desc));
    addPoiNavigationLinks(body, data.geo);
    marker.bindPopup(body[0], {
        autoPan: false, closeButton: false, autoClose: false, closeOnEscapeKey: false,
        closeOnClick: false
    }).openPopup();
    const areaAround = 0.005;
    map.flyTo(data.geo, huroutes.opt.markers.zoomTo, {animate:true});

    openRouteDesc(routeId);
    sidebar.close();
}

/** A singleton that helps with Markdown processing. */
var markdown = {
    /** The markdown processor engine instance. */
    engine: new showdown.Converter(),
    /** Returns HTML from the given Markdown text. */
    makeHtml(text)
    {
        var ret = $(this.engine.makeHtml(text));
        ret.find('a[href^="#"]').click(function() { return !navigateTo(this.href); });
        ret.find('a:not([href^="#"])').attr('target', '_blank');
        return ret;
    }
}

/** Normalizes potentially bogus ratings to valid values. */
function normRating(rat)
{
    var i = rat ? Math.round(rat) : 5;
    if (i < 1)
        i = 1;
    else if (10 < i)
        i = 10;
    return i;
}

/** Returns the currently selected language translation data. */
function selectLanguage()
{
    const defaultLang = huroutes.lang[huroutes.lang.default];
    if (typeof(language) === 'undefined')
        return defaultLang;
    const lang = huroutes.lang[language];
    if (lang === undefined)
    {
        console.error('Cannot find the requested language.');
        return defaultLang;
    }
    return lang;
}

/**
 * Initiates the download of the given string as a file.
 * @param {string} fileName The name of the file to download the string as.
 * @param {string} mimeType The MIME type of the file to be downloaded.
 * @param {string} data The string that is to be the content of the file.
 * @param {string} charset The encoding of the downloaded file.
 */
function downloadString(fileName, mimeType, data, charset = 'utf-8')
{
    var anchor = $('<a id="download" style="display:none" download="{0}"/>'.format(fileName));
    anchor.attr('href', 'data:{0};charset={1},{2}'.format(mimeType, charset, encodeURIComponent(data)));
    $('body').append(anchor);
    anchor[0].click();
    anchor.remove();
}

/** Initializes toast messages to be displayed to the user */
function initAdToast()
{
    // Wait a bit before doing toasts
    setTimeout(function() {
        androidApToast()
    }, 5000);

    /** Shows a toast to Android users that don't use the app that it is available. */
    function androidApToast() {
        if (localStorage.shownAndroidAd || !navigator.userAgent.includes("Android") ||
            navigator.userAgent.includes("huroutes"))
            return;

        var androidToast = $('#toast-android-app')
        androidToast.toast('show')
        // The toast is not shown again once closed.
        androidToast.on('hide.bs.toast', () => localStorage.shownAndroidAd = true)
        androidToast.find('a[href]').on('click', () => androidToast.toast('hide'))
    }
}

/** A singleton that contains sidebar manipulation functions. */
var sidebar = {
    /** Opens the sidebar when in mobile portrait view */
    open: ()=>{},
    /** Closes the sidebar when in mobile portrait view */
    close: ()=>{}
}
/**
 * Initializes sidebar opening and closing events for mobile portrait view.
 */
function initSidebarEvents() {
    // This class prevents mouseover reopening after a swipe-close
    class SidebarChange {
        constructor() { this.enabled = true; }
        tempDisable()
        {
            this.enabled = false;
            setTimeout(() => this.enabled = true, 200);
        }
    }
    var change = new SidebarChange;
    var isOpen = true;
    // Exported function to open the sidebar
    sidebar.open = function()
    {
        if (!change.enabled)
            return;
        isOpen = true;
        $('#sidebar').removeClass('closed');
        $('#void-close-sidebar').addClass('show');
        $('#void-open-sidebar').removeClass('show');
        change.tempDisable();
    };
    // Exported function to close the sidebar
    sidebar.close = function()
    {
        if (!change.enabled)
            return;
        isOpen = false;
        $('#sidebar').addClass('closed');
        $('#void-close-sidebar').removeClass('show');
        $('#void-open-sidebar').addClass('show');
        change.tempDisable();
    };

    // Clicking, tapping, hovering and swiping events on "void" panels
    $('#void-open-sidebar').on('click mouseover', sidebar.open);
    $('#void-close-sidebar').on('click mouseover', sidebar.close);
    $('#void-close-sidebar').swipe({ swipeLeft: sidebar.close });
    $('#void-open-sidebar').swipe({ swipeRight: sidebar.open });
    if (navigator.userAgent.includes('Mobile'))
        $('#sidebar').swipe({ swipeLeft: sidebar.close });
    // Reopen when switching to side-by-side
    $(window).resize(function() {
        if (!isOpen && 768 < $(window).innerWidth())
        sidebar.open()
    })
}

})();
