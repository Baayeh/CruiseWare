import { Router } from 'express';
import receiver from './receiverController';
import auth from '../Authentication/authController';


const router: Router = Router();

router.get('/', auth.auth, receiver.getAllReceivers);

router.get('/:receiverID', auth.auth, receiver.getReceiver);

router.post('/', auth.auth, receiver.createReceiver);

router.put('/:receiverID', auth.auth, receiver.updateReceiver);

router.delete('/:receiverID', auth.auth, receiver.deleteReceiver);

export const ReceiverRouter: Router = router;