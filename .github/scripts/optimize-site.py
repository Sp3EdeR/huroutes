import argparse
import os
import sys

def main():
    sys.path.insert(1, os.path.realpath(os.path.dirname(__file__)) + "/build-tools")

    parser = argparse.ArgumentParser()
    parser.add_argument('directory', help='The directory where the files are to be minified')
    args = parser.parse_args()

    # Compact the data storage files
    import compact_data
    compact_data.importData(os.path.join(args.directory, "data.json"))

    # Run site minification
    import minify_site
    minify_site.processDir(args.directory)

if __name__ == "__main__":
    main()
