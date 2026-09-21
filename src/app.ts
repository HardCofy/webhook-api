import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import endpointRoutes from './routes/endpoint.routes';
import webhookRoutes from './routes/webhook.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (_req, res) => {

    res.json({

        status: "ok",

        service: "webhook-reliability-api"

    });

});

app.use('/api', endpointRoutes);
app.use('/api/webhooks', webhookRoutes);

export default app;