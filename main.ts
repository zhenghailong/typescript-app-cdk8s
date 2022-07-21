import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

// import constrcts
import { KubeService, KubeDeployment, IntOrString } from './imports/k8s'

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // define resources here
    const label = { app: 'hello-k8s'};

    new KubeService(this, 'service', {
      spec: {
        type: "LoadBalancer",
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080)}],
        selector: label
      }
    });

    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-kubernetes',
                image: 'nginx',
                ports: [ { containerPort: 8080 } ]
              }
            ]
          }
        }
      }
    });
  }
}

const app = new App();
new MyChart(app, 'typescript-app');
app.synth();
