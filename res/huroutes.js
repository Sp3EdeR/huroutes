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
                'Map': L.tileLayer.provider('OpenStreetMap',{className: 'tile-openstreetmap'}),
                'Terrain': L.tileLayer.provider('OpenTopoMap',{className: 'tile-opentopomap'}),
                'Satellite': L.tileLayer.provider('Esri.WorldImagery',{className: 'tile-satellite'}),
                'Google Map': L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0', 'mt1', 'mt2', 'mt3'],className: 'tile-googlemap'}),
                'Google Terrain': L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0', 'mt1', 'mt2', 'mt3'],className: 'tile-googleterrain'}),
                'Google Satellite': L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{attribution:'&copy; Google Maps',minZoom:5,maxZoom:18,subdomains:['mt0', 'mt1', 'mt2', 'mt3'],className: 'tile-googlesatellite'})
            },
            // Choosable overlay sources supported in the layer selector. All are off by default.
            'overlays': {
                'Elevation Shading': L.tileLayer('https://map.turistautak.hu/tiles/shading/{z}/{x}/{y}.png', {attribution:'&copy; turistautak.hu',minZoom:5,maxZoom: 18,zIndex:5,className: 'overlay-dem'}),
                'Curvature': L.layerGroup()
            },
            // Overlay sources that are always shown and hidden along with specific map tile sources.
            // The name of the overlay must be the same as the tile layer to which it is bound.
            'tileOverlays': {},
            // Curvature data definition, used to populate the Curvature overlay when first viewed.
            // The layer's data is prepared by the build-website github action.
            'curvatureData': {
                // Workaround: cannot give it the "geojson" extension, because Google Translate
                // blocks ajax requests to most extensions, but not json.
                'geojson': 'map/curves.geo.json',
                'style': 'map/curves-style.json',
                'attribution': 'Curves: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            'System Theme': {
                // A special color theme - this adapts to the system or browser native color theme
                'default': 'Bright', // The default theme to use
                'mapping': {'dark': 'Dark'} // A mapping from media query color themes to huroutes color theme
            },
            'Bright': { 'classes': ['bootstrap', 'maps-light', 'huroutes-light'] },
            'Dark': { 'classes': ['bootstrap-dark', 'maps-dark', 'huroutes-dark'] },
            'Dark with bright map': { 'classes': ['bootstrap-dark', 'maps-light', 'huroutes-dark'] }
        },
        // Options for the tooltip display:
        // https://getbootstrap.com/docs/4.0/components/tooltips/#options
        'tooltip': {
            boundary: 'viewport',
            placement: 'bottom'
        },
        // Translation languages and flags to show:
        'l10n': {
            'providers': {
                'Google': {
                    'url': 'https://translate.google.com/translate?sl={0}&tl={1}&u={2}',
                    'getCurrentLang': () => $('head meta[http-equiv="X-Translated-To"][content]').attr('content'),
                    'langs': [
                        ['hu'], // Hungarian
                        ['en','gb'], // English
                        ['de'], // German
                        ['fr'], // French
                        ['es'], // Spanish
                        ['it'], // Italian
                        ['pl'], // Polish
                        ['uk', 'ua'], // Ukrainian
                        ['ro'], // Romanian
                        ['sk'], // Slovakian
                        ['cs','cz'], // Czech
                        ['sl','si'], // Slovenian
                        ['hr'], // Croatian
                        ['nl'], // Dutch
                        ['da','dk'], // Danish
                        ['pt'] // Portugese
                    ]
                }
            }
        }
    },
    // Language configuration strings for the JS-generated content
    // This is to be filled out by the HTML file
    'lang': {}
};

/** A simple string formatting extension function.
  * Avoiding string templates due to their relatively late browser adoption.
  */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

/** Creates a short tooltip initialization method with huroutes options. */
$.fn.initTooltip = function() {
    return this.each(function() { $(this).tooltip(huroutes.opt.tooltip); });
};

// The main code is encapsulated within this closure
(function() {

var langDict;           // The current language translation dictionary
var map;                // The global map object
var nextDropId = 0;     // Unique ID generation counter

// This is the initialization function
$(document).ready(function() {
    langDict = selectLanguage();

    // Initializing the map and its contents
    map = L.map('map', { zoomControl: false }).fitBounds(huroutes.opt.map.bounds);
    const tiles = huroutes.opt.map.tiles;
    (tiles[localStorage.mapstyle] || tiles[Object.keys(tiles)[0]]).addTo(map);
    const overlays = huroutes.opt.map.overlays;
    (localStorage.overlays || '').split('|').forEach(item => {
        const overlay = overlays[item];
        if (overlay)
        {
            overlay.addTo(map);
            initLazyOverlay(item, overlay);
        }
    });
    const tileOverlay = huroutes.opt.map.tileOverlays[localStorage.mapstyle];
    if (tileOverlay)
        tileOverlay.addTo(map);

    // Creating a separate pane for background routes to ensure that they are behind normal routes
    map.createPane('bkgRoutes');
    map.getPane('bkgRoutes').style.zIndex = 450;

    // Asynchronously loads the huroutes database
    getJSON('data.json', initializeContent);

    // Initializing misc. huroutes app components
    initColorSelector();
    initLangSelector();
    initCtrls(tiles, overlays);
    $('#options-dialog').on('hidden.bs.modal', updateOptions);
    $('.options-button [title]').initTooltip();
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
    L.control.zoom({
        position: 'bottomright',
        zoomInTitle: langDict.zoomInTooltip,
        zoomOutTitle: langDict.zoomOutTooltip
    }).addTo(map);

    // The map tile and overlay display control at the bottom-left
    const l10nTile = tiles => Object.entries(tiles).reduce((acc, [key, val]) => {
        val.id = key; // Store the identifier within the layer for identification
        acc[langDict.map[key] || key] = val;
        return acc;
    }, {});
    L.control.layers(l10nTile(tiles), l10nTile(overlays), { position: 'bottomleft' }).addTo(map);
    map.on('baselayerchange', (layer) => {
        localStorage.mapstyle = layer.layer.id;
        Object.entries(huroutes.opt.map.tileOverlays).forEach(([name, overlay]) => {
            if (name == layer.layer.id)
                overlay.addTo(map);
            else if (map.hasLayer(overlay))
                overlay.remove();
        });
    });
    map.on('overlayadd', (overlay) => {
        var overlays = localStorage.overlays;
        overlays = overlays ? overlays.split('|') : [];
        overlays.push(overlay.layer.id);
        localStorage.overlays = overlays.join('|');

        initLazyOverlay(overlay.layer.id, overlay.layer);
    });
    map.on('overlayremove', (overlay) => {
        var overlays = (localStorage.overlays || '').split('|');
        const idx = overlays.indexOf(overlay.layer.id);
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
        strings: { title: langDict.locateTooltip }
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

    $('.leaflet-control-zoom, .leaflet-control-locate').find('[title]').initTooltip();

    // Prevent right click menu on tooltipped elements.
    // This must be a capturing event to be before leaflet binds.
    document.addEventListener('contextmenu', e => {
        if ($(e.target).is('[title]') || $(e.target).parents('[title]').length)
            e.preventDefault();
    }, true);
}

/**
 * Initializes data inside of a layer group on demand.
 * @param {string} id The overlay identifier.
 * @param {object} lg A Leaflet layerGroup object to which the data is added.
 */
function initLazyOverlay(id, lg)
{
    // Only populate empty layerGroups with data.
    if (!lg.getLayers || lg.getLayers().length != 0)
        return;

    // Initialize the Curvature lazy overlay's contents.
    if (id == 'Curvature')
    {
        const cfg = huroutes.opt.map.curvatureData;
        $.when(getJSON(cfg.geojson), getJSON(cfg.style)).done((r1, r2) => {
            const styleMap = r2[0];
            lg.addLayer(L.geoJson(r1[0], {
                attribution: cfg.attribution,
                style: (feature) =>
                    feature.properties.styleUrl && styleMap[feature.properties.styleUrl]
            }));
        });
    }
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
            var eUpd = $('\
<span class="update-date" title="{0}">\
  <i class="far fa-clock"></i> {1}\
</span>'.format(langDict.updateDate, data.upd)).initTooltip();
            elemHeader.append(eUpd);
        }
        if (data.rat)
        {
            var starsOutter = $('<span class="stars-outer" title="{0}"/>'.format(
                langDict.rating
            )).initTooltip();
            for (var i = 0; i < 5; ++i)
                starsOutter.append($('<i class="far fa-star"></i>'));
            var rating = normRating(data.rat);
            var starsInner = $('<span class="stars-inner" style="width:{0};" />'.format(rating * 10 + '%'));
            for (var i = 0; i < 5; ++i)
                starsInner.append($('<i class="fas fa-star"></i>'));
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

    var routeId = data.id || data.kml.match(/data\/([\w-]+).kml/)[1];
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
            var elemLinks = $('<div class="route-ctrls btn-toolbar" role="toolbar"/>');
            addNavigationLinks(elemLinks, coords[0], coords[coords.length - 1], length);
            var mididx = Math.floor(coords.length / 2);
            addStreetViewLink(elemLinks, coords[mididx], coords[mididx + 1]);
            elem.append(elemLinks);
            addDlShareLinks(elemLinks, coords, routeId);
        }

        if (fragment.isIt(routeId))
            navigateTo(layer); // event.layer is a different instance; must use layer from closure
    });
    layer.routeId = routeId;
    // Load the KML file data into the Leaflet layer
    // This is done asynchronously to avoid blocking rendering for too long
    if (data.kml.substr(-4) === '.kml')
        // Omnivore loads the URL asynchronously with XHR
        omnivore.kml(data.kml, null, layer).addTo(map);
    else
        // The 0-timeout runs the function asynchronously
        tmout = setTimeout(() => {
            omnivore.kml.parse(data.kml, null, layer).addTo(map);
            clearTimeout(tmout);
        }, 0);
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
        let elemOpt = $('<div><input type="radio" name="theme" id="{0}" value="{1}" {3}> <label for="{0}">{2}</label></div>'
            .format(
                id, theme, langDict.themes[theme] || theme,
                theme == currentColorTheme() ? 'checked' : ''));
        elemOpt.children('input').click(() => applyTheme(localStorage.theme = theme));
        elem.append(elemOpt);
    });

}

/**
 * Detects whether the site is running within Google Translate.
 * When not running inside Google Translate, it returns `undefined`.
 * When running inside Google Translate, it returns the "base" URL of the site.
 */
function getGoogleTranslateBase()
{
    url = $('head base[href]').attr('href');
    if (url)
        url = url.split('?')[0].replace(/[^/]+\.[^\s\./]{3,5}$/, '');
    return url;
}

/**
 * Initializes the language selection
 * 
 * This language selector uses Google Translate for the target languages
 */
function initLangSelector()
{
    provider = huroutes.opt.l10n.providers.Google;
    sourceLang = $('html').attr('lang');
    lang = provider.getCurrentLang() || sourceLang;
    langIdx = provider.langs.findIndex(lng => lng[0] == lang);
    lang = 0 <= langIdx ? provider.langs.splice(langIdx, 1)[0] : provider.langs[0];

    $('#sidebar .dropdown-toggle').append($('<span class="fi fi-{0}">'.format(lang[lang.length - 1])));
    $('#sidebar .dropdown-menu').append(provider.langs.map(lang => {
        var url = (getGoogleTranslateBase() || location.origin + location.pathname);
        if (lang[0] != sourceLang)
            url = provider.url.format(sourceLang, lang[0], url);
        return $('<a href="#"><span class="fi fi-{0}"/></a>'.format(lang[lang.length - 1])).click(
            () => { location = url + location.hash; return false; }
        );
    }));
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
 * @param {number} length The length of the route in kms.
 */
function addNavigationLinks(elem, start, end, length)
{
    var eNav = $('\
<div class="btn-group mr-2 mt-2" role="group">\
  <a href="#" class="nav-start btn" title="{0}"><i class="fas fa-step-backward"></i></a>\
  <span class="btn" title="{1}"><i class="fas fa-route"></i> <sub>{2}</sub></span>\
  <a href="#" class="nav-end btn" title="{3}"><i class="fas fa-step-forward"></i></a>\
</div>'.format(langDict.navStartTooltip, langDict.navLength, langDict.routeLength(length), langDict.navEndTooltip));
    eNav.find('.nav-start').click(() => planTo(start));
    eNav.find('.nav-end').click(() => planTo(end));
    eNav.find('[title]').initTooltip();
    elem.append(eNav);
}

/**
 * Creates links for a place marker.
 * @param {jquery} elem The element that will contain the generated links.
 * @param {string} title The POI's title.
 * @param {*} coord The coordinate of the link.
 */
function addPoiLinks(elem, title, coord)
{
    var eLinks = $('<p> {0} {1}</p>'.format(langDict.navToPoi, langDict.sharePoi));
    var eNav = eLinks.find('.nav-start');
    eNav.replaceWith($('<a href="#" />').append(eNav.html()).click(() => planTo(coord)));
    var eShare = eLinks.find('.share');
    eShare.replaceWith($('<a href="#" />').append(eShare.html()).click(() => {
        navigator.share({
            title: title,
            url: location.href // Only a single POI is shown at its specific URL currently.
        });
        return false;
    }));
    elem.append(eLinks);
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
function addDlShareLinks(elem, coords, routeId)
{
    var eDownload = $('\
<div class="btn-group mt-2" role="group">\
  <a href="#" class="download btn" title="{0}"><i class="fas fa-download"></i></a>\
  <a href="#{2}" class="share btn" title="{1}"><i class="fas fa-share-alt"></i></a>\
</div>'.format(langDict.dlRouteTooltip, langDict.shareTooltip, routeId));
    eDownload.find('.download').click(() => dlRoute.download(coords, routeId) ?? false).initTooltip();
    eDownload.find('.share').click(e => {
        var routeId = $(e.currentTarget).attr('href');
        navigator.share({
            title: routeId.slice(1),
            url: location.href.split("#")[0] + routeId
        });
        return false;
    }).initTooltip();
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
    var eNav = $('\
<div class="btn-group mr-2 mt-2" role="group" title="{0}">\
  <a href="#" class="strt-vw btn"><i class="fas fa-street-view"></i></a>\
</div>'.format(langDict.streetViewTooltip));
    eNav.find('.strt-vw').click(() => streetViewAt(coord, coordNext));
    eNav.initTooltip();
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
            target = (getGoogleTranslateBase() || '') + target;     // Google Translate compatibility
        }
    }
    else if (target.hasOwnProperty('routeId'))
    {
        activateRoute(target)
        success = true
        routeId = target.routeId;
        target = (getGoogleTranslateBase() || '') + '#' + routeId;  // Google Translate compatibility
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
    addPoiLinks(body, data.title, data.geo);
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
        // NOTE: Using JQuery to get href, because this.href may return absolute URI
        ret.find('a[href^="#"]').click(function() { return !navigateTo($(this).attr('href')); });
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
    lang = $('html').attr('lang');
    if (!lang)
    {
        console.error('The language is not set in the html tag of index.html, which is required.');
        lang = 'hu';
    }
    lang = huroutes.lang[lang];
    if (!lang)
    {
        console.error('Could not load huroutes translations.');
        throw 'Language error';
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
        androidAppToast();
        androidAppUpdateToast();
    }, 5000);

    /** Shows a toast to Android users that don't use the app that it is available. */
    function androidAppToast()
    {
        if (localStorage.shownAndroidAd || !navigator.userAgent.includes('Android') ||
            navigator.userAgent.includes('huroutes'))
            return;

        var androidToast = $('#toast-android-app');
        androidToast.toast('show');
        // The toast is not shown again once closed.
        androidToast.on('hide.bs.toast', () => localStorage.shownAndroidAd = true);
        androidToast.find('a[href]').on('click', () => androidToast.toast('hide'));
    }

    /** Shows a toast for Android app users when an updated version is available. */
    function androidAppUpdateToast()
    {
        if (!navigator.userAgent.includes('huroutes'))
            return;

        const ghRelease = 'https://api.github.com/repos/Sp3EdeR/huroutes-android/releases/latest';
        $.getJSON(ghRelease, data => {
            try
            {
                const url = data.assets[0].browser_download_url;
                const ver = data.tag_name.slice(1);
                const appVer = navigator.userAgent.match(/\bhuroutes\/(\d+(?:\.\d+)*)\b/)[1];
                if (ver.localeCompare(appVer, undefined, { numeric: true, sensitivity: 'base' }) == 1)
                {
                    var androidToast = $('#toast-app-update');
                    androidToast.find('.download-app').attr('href', url);
                    androidToast.toast('show');
                }
            }
            catch
            {
                console.error('Invalid GitHub release JSON.');
            }
        });
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
function initSidebarEvents()
{
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

/**
 * Does the same as $.getJSON, but works around Google Translate relative URL issues.
 */
function getJSON(url, ...args)
{
    return $.getJSON(url, ...args).then((...args) => args, err => {
        msg = () => console.error('Failed loading {0}.'.format(url));
        gtBase = getGoogleTranslateBase();
        if (gtBase)
            return $.getJSON(gtBase + url, ...args).fail(msg);
        msg();
        return err;
    });
}

})();
