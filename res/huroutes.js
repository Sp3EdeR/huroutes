const huroutes = {
    'opt': {
        'route': {
            'colors': [ '#744', '#944', '#a5423f', '#b04039', '#bc3d34', '#c7392e', '#d23427', '#dd2e20', '#e92618', '#f4190e', '#f00' ],
            'focusColor': '#00f'
        },
        'map': {
            'bounds': [[48.509, 15.659], [45.742, 23.193]],
            'tiles': {
                'Térkép': L.tileLayer.provider('OpenStreetMap'),
                'Domborzat': L.tileLayer.provider('OpenTopoMap'),
                'Műhold': L.tileLayer.provider('Esri.WorldImagery')
            }
        },
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
        'streetView': 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={0},{1}&heading={2}'
    },
    'lang': {
        'default': 'hu-HU',
        'hu-HU': {
            'navigation': '<span class="nav-opt">Navigáció <sup class="fas fa-cog"></sup></span> <span class="nav-start">az elejére</span> vagy <span class="nav-end">a végére</span>.',
            'openStreetView': 'Street view megnyitása.',
            'routeLength': 'Hossza: {0}km.'
        }
    }
};

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

(function() {

var langDict = selectLanguage();
var markdown = new showdown.Converter();
var map;
var nextDropId = 0;

$(document).ready(function() {
    map = L.map('map', { zoomControl: false }).fitBounds(huroutes.opt.map.bounds);
    const tiles = huroutes.opt.map.tiles;
    (tiles[$.cookie('huroutes-mapstyle')] || tiles[Object.keys(tiles)[0]]).addTo(map);
    L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.layers(tiles, null, { position: 'bottomleft' }).addTo(map);

    map.on('baselayerchange', (layer) => {
        $.cookie('huroutes-mapstyle', layer.name, { expires: 1825 });
    });
    map.createPane('bkgRoutes');
    map.getPane('bkgRoutes').style.zIndex = 450;

    $.getJSON('data.json', initializeContent)
        .fail(function () {
            console.error('Failed loading the route database.');
        });

    $('#options-dialog').on('hidden.bs.modal', updateOptions);
    initNavSelector();
});

function initializeContent(data)
{
    if (!Array.isArray(data) || !data.length)
    {
        console.error('The map data is empty.');
        return;
    }
    addDataGroup($('#menubox'), null, data);
}

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

function createMenuItem(elem, data)
{
    var dropId = 'menu' + nextDropId++;
    elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl));
    if (data.md || data.kml || data.pnt)
        console.error('Menu {0} contains route data that it should not.'.format(data.ttl));
    return dropId;
}

function createMenuRouteItem(elem, data)
{
    elem.addClass('menuitem');
    var dropId = 'menu' + nextDropId++;
    elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl).click(function() {
        activateRoute($(this).parents('li').first().attr('data-routeid'));
    }));
    var elemDiv = $('<div class="menu list-unstyled collapse panel"/>').prop('id', dropId);
    createInfoPanel(elemDiv, data);
    elem.append(elemDiv);
    var routeId = addRoute(data);
    elem.attr('data-routeid', routeId);
}

function createInfoPanel(elem, data)
{
    if (!data.rat && !data.bkg)
        console.warn('No rating given for ' + data.ttl);
    if (data.rat || data.upd)
    {
        var elemHeader = $('<p class="route-header"/>');
        if (data.upd)
        {
            elemHeader.append($('<span class="update-date"><i class="far fa-clock"></i> {0}</span>'.format(data.upd)));
        }
        if (data.rat)
        {
            var rating = normRating(data.rat);
            var starsInner = $('<span class="stars-inner" style="width:{0};" />'.format(rating * 10 + '%'));
            for (var i = 0; i < 5; ++i)
                starsInner.append($('<i class="fas fa-star"></i>'));
            var starsOutter = $('<span class="stars-outer" />');
            for (var i = 0; i < 5; ++i)
                starsOutter.append($('<i class="far fa-star"></i>'));
            starsOutter.append(starsInner);
            elemHeader.append(starsOutter);
        }
        elem.append(elemHeader);
    }
    if (data.md)
    {
        var descCont = $('<div class="route-desc"/>');
        const addMarkdown = text => {
            descCont.append($(markdown.makeHtml(text)));
            descCont.find('a[href^="#"]').click(function() {
                var routeId = this.href.split('#')[1];
                return !activateRoute(routeId);
            });
        }
        if (data.md.substr(-3) === '.md')
            $.ajax(data.md)
                .then(addMarkdown, function () {
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

function addRoute(data)
{
    const colors = huroutes.opt.route.colors;

    var routeId = data.kml.match(/data\/([\w-]+).kml/)[1];
    var rating = normRating(data.rat);
    var pathWeight = 3 + (!data.bkg && rating / 2);
    var layer = L.geoJson(null, {
        filter: feature => feature.geometry.type == "LineString",
        pane: data.bkg ? 'bkgRoutes' : 'shadowPane',
        style: {
            color: data.bkg ? colors[0] : colors[rating],
            weight: pathWeight
        },
        focusedStyle: {
            color: huroutes.opt.route.focusColor,
            weight: pathWeight + 2
        }
    });
    layer.on('click', event => !activateRoute(event.target));
    layer.on('mouseover', event => event.target.focused || event.target.setStyle(event.target.options.focusedStyle));
    layer.on('mouseout', event => event.target.focused || event.target.setStyle(event.target.options.style));
    layer.on('layeradd', event => {
        var elem = $('li[data-routeid={0}] .route-links'.format(routeId));

        var coords = event.layer.getLatLngs();
        if (Array.isArray(coords) && 2 <= coords.length)
        {
            var length = 0.0;
            for (var i = 1; i < coords.length; ++i)
                length += coords[i - 1].distanceTo(coords[i]);
            elem.append($(('<p>' + langDict.routeLength + '</p>').format((length / 1000).toFixed(1))));
            addNavigationLinks(elem, coords[0], coords[coords.length - 1]);
            var mididx = Math.floor(coords.length / 2);
            addStreetViewLink(elem, coords[mididx], coords[mididx + 1]);
        }

        if (window.location.hash == '#' + routeId)
            activateRoute(layer); // event.layer is a different instance; must use layer from closure
    });
    layer.routeId = routeId;
    omnivore.kml(data.kml, null, layer).addTo(map);
    return routeId;
}

const navProviders = huroutes.opt.navLinkProviders;
var navigationProviderId = function() {
    var savedProviderId = $.cookie('huroutes-navprovider');
    return navProviders[savedProviderId] !== undefined ? savedProviderId : Object.keys(navProviders)[0];
}();

function initNavSelector()
{
    var elem = $('#nav-options');
    $.each(navProviders, (key, value) => {
        const id = key.toLowerCase().replace(/ /g, '');
        elem.append(
            $('<div><input type="radio" name="navProv" id="{0}" value="{1}" {2}> <label for="{0}">{1}</label></div>'
                .format(id, key, key == navigationProviderId ? 'checked' : '')));
    });
}

function addNavigationLinks(elem, start, end)
{
    const planTo = coord => {
        window.open(navProviders[navigationProviderId](coord), '_blank');
        return false;
    };

    var eNav = $('<p />').append($(langDict.navigation));
    var eOpt = eNav.find('span.nav-opt');
    eOpt.replaceWith($('<a href="#" data-toggle="modal" data-target="#options-dialog" />').append(eOpt.html()));
    var eStart = eNav.find('span.nav-start');
    eStart.replaceWith($('<a href="#" />').append(eStart.html()).click(() => planTo(start)));
    var eEnd = eNav.find('span.nav-end');
    eEnd.replaceWith($('<a href="#" />').append(eEnd.html()).click(() => planTo(end)));
    elem.append(eNav);
}

function addStreetViewLink(elem, coord, coordNext)
{
    const streetViewAt = (coord, coordNext) => {
        var angle = [ coordNext.lat - coord.lat, coordNext.lng - coord.lng ];
        angle = 90 - Math.atan2(angle[0], angle[1]) * (180/Math.PI);
        if (angle < -180)
            angle += 360;
        window.open(huroutes.opt.streetView.format(coord.lat, coord.lng, angle), '_blank');
        return false;
    }
    elem.append($('<p />').append(
        $('<a href="#">{0}</a>'.format(langDict.openStreetView)).click(() => streetViewAt(coord, coordNext)),
    ));
}

function updateOptions()
{
    var selection = $('input[name=navProv]:checked').val();
    if (!selection)
        return;
    navigationProviderId = selection;
    $.cookie('huroutes-navprovider', selection, { expires: 1825 });
}

function activateRoute(layerOrRouteId)
{
    var layer = null
    if (typeof layerOrRouteId === 'string' || layerOrRouteId instanceof String)
    {
        map.eachLayer(i => {
            if (i.routeId == layerOrRouteId)
                layer = i;
        })
        if (layer === null)
            return false;
    }
    else
        layer = layerOrRouteId;

    map.eachLayer(layer => {
        if (layer.focused)
        {
            layer.setStyle(layer.options.style);
            layer.focused = false;
        }
    });
    layer.setStyle(layer.options.focusedStyle);
    layer.focused = true;

    var bounds = layer.getBounds();
    map.flyToBounds(bounds);

    var menuItem = $('li[data-routeid=' + layer.routeId + ']');
    var related = menuItem.parents('.collapse').add(menuItem.children('.collapse'));
    var unrelated = $('.collapse').not(related);
    unrelated.collapse('hide');
    related.collapse('show');
    var scrollWait = setInterval(function() {
        var sidebar = $('#sidebar');
        if (0 < sidebar.find('.collapsing').length)
            return;
        var ctrl = $([sidebar[0], $('body')[0], $('html')[0]]).filter((i, e) => e.clientHeight < e.scrollHeight).first();
        ctrl.animate({ scrollTop: menuItem.offset().top + sidebar.scrollTop() });
        clearInterval(scrollWait);
    }, 100);

    var routeFragment = '#' + layer.routeId;
    if (window.location.hash != routeFragment)
        window.history.pushState(layer.routeId, '', routeFragment);

    return true;
}

window.addEventListener('popstate', event => {
    if (event.state)
        activateRoute(event.state)
    else
        map.flyToBounds(huroutes.opt.map.bounds);
});

function normRating(rat)
{
    var i = rat ? Math.round(rat) : 5;
    if (i < 1)
        i = 1;
    else if (10 < i)
        i = 10;
    return i;
}

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

})();
