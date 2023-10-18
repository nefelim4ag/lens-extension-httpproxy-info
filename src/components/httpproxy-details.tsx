import { Renderer } from "@k8slens/extensions";
import React from "react";
import { HTTPProxy, ServiceDef, ConditionsDef } from "../httpproxy";

const {
  Component: {
    Badge,
    DrawerItem,
    DrawerTitle
  },
} = Renderer;
export interface HTTPProxyDetailsProps extends Renderer.Component.KubeObjectDetailsProps<HTTPProxy> {
}

enum statusConditionsType {
  warn = "Warning",
  err = "Error"
}

export class HTTPProxyDetails extends React.Component<HTTPProxyDetailsProps> {

  statusCondition(msgType: statusConditionsType, type: string, message: string, reason: string, status: boolean) {
    return (
      <div>
        <DrawerTitle>{msgType}: {type}</DrawerTitle>
        <DrawerItem name="Message">{message}</DrawerItem>
        <DrawerItem name="Reason" >{reason}</DrawerItem>
        <DrawerItem name="Status" >{status}</DrawerItem>
      </div>
    )
  }

  renderServices(services: ServiceDef[]){
    if (services.length == 0) { return (<div></div>); }
    if (services.length == 1) {
      return (
        <DrawerItem name="Service">{services[0].name}:{services[0].port}</DrawerItem>
      )
    }
    return (
      <DrawerItem name="Services">
        {services.map((svc, index) => {
          return (
            <div>
              <DrawerTitle>{svc.name}:{svc.port}</DrawerTitle>
              {svc.protocol && (<DrawerItem name="Protocol">{svc.protocol}</DrawerItem>)}
              {svc.weight !== undefined && (<DrawerItem name="Weight">{svc.weight}</DrawerItem>)}
              {svc.mirror !== undefined && (<DrawerItem name="Mirror">{svc.mirror}</DrawerItem>)}
            </div>
          )
        })}
      </DrawerItem>
    )
  }

  renderCondHeaders(conditions: ConditionsDef[]){
    if (conditions.length == 0) {return (<div></div>)}
    return (
      <DrawerItem name="Conditions: Headers">
        {conditions.map((cond, index) => {
          let header = cond.header
          return (
            <div>
              <DrawerTitle>{header.name}</DrawerTitle>
              {header.present && (<DrawerItem name="Present">{header.present && "True" || "False"}</DrawerItem>)}
              {header.notpresent && (<DrawerItem name="NotPresent">{header.notpresent && "True" || "False"}</DrawerItem>)}
              {header.contains && (<DrawerItem name="Contains">{header.contains}</DrawerItem>)}
              {header.notcontains && (<DrawerItem name="NotContains">{header.notcontains}</DrawerItem>)}
              {header.exact && (<DrawerItem name="Exact">{header.exact}</DrawerItem>)}
              {header.notexact && (<DrawerItem name="NotExact">{header.notexact}</DrawerItem>)}
            </div>
          )
        })}
      </DrawerItem>
    )
  }

  render() {
    const { object: httpproxy } = this.props;
    const includes = this.props.object.spec.includes;
    const routes = this.props.object.spec.routes;
    const tcpproxy = this.props.object.spec.tcpproxy;
    const statusConditions = this.props.object.status.conditions;
    const extraData: any[] = [];
    if (!httpproxy) return null;

    if (statusConditions) {
      if (statusConditions[0].errors) {
        let errors = statusConditions[0].errors
        for (const cond of errors) {
          extraData.push(
            this.statusCondition(statusConditionsType.err, cond.type, cond.message, cond.reason, cond.status)
          );
        }
      }
      if (statusConditions[0].warnings) {
        let warnings = statusConditions[0].warnings
        for (const cond of warnings) {
          extraData.push(
            this.statusCondition(statusConditionsType.warn, cond.type, cond.message, cond.reason, cond.status)
          );
        }
      }
    }

    // console.error(includes);
    if (includes) {
      let shortIncludes = includes.map((incl, index) => {
        if (incl.namespace || incl.conditions) { return; }
        return <DrawerItem name="Name">{incl.name}</DrawerItem>
      })
      let namespacedIncludes = includes.map((incl, index) => {
        if (incl.conditions) { return; }
        if (incl.namespace) {
          return <DrawerItem name={incl.namespace}>{incl.name}</DrawerItem>
        }
      })

      if (shortIncludes) {
        extraData.push(
        <div>
          <DrawerTitle>Includes</DrawerTitle>
          {shortIncludes}
        </div>
        )
      }

      if (namespacedIncludes) {
        extraData.push(
        <div>
          <DrawerTitle>Includes namespaced</DrawerTitle>
          <DrawerItem name="Namespace">Name</DrawerItem>
          {namespacedIncludes}
        </div>
        )
      }

      for (const incl of includes) {
        if (incl.conditions) {
          var namespace = incl.namespace
          var prefix = incl.conditions?.[0].prefix
          extraData.push(
            <div>
              <DrawerTitle>Includes: {namespace}/{incl.name}</DrawerTitle>
              <DrawerItem name="Name">{incl.name}</DrawerItem>
              {namespace && (<DrawerItem name="Namespace">{namespace}</DrawerItem>)}
              {prefix && (<DrawerItem name="Conditions">prefix: {prefix}</DrawerItem>)}
            </div>
          );
        }
      }
    }

    if (routes) {
      for (const route of routes) {
        if (route.conditions && route.conditions.length > 0) {
          let condition = route.conditions.find((cond) => {return cond.prefix || cond.regex || cond.exact})
          let services = route.services
          let pathRewrite = route.pathRewritePolicy
          let prefix = route.pathRewritePolicy?.replacePrefix?.[0].prefix
          let replacement = route.pathRewritePolicy?.replacePrefix?.[0].replacement
          let condHeaders = route.conditions.filter((cond) => {return cond.header})
          if (condition) {
            let condType = condition.prefix && "prefix" || condition.regex && "regex" || condition.exact && "exact"
            let condVal = condType == "prefix" && condition.prefix || condType == "regex" && condition.regex || condType == "exact" && condition.exact
            extraData.push(
              <div>
                <DrawerTitle>Route {condType}: {condVal}</DrawerTitle>
                {this.renderServices(services)}
                {pathRewrite && (
                <DrawerItem name="PathRewrite">{prefix && (prefix)} -{'>'} {replacement}</DrawerItem>
                )}
                {this.renderCondHeaders(condHeaders)}
              </div>
            );
          } else if (condHeaders.length > 0) {
            extraData.push(
              <div>
                <DrawerTitle>Route header: {condHeaders[0].header.name}</DrawerTitle>
                {this.renderServices(services)}
                {pathRewrite && (
                <DrawerItem name="PathRewrite">{prefix && (prefix)} -{'>'} {replacement}</DrawerItem>
                )}
                {this.renderCondHeaders(condHeaders)}
              </div>
            );
          }
        } else {
          let services = route.services
          let pathRewrite = route.pathRewritePolicy
          let prefix = route.pathRewritePolicy?.replacePrefix?.[0].prefix
          let replacement = route.pathRewritePolicy?.replacePrefix?.[0].replacement
          extraData.push(
            <div>
              <DrawerTitle>Route prefix: /</DrawerTitle>
              {this.renderServices(services)}
              {pathRewrite && (
              <DrawerItem name="PathRewrite">{prefix && (prefix)} -{'>'} {replacement}</DrawerItem>
              )}
            </div>
          );
        }
      }
    }

    if (tcpproxy) {
      if (tcpproxy.services) {
        for (const svc of tcpproxy.services) {
          extraData.push(
            <div>
              <DrawerTitle>Service {svc.name}:{svc.port}</DrawerTitle>
              {svc.protocol && (<DrawerItem name="Protocol">{svc.protocol}</DrawerItem>)}
              {svc.weight !== undefined && (<DrawerItem name="Weight">{svc.weight}</DrawerItem>)}
              {svc.mirror !== undefined && (<DrawerItem name="Mirror">{svc.mirror}</DrawerItem>)}
            </div>
          );
        }
      }
      if (tcpproxy.include) {
        let shortIncludes = tcpproxy.include.map((incl, index) => {
          if (incl.namespace) { return; }
          return <DrawerItem name="Name">{incl.name}</DrawerItem>
        })
        let namespacedIncludes = tcpproxy.include.map((incl, index) => {
          if (incl.namespace) {
            return <DrawerItem name={incl.namespace}>{incl.name}</DrawerItem>
          }
        })

        if (shortIncludes) {
          extraData.push(
          <div>
            <DrawerTitle>Includes</DrawerTitle>
            {shortIncludes}
          </div>
          )
        }

        if (namespacedIncludes) {
          extraData.push(
          <div>
            <DrawerTitle>Includes namespaced</DrawerTitle>
            <DrawerItem name="Namespace">Name</DrawerItem>
            {namespacedIncludes}
          </div>
          )
        }
      }
    }

    // console.error(extraData)
    return <div>{extraData}</div>;
  }
}
