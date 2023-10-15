# Lens Custom Resource Page Extension

Simple Lens extension that shows custom page and details for Certificates CRD.

## Install

```sh
mkdir -p ~/.k8slens/extensions
git clone https://github.com/nefelim4ag/lens-extension-httpproxy-info.git
ln -s $(pwd)/lens-extension-httpproxy-info ~/.k8slens/extensions/lens-httpproxy-info
```

## Build

To build the extension you can use `make` or run the `npm` commands manually:

```sh
cd lens-extension-httpproxy-info
make build
```

OR

```sh
cd lens-extension-httpproxy-info
npm install
npm run build
```

If you want to watch for any source code changes and automatically rebuild the extension you can use:

```sh
cd lens-extension-httpproxy-info
npm run dev
```

## Test

Open Lens application and navigate to CRD -> HTTPProxy in a cluster. Pick any and you can see additional info.

## Uninstall

```sh
rm ~/.k8slens/extensions/lens-httpproxy-info
```

Restart Lens application.
