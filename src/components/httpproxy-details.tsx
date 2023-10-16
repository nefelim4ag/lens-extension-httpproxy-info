import { Renderer } from "@k8slens/extensions";
import React from "react";
import { HTTPProxy } from "../httpproxy";

const {
  Component: {
    Badge,
    DrawerItem
  },
} = Renderer;
export interface HTTPProxyDetailsProps extends Renderer.Component.KubeObjectDetailsProps<HTTPProxy> {
}

export class HTTPProxyDetails extends React.Component<HTTPProxyDetailsProps> {

  render() {
    const { object: httpproxy } = this.props;
    const includes = this.props.object.spec.includes;
    const routes = this.props.object.spec.routes;
    const tcpproxy = this.props.object.spec.tcpproxy;
    const statusConditions = this.props.object.status.conditions;
    const extraData: any[] = [];
    if (!httpproxy) return null;

    // console.error(includes);

    if (includes) {
      for (const key of includes) {
        try {
            extraData.push(
              <div>
                <Renderer.Component.DrawerTitle>Includes: {key.namespace}/{key.name}</Renderer.Component.DrawerTitle>
                <Renderer.Component.DrawerItem name="Name">
                  {key.name}
                </Renderer.Component.DrawerItem>
                <Renderer.Component.DrawerItem name="Namespace">
                  {key.namespace}
                </Renderer.Component.DrawerItem>
                {key.conditions && key.conditions.length > 0 && (
                  <Renderer.Component.DrawerItem name="Conditions">
                    prefix: {key.conditions[0].prefix}
                  </Renderer.Component.DrawerItem>
                )}
              </div>
            );
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (routes) {
      for (const key of routes) {
        if (key.conditions && key.conditions.length > 0) {
          var condition = key.conditions[0]
          var service = key.services[0]
          var pathRewrite = key.pathRewritePolicy
          try {
              if (condition.prefix) {
                extraData.push(
                  <div>
                    <Renderer.Component.DrawerTitle>Route prefix: {key.conditions[0].prefix}</Renderer.Component.DrawerTitle>
                    <Renderer.Component.DrawerItem name="Service">
                      {service.name}:{service.port}
                    </Renderer.Component.DrawerItem>
                    {pathRewrite && (
                    <Renderer.Component.DrawerItem name="PathRewrite">
                      {pathRewrite.replacePrefix[0].prefix && (
                        pathRewrite.replacePrefix[0].prefix
                      )} -{'>'} {pathRewrite.replacePrefix[0].replacement}
                    </Renderer.Component.DrawerItem>
                    )}
                  </div>
                );
              }
          } catch (e) {
            console.error(e);
          }
        } else {
          var service = key.services[0]
          var pathRewrite = key.pathRewritePolicy
          try {
            extraData.push(
              <div>
                <Renderer.Component.DrawerTitle>Route prefix: /</Renderer.Component.DrawerTitle>
                <Renderer.Component.DrawerItem name="Service">
                  {service.name}:{service.port}
                </Renderer.Component.DrawerItem>
                {pathRewrite && (
                <Renderer.Component.DrawerItem name="PathRewrite">
                  {pathRewrite.replacePrefix[0].prefix && (
                    pathRewrite.replacePrefix[0].prefix
                  )} -{'>'} {pathRewrite.replacePrefix[0].replacement}
                </Renderer.Component.DrawerItem>
                )}
              </div>
            );
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    if (tcpproxy) {
      if (tcpproxy.services) {
        for (const svc of tcpproxy.services) {
          try {
            extraData.push(
              <div>
                <Renderer.Component.DrawerTitle>Service {svc.name}:{svc.port}</Renderer.Component.DrawerTitle>
              </div>
            );
          } catch (e) {
            console.error(e);
          }
        }
      }
      if (tcpproxy.includes) {
        for (const incl of tcpproxy.includes) {
          try {
              extraData.push(
                <div>
                  <Renderer.Component.DrawerTitle>Includes: {incl.namespace}/{incl.name}</Renderer.Component.DrawerTitle>
                  <Renderer.Component.DrawerItem name="Name">
                    {incl.name}
                  </Renderer.Component.DrawerItem>
                  <Renderer.Component.DrawerItem name="Namespace">
                    {incl.namespace}
                  </Renderer.Component.DrawerItem>
                </div>
              );
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    if (statusConditions && statusConditions[0].warnings) {
      var warnings = statusConditions[0].warnings
      for (const item of warnings) {
        try {
          if (condition.prefix) {
                extraData.push(
                  <div>
                    <Renderer.Component.DrawerTitle>Warning: {item.type}</Renderer.Component.DrawerTitle>
                    <Renderer.Component.DrawerItem name="Message">
                      {item.message}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Reason">
                      {item.reason}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Status">
                      {item.status}
                    </Renderer.Component.DrawerItem>
                  </div>
                );
              }
          } catch (e) {
            console.error(e);
          }
      }
    }

    if (statusConditions && statusConditions[0].errors) {
      var errors = statusConditions[0].errors
      for (const item of errors) {
        try {
          if (condition.prefix) {
                extraData.push(
                  <div>
                    <Renderer.Component.DrawerTitle>Error: {item.type}</Renderer.Component.DrawerTitle>
                    <Renderer.Component.DrawerItem name="Message">
                      {item.message}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Reason">
                      {item.reason}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Status">
                      {item.status}
                    </Renderer.Component.DrawerItem>
                  </div>
                );
              }
          } catch (e) {
            console.error(e);
          }
      }
    }

    // console.error(extraData)
    return <div>{extraData}</div>;

    return (
      <div className="Includes">
        <Renderer.Component.DrawerTitle>Includes</Renderer.Component.DrawerTitle>
        <DrawerItem name="Created">
          {httpproxy.getAge(true, false)} ago ({httpproxy.metadata.creationTimestamp})
        </DrawerItem>
        <DrawerItem name="DNS Names LOL!">
          {httpproxy.spec.virtualhost.fqdn}
        </DrawerItem>
        <DrawerItem name="Secret">
          {httpproxy.spec.virtualhost.tls.secretName}
        </DrawerItem>
        <DrawerItem name="Status" className="status" labelsOnly>
          {httpproxy.status.conditions.map((condition, index) => {
            const { type, reason, message, status } = condition;
            const kind = type || reason;
            if (!kind) return null;
            return (
              <Badge
                key={kind + index} label={kind}
                className={"success " + kind.toLowerCase()}
                tooltip={message}
              />
            );
          })}
        </DrawerItem>
      </div>
    )
  }
}