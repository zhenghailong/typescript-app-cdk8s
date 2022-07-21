import { Names } from "cdk8s";
import { Construct } from "constructs";
import { IntOrString, KubeDeployment, KubeService } from "../imports/k8s";


export interface WebServiceProps {
    readonly image: string;
    readonly replicas?: number;
    readonly port?: number;
    readonly containerPort?: number;
}

export class WebService extends Construct {
    constructor(scope: Construct, id: string, props: WebServiceProps) {
        super(scope, id);

        const label = { app: Names.toDnsLabel(this) };
        const port = props.port || 80;
        const containerPort = props.containerPort || 8080;
        const replicas = props.replicas || 1;

        new KubeService(this, 'service', {
            spec: {
                type: 'LoadBalancer',
                ports: [ { port, targetPort: IntOrString.fromNumber(containerPort) } ],
                selector: label
            }
        });

        new KubeDeployment(this, 'deployment', {
            spec: {
              replicas,
              selector: {
                matchLabels: label
              },
              template: {
                metadata: { labels: label },
                spec: {
                  containers: [
                    {
                      name: 'app',
                      image: props.image,
                      ports: [ { containerPort } ]
                    }
                  ]
                }
              }
            }
        });
    }
}