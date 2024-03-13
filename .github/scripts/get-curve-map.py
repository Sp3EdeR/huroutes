import argparse
import colorsys
import io
import json
import kml2geojson.main as k2g
import os
import ssl
import urllib.request as req
import zipfile

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('kmz_url', help='The URL of the KML file that is to be downloaded.')
    parser.add_argument('geojson_path', help='The path of the created geojson file.')
    parser.add_argument('style_path', help='The path of the created leaflet leafletStyles json.')
    args = parser.parse_args()

    print("Downloading %s file..." % args.kmz_url)
    sslCtx = ssl.create_default_context()
    sslCtx.check_hostname = False
    sslCtx.verify_mode = ssl.CERT_NONE
    kmzData = req.urlopen(args.kmz_url, context=sslCtx).read()
    print("Opening the KMZ file...")
    kmzFile = io.BytesIO(kmzData)
    z = zipfile.ZipFile(kmzFile)
    [kmlPath] = [s for s in z.namelist() if s.endswith('.kml')]
    kmlFile = z.open(kmlPath)
    print("Converting the KMZ to GeoJSON...")
    leafletStyles, geojson = k2g.convert(kmlFile, 'curves', 'leaflet')

    print("Removing GeoJSON feature descriptions...")
    for props in (f['properties'] for f in geojson['features']):
        del props['description']

    print("Filtering unused styles...")
    usedStyles = set(f['properties']['styleUrl'] for f in geojson['features'])
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
        outDir and os.makedirs(outDir, exist_ok=True)
    print("Writing GeoJSON data to %s..." % args.geojson_path)
    with open(args.geojson_path, 'w') as f:
        json.dump(geojson, f, separators=(',', ':'))
    print("Writing Leaflet style data to %s..." % args.style_path)
    with open(args.style_path, 'w') as f:
        json.dump(leafletStyles, f, separators=(',', ':'))

if __name__ == "__main__":
    main()
