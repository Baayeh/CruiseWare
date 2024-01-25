import { Router } from 'express';
import outbounds from './outboundsController';
import auth from '../Authentication/authController';

const router: Router = Router();


router.get('/', auth.auth, outbounds.getAllOutbounds);

router.get('/:outboundID', auth.auth, outbounds.getOutbound);

router.get('/order/', auth.auth, outbounds.getOutboundsByID);

router.post('/', auth.auth, outbounds.createOutbounds);

router.put('/:outboundID', auth.auth, outbounds.updateOutbound);

router.delete('/:outboundID', auth.auth, outbounds.deleteOutbound);

export const OutboundsRouter: Router = router;