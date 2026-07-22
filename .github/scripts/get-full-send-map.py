import argparse
import json
import os
import re
import urllib.request as req


MAP_ID = 1381865
UMAP_METADATA_URL = "https://umap.openstreetmap.fr/en/map/%s/geojson/" % MAP_ID
UMAP_DATALAYER_URL_TEMPLATE = "https://umap.openstreetmap.fr/en/datalayer/%s/%s/" % (MAP_ID, '%s')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('datalayer_filter', help='A regex filter of the name of the datalayer.')
    parser.add_argument('geojson_path', help='The path of the created geojson file.')
    args = parser.parse_args()

    url = UMAP_METADATA_URL
    print("Downloading %s file..." % url)
    mapData = req.urlopen(req.Request(url), timeout=30).read()

    print("Parsing the map metadata...")
    mapData = json.loads(mapData)
    layer_ids = [
        layer['id'] for layer in mapData['properties']['datalayers']
        if re.match(args.datalayer_filter, layer['properties']['name'])
    ]
    if not layer_ids or len(layer_ids) > 1:
        raise ValueError("Expected exactly one datalayer to match the filter, but found %d." % len(layer_ids))

    url = UMAP_DATALAYER_URL_TEMPLATE % layer_ids[0]
    print("Downloading the datalayer from %s..." % url)
    datalayerData = req.urlopen(req.Request(url), timeout=30).read()
    geofeats = json.loads(datalayerData)['features']

    print("Removing GeoJSON feature descriptions...")
    for props in (f['properties'] for f in geofeats):
        if 'description' in props:
            del props['description']

    print("Ensuring that the output directory exists...")
    outDir = os.path.dirname(args.geojson_path)
    if outDir:
        os.makedirs(outDir, exist_ok=True)

    print("Writing GeoJSON data to %s..." % args.geojson_path)
    with open(args.geojson_path, 'w') as f:
        json.dump({
            'type': 'FeatureCollection',
            'features': list(geofeats)
        }, f, separators=(',', ':'))

if __name__ == "__main__":
    main()
