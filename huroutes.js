$(document).ready(function() {
    // Header content adjustment
    $('#title .credits.left').first().html('Készítette a HU csapat. Ha segítenél a lap szerkesztésében, <a href="https://github.com/Sp3EdeR/huroutes" target="_blank">itt</a> tudod megtenni.')

    // TOC
    $('<div id="toc"><h1>Tartalomjegyzék</h1><ul id="tocList"></ul><hr/></div>').insertAfter('div#title')
    
    var ulStack = [ $(tocList) ];
    $(':header').each(function(index)
    {
        if (index <= 1) return

        var id = 'toc' + index
        var level = parseInt(this.nodeName.substring(1), 10);

        $(this).before('<a name="' + id + '"></a>');

        if (ulStack.length < level)
        {
            var ul = $("<ul></ul>")
            ulStack[ulStack.length - 1].append(ul)
            ulStack.push(ul)
        }
        else if (level < ulStack.length)
            while (ulStack.length != level)
                ulStack.pop()

        ulStack[ulStack.length - 1].append("<li><a href='#" + id + "'>" + $(this).text() + "</a></li>")
    });
});