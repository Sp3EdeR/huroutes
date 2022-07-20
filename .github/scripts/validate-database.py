#!/usr/bin/python

import argparse
from json import load
from jsonschema import validate
from os import path

def walkJson(data, proc):
    if isinstance(data, dict):
        for k, v in data.items():
            proc(k, v)
            walkJson(v, proc)
    elif isinstance(data, list):
        for item in data:
            walkJson(item, proc)

class Checker:
    def __init__(self, rootDir):
        self.rootDir = rootDir

    def __call__(self, key, value):
        if key == "kml":
            if not path.exists(path.join(self.rootDir, value)):
                raise ValueError(value + " does not exist.")
        if key == "md" and value.endswith(".md"):
            file = path.join(self.rootDir, value)
            if not path.exists(file) or path.getsize(file) <= 16:
                raise ValueError(value + " does not exist or is too small.")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("file", help="The JSON file to validate")
    parser.add_argument("schema", help="The JSON schema to use for validation")
    args = parser.parse_args()

    data = {}
    with open(args.schema) as s:
        schema = load(s)
        with open(args.file) as f:
            data = load(f)
            validate(instance=data, schema=schema)

    walkJson(data, Checker(path.dirname(args.file)))

    print("Finished successfully.")

if __name__ == "__main__":
    main()