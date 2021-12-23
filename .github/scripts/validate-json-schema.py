#!/usr/bin/python

import argparse
from json import load
from jsonschema import validate

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("file", help="The JSON file to validate")
    parser.add_argument("schema", help="The JSON schema to use for validation")
    args = parser.parse_args()

    with open(args.schema) as s:
        schema = load(s)
        with open(args.file) as f:
            data = load(f)
            validate(instance=data, schema=schema)

    print("Finished successfully.")

if __name__ == "__main__":
    main()