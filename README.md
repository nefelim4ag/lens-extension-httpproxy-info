[![CI](https://github.com/nefelim4ag/lens-extension-httpproxy-info/actions/workflows/ci.yml/badge.svg)](https://github.com/nefelim4ag/lens-extension-httpproxy-info/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/dm/lens-httpproxy-info?logo=npm)](https://www.npmjs.com/package/lens-httpproxy-info)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/nefelim4ag/lens-httpproxy-info?logo=github)](https://www.npmjs.com/package/lens-httpproxy-info)
[![GitHub license](https://img.shields.io/github/license/nefelim4ag/lens-extension-httpproxy-info)](https://github.com/nefelim4ag/lens-extension-httpproxy-info/blob/main/LICENSE.txt)

# lens-extension-httpproxy-info

See additional data from HTTPProxy inside info.

![HTTPProxy details in detailed overview](docs/extended_info.png)

## Installation

### Direct link to Lens

[lens://app/extensions/install/lens-httpproxy-info](lens://app/extensions/install/lens-httpproxy-info)

### Manual installation

Menu > Extensions and search for `lens-httpproxy-info`.

### Alternatives downloads

#### Github
https://github.com/nefelim4ag/lens-extension-httpproxy-info/releases/latest/download/lens-httpproxy-info.tgz

#### Manual
```sh
mkdir -p ~/.k8slens/extensions
git clone https://github.com/nefelim4ag/lens-extension-httpproxy-info.git
ln -s $(pwd)/lens-extension-httpproxy-info ~/.k8slens/extensions/lens-httpproxy-info
# Build
cd $(pwd)/lens-extension-httpproxy-info
npm install
npm run build
```
