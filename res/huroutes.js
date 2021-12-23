String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};

(function() {

var markdown = new showdown.Converter();
var map;
var nextDropId = 0;
var nextRouteId = 0;

$(document).ready(function() {
    // Init the map
    map = L.map('map').fitBounds([[48.509, 15.659], [45.742, 23.193]]);
    L.tileLayer.provider('OpenStreetMap').addTo(map);
    map.createPane('bkgRoutes');
    map.getPane('bkgRoutes').style.zIndex = 450;
    map.attributionControl.addAttribution('<a href="https://github.com/Sp3EdeR/huroutes">huroutes</a>')

    // Load and init the routes
    $.getJSON('data.json', initializeContent)
        .fail(function () {
            console.error('Failed loading the route database.');
        });
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
    elem.append($('<a href="#{0}" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"/>'.format(dropId)).html(data.ttl).click(onMenuClicked));
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
        var elemHeader = $('<div class="route-header"/>');
        if (data.upd)
        {
            elemHeader.append($('<p class="route-header-update"><i class="fa fa-clock-o"></i> {0}</p>'.format(data.upd)));
        }
        if (data.rat)
        {
            var rating = normRating(data.rat);
            elemHeader.append($('<div class="stars-outer"><div class="stars-inner" style="width:{0};"/></div>'.format(rating * 10 + '%')));
        }
        elem.append(elemHeader);
    }
    if (data.md)
    {
        var descCont = $('<div class="route-desc"/>');
        const addMarkdown = text => descCont.append($(markdown.makeHtml(text)));
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
    const colors = [ '#833', '#944', '#a5423f', '#b04039', '#bc3d34', '#c7392e', '#d23427', '#dd2e20', '#e92618', '#f4190e', '#f00' ];
    var routeId = 'route' + nextRouteId++;
    var rating = normRating(data.rat);
    var pathWeight = 3 + (!data.bkg && rating / 2);
    var layer = L.geoJson(null, {
        filter: function(feature) {
            if (feature.geometry.type == "LineString")
            {
                const makeLink = coord => {
                    const link = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination={0},{1}';
                    return link.format(coord[1], coord[0]);
                }
                var coords = feature.geometry.coordinates;
                var elem = $('li[data-routeid={0}] .route-links'.format(routeId));
                elem.append($('<p>Navigálás a <a href="{0}">kezdő</a> vagy <a href="{1}">vég</a> pontra.</p>'
                    .format(makeLink(coords[0]), makeLink(coords[coords.length - 1]))));
                return true;
            }
            return false;
        },
        pane: data.bkg ? 'bkgRoutes' : 'shadowPane',
        style: {
            color: data.bkg ? colors[0] : colors[rating],
            weight: pathWeight
        },
        focusedStyle: {
            color: '#00f',
            weight: pathWeight + 2
        }
    });
    layer.on('click', event => onRouteClicked(event.target));
    layer.on('mouseover', event => event.target.focused || event.target.setStyle(event.target.options.focusedStyle));
    layer.on('mouseout', event => event.target.focused || event.target.setStyle(event.target.options.style));
    layer.routeId = routeId;
    omnivore.kml(data.kml, null, layer).addTo(map);
    return routeId;
}

function onMenuClicked()
{
    var routeId = $(this).parents('li').first().attr('data-routeid');
    map.eachLayer(layer => {
        if (layer.routeId == routeId)
            onRouteClicked(layer);
    })
}

function onRouteClicked(layer)
{
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
}

function normRating(rat)
{
    var i = rat ? Math.round(rat) : 5;
    if (i < 1)
        i = 1;
    else if (10 < i)
        i = 10;
    return i;
}

})();
