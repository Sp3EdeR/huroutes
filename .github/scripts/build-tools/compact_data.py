import json
import os
import re
import sys

class DataProcessor:
    def __init__(self, data, dataDir):
        self.data = data
        self._dataDir = dataDir

    _routeKeys = [ 'md', 'kml' ]
    def _routes(self, data = None):
        if data is None:
            data = self.data

        if isinstance(data, list):
            for value in data:
                yield from self._routes(value)
        elif isinstance(data, dict):
            for key, value in data.items():
                if key in self._routeKeys:
                    yield data
                    break
                else:
                    yield from self._routes(value)

    def processData(self):
        for route in self._routes():
            self.importTrack(route)
            self.importMd(route)

    def importMd(self, route):
        if 'md' not in route or not route['md'].endswith('.md'):
            return
        try:
            mdPath = os.path.join(self._dataDir, route['md'])
            with open(mdPath, encoding='utf-8') as mdFile:
                route['md'] = mdFile.read()
            os.remove(mdPath)
        except:
            print('Failed to optimize ' + route['md'], file=sys.stderr)

    def importTrack(self, route):
        type = ""
        if 'kml' in route:
            type = 'kml'
        else:
            return
        if not route[type].endswith('.' + type):
            return
        try:
            if 'id' not in route:
                route['id'] = re.match('data\/([\w-]+).' + type, route[type])[1]
            trackPath = os.path.join(self._dataDir, route[type])
            with open(trackPath, encoding='utf-8') as trackFile:
                trackData = trackFile.read()
                if type == 'kml':
                    trackData = self.minifyKml(trackData)
                route[type] = trackData
            os.remove(trackPath)
        except:
            print('Failed to optimize ' + route[type], file=sys.stderr)

    _kml = {}
    def minifyKml(self, kmlText):
        if 'lxml' not in dir():
            from lxml import etree
            self._kml['xmlParser'] = etree.XMLParser(remove_blank_text=True, remove_comments=True)
            ns = {'ns': 'http://www.opengis.net/kml/2.2'}
            self._kml['coordsPath'] = etree.XPath('//ns:coordinates', namespaces=ns)
            self._kml['mrkPath'] = etree.XPath('//ns:Placemark[not(ns:LineString)]', namespaces=ns)
            self._kml['coordReplRe'] = re.compile('[\r\n\t ]{2,}')
        doc = etree.XML(bytes(kmlText, 'utf-8'), self._kml['xmlParser'])
        # KML can contain point-markers we don't use on the map.
        # JS already filters these, but we remove this needless data here.
        for markerNode in self._kml['mrkPath'](doc):
            markerNode.getparent().remove(markerNode)
        # LineString coordinates contain unneeded additional whitespaces.
        for coordTag in self._kml['coordsPath'](doc):
            coordTag.text = self._kml['coordReplRe'].sub(' ', coordTag.text)
        return etree.tostring(doc, encoding='unicode')

def importData(dataFile):
    proc = {}
    with open(dataFile, "r", encoding='utf-8') as jsonFile:
        proc = DataProcessor(json.load(jsonFile), os.path.dirname(dataFile))
    proc.processData()
    with open(dataFile, "w", encoding='utf-8') as jsonFile:
        json.dump(proc.data, jsonFile, separators=(',', ':'), ensure_ascii=False)
