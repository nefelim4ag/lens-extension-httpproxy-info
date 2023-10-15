import { Renderer } from "@k8slens/extensions";

export class HTTPProxy extends Renderer.K8sApi.KubeObject {
  static kind = "HTTPProxy"
  static namespaced = true
  static apiBase = "/apis/projectcontour.io/v1/httpproxies"

  kind: string
  apiVersion: string
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    uid: string;
    resourceVersion: string;
    creationTimestamp: string;
    labels: {
      [key: string]: string;
    };
    annotations: {
      [key: string]: string;
    };
  }
  spec: {
    ingressClassName: string;
    includes?: [
      {
        name: string;
        namespace: string;
        conditions?: [
          {
            prefix?: string;
          }
        ]
      }
    ];
    routes?: [
      {
        conditions?: [
          {
            prefix?: string;
            regex?: string;
            header?: string;
          }
        ];
        services?: [
          {
            name: string;
            port: number;
            protocol?: string;
            weight?: string;
            validation?: {};
            mirror?: boolean;
            requestHeadersPolicy?: {};
            responseHeadersPolicy?: {};
            cookieRewritePolicies?: {};
          }
        ];
        enableWebsockets?: boolean;
        permitInsecure?: boolean;
        timeoutPolicy?: {};
        retryPolicy?: {};
        healthCheckPolicy?: {};
        loadBalancerPolicy?: {};
        pathRewritePolicy?: {};
        requestHeadersPolicy?: {};
        responseHeadersPolicy?: {};
        cookieRewritePolicies?: [];
        rateLimitPolicy?: {};
      }
    ]
    tcpproxy?: {
      services?: [

      ];
    }
    virtualhost: {
      fqdn: string;
      ipAllowPolicy: [];
      tls: {
        secretName: string;
      }
    }
  }
  status: {
    conditions: {
      lastTransitionTime: string;
      message: string;
      reason: string;
      status: string;
      type?: string;
    }[];
    currentStatus: string;
    description: string;
    loadBalancer: {
      ingress: [];
    };
  }
}
