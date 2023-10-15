import { Renderer } from "@k8slens/extensions";
import React from "react";
import { HTTPProxyDetails, HTTPProxyDetailsProps } from "./src/components/httpproxy-details";
import { HTTPProxy } from "./src/httpproxy"

export function CertificateIcon(props: Renderer.Component.IconProps) {
  return <Renderer.Component.Icon {...props} material="security" tooltip="Certificates" />
}

export default class HTTPProxyInfoExtension extends Renderer.LensExtension {
  kubeObjectDetailItems = [
      {
      kind: HTTPProxy.kind,
      apiVersions: ["projectcontour.io/v1"],
      priority: 10,
      components: {
        Details: (props: HTTPProxyDetailsProps) => <HTTPProxyDetails {...props} />
      }
    }
  ];
}
