import argparse
import os
from minify_html import minify as htmlmin
from rcssmin import cssmin
from rjsmin import jsmin


def minify(filePath):
    with open(filePath, 'r+') as f:
        ext = os.path.splitext(filePath)[1].lstrip('.')
        text = f.read()
        if (ext == 'htm' or ext == 'html'):
            minified = htmlmin(
                text,
                minify_js=True, remove_processing_instructions=False,
                do_not_minify_doctype=True, ensure_spec_compliant_unquoted_attribute_values=True,
                keep_spaces_between_attributes=True)
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

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('directory', help='The directory where the files are to be minified')
    args = parser.parse_args()
    processDir(args.directory)

if __name__ == "__main__":
    main()
