#!/usr/bin/env python3

import os
import sys
import json

def main():
    """
    Update manifest.json and zip the files for release
    """
    if len(sys.argv) != 2:
        print('Usage: release.py <version>', file=sys.stderr)
        exit(1)
    version = sys.argv[1]
    with open('./manifest.json', 'r+') as f:
        manifest = json.load(f)
        manifest['version'] = version
        f.seek(0)
        json.dump(manifest, f, indent=2)
        f.truncate()

    os.system(f'zip cses-filter-v{version}.zip -r icons/ src/ manifest.json')

if __name__ == '__main__':
    main()
