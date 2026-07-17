import os
from minify_html import minify as htmlmin
from rcssmin import cssmin
from rjsmin import jsmin


def minify(filePath):
    with open(filePath, 'r+') as f:
        ext = os.path.splitext(filePath)[1].lstrip('.')
        text = f.read()
        if (ext == 'htm' or ext == 'html'):
            minified = htmlmin(text, minify_js=True, minify_css=True)
        elif (ext == 'js'):
            minified = jsmin(text)
        elif (ext == 'css'):
            minified = cssmin(text)
        f.seek(0)
        f.write(minified)
        f.truncate()

def processDir(dir):
    for root, subdirs, files in os.walk(dir):
        for fileName in files:
            ext = os.path.splitext(fileName)[1].lstrip('.')
            if ext in ['htm', 'html', 'css', 'js']:
                minify(os.path.join(root, fileName))
