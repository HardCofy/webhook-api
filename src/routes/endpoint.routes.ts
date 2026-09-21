import { Router } from 'express';

import {
    createEndpointController,
    getEndpointController,
    getEndpointsController,
    patchEndpointController,
    deleteEndpointController
} from '../controllers/endpoint.controller';

const router = Router();

router.post('/endpoints', createEndpointController);
router.get('/endpoints', getEndpointsController);
router.get('/endpoints/:id', getEndpointController);
router.patch('/endpoints/:id', patchEndpointController);
router.delete('/endpoints/:id', deleteEndpointController);
export default router;