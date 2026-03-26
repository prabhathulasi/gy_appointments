import express from 'express';
import { auth } from '../../middlewares/auth';
import { AuthUser } from '../../../enums';
import { subscriptionGuard } from '../../middlewares/subscriptionGuard';
import { doctorTimeSlotController } from './doctorTimeSlot.controller';

const router = express.Router();

router.get('/my-slot', auth(AuthUser.DOCTOR), subscriptionGuard(), doctorTimeSlotController.getMyTimeSlot);
router.get('/:id', auth(AuthUser.DOCTOR), subscriptionGuard(), doctorTimeSlotController.getTimeSlot);
router.get('/appointment-time/:id', doctorTimeSlotController.getAppointmentTimeOfEachDoctor);
router.post('/create', auth(AuthUser.DOCTOR), subscriptionGuard(), doctorTimeSlotController.createTimeSlot);
router.get('/', doctorTimeSlotController.getAllTimeSlot);
router.patch('/', auth(AuthUser.DOCTOR), subscriptionGuard(), doctorTimeSlotController.updateTimeSlot);
router.delete('/:id', auth(AuthUser.DOCTOR), subscriptionGuard(), doctorTimeSlotController.deleteTimeSlot);

export const DoctorTimeSlotRouter = router;