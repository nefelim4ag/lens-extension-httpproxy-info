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
          try {
              if (condition.prefix) {
                extraData.push(
                  <div>
                    <Renderer.Component.DrawerTitle>Route prefix: {key.conditions[0].prefix}</Renderer.Component.DrawerTitle>
                    <Renderer.Component.DrawerItem name="Service">
                      {service.name}:{service.port}
                    </Renderer.Component.DrawerItem>
                  </div>
                );
              }
          } catch (e) {
            console.error(e);
          }
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
