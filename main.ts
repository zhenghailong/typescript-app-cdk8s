import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { WebService } from './lib/web-service';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new WebService(this, 'typescript-app', { image: 'nginx', replicas: 1 });
    new WebService(this, 'ghost', { image: 'ghost', containerPort: 8081 });
  }
}

const app = new App();
new MyChart(app, 'typescript-app');
app.synth();
