import { Renderer } from "@k8slens/extensions";

export class ServiceDef {
  name: string;
  port: number;
  protocol?: string;
  weight?: number;
  validation?: {};
  mirror?: boolean;
  requestHeadersPolicy?: {};
  responseHeadersPolicy?: {};
  cookieRewritePolicies?: {};
}

export class ConditionsDef {
  prefix?: string;
  regex?: string;
  exact?: string;
  header?: {
    name: string;
    present?: boolean;
    notpresent?: boolean;
    contains?: string;
    notcontains?: string;
    exact?: string;
    notexact?: string;
  };
  queryParameter?: {
    name: string;
    exact?: string;
    prefix?: string;
    suffix?: string;
    regex?: string;
    contains?: string;
    present?: boolean;
    ignoreCase?: boolean;
  };
}

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
        namespace?: string;
        conditions?: [
          {
            prefix?: string;
          }
        ]
      }
    ];
    routes?: [
      {
        conditions?: ConditionsDef[];
        services?: ServiceDef[];
        enableWebsockets?: boolean;
        permitInsecure?: boolean;
        timeoutPolicy?: {};
        retryPolicy?: {};
        healthCheckPolicy?: {};
        loadBalancerPolicy?: {
          strategy?: string;
          RequestHashPolicies?: [];
        };
        pathRewritePolicy?: {
          replacePrefix: [
            {
              prefix?: string;
              replacement: string;
            }
          ]
        };
        requestHeadersPolicy?: {};
        responseHeadersPolicy?: {};
        cookieRewritePolicies?: [];
        rateLimitPolicy?: {};
        internalRedirectPolicy: {
          maxInternalRedirects?: number;
          redirectResponseCodes?: [];
          allowCrossSchemeRedirect?: string;
          denyRepeatedRouteRedirect?: boolean;
        };
      }
    ]
    tcpproxy?: {
      healthCheckPolicy?: {};
      include?: [
        {
          name: string;
          namespace?: string;
        }
      ];
      loadBalancerPolicy?: {};
      services?: [
        {
          name: string;
          port: number;
          weight?: number;
          mirror?: boolean;
          protocol?: string;
        }
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
    conditions: [{
      lastTransitionTime: string;
      message: string;
      reason: string;
      status: string;
      type?: string;
      errors?: [
        {
          message: string;
          reason: string;
          status: boolean;
          type: string;
        }
      ];
      warnings?: [
        {
          message: string;
          reason: string;
          status: boolean;
          type: string;
        }
      ];
    }];
    currentStatus: string;
    description: string;
    loadBalancer: {
      ingress: [
        {
          hostname?: string;
          ip?: string;
          ports?: [
            {
              error?: string;
              port: number;
              protocol: string;
            }
          ];
        }
      ];
    };
  }
}
