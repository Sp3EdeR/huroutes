import argparse
import colorsys
import io
import json
import kml2geojson.main as k2g
import os
import urllib.request as req
import zipfile
from typing import BinaryIO, cast

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('kmz_url', help='The URL of the KML file that is to be downloaded.')
    parser.add_argument('geojson_path', help='The path of the created geojson file.')
    parser.add_argument('style_path', help='The path of the created leaflet leafletStyles json.')
    args = parser.parse_args()

    print("Downloading %s file..." % args.kmz_url)
    request = req.Request(
        args.kmz_url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        },
    )
    kmzData = req.urlopen(request, timeout=30).read()

    print("Opening the KMZ file...")
    kmzFile = io.BytesIO(kmzData)
    z = zipfile.ZipFile(kmzFile)
    [kmlPath] = [s for s in z.namelist() if s.endswith('.kml')]

    print("Converting the KMZ to GeoJSON...")
    with z.open(kmlPath) as kmlFile:
        geodata = k2g.convert(cast(BinaryIO, kmlFile), 'curves', 'leaflet')
    geofeats = [feat for coll in geodata['feature_collections'] for feat in coll['features']]
    leafletStyles = geodata['style']

    print("Removing GeoJSON feature descriptions...")
    for props in (f['properties'] for f in geofeats):
        del props['description']

    print("Filtering unused styles...")
    usedStyles = set(f['properties']['styleUrl'] for f in geofeats)
    leafletStyles = dict(filter(lambda pair: pair[0] in usedStyles, leafletStyles.items()))

    print("Tweaking the styles...")
    for style in leafletStyles.values():
        # Recolour the styles to a magenta theme with brightness
        hex = style['color'].lstrip('#')
        rgb = tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))
        hls = colorsys.rgb_to_hls(*(c / 255 for c in rgb))
        # Road quality is hue-coded by the "[0.16666..., -0.5] mod 1" range.
        # This is transformed into a value-coded "[0.25, 0.75]" range.
        # Transform start to 0; scale to [0, 0.5]; transform to [0.25, 0.75].
        lightness = ((hls[0] - 0.16666666666666667) * -0.75 + 0.25)
        # Ensure that value is within the valid range even for unexpected colours.
        lightness = max(0.25, min(lightness, 0.75))
        rgb = tuple(int(i * 255) for i in colorsys.hls_to_rgb(0.83, lightness, 1.0))
        style['color'] = '#%02X%02X%02X' % rgb

        # Make roads thinner by 0.5 pixel ([2, 3] -> [1, 2])
        style['weight'] -= 0.5

        # Reduce opacity range ([0.5, 1] -> [0.75 -> 1])
        style['opacity'] = style['opacity'] / 2 + 0.5

    print("Ensuring that the output directory exists...")
    for outDir in [os.path.dirname(s) for s in [args.geojson_path, args.style_path]]:
        if outDir:
            os.makedirs(outDir, exist_ok=True)

    print("Writing GeoJSON data to %s..." % args.geojson_path)
    with open(args.geojson_path, 'w') as f:
        json.dump({
            'type': 'FeatureCollection',
            'features': list(geofeats)
        }, f, separators=(',', ':'))

    print("Writing Leaflet style data to %s..." % args.style_path)
    with open(args.style_path, 'w') as f:
        json.dump(leafletStyles, f, separators=(',', ':'))

if __name__ == "__main__":
    main()
