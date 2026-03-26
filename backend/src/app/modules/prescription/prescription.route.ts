import express from 'express';
import { auth } from '../../middlewares/auth';
import { AuthUser } from '../../../enums';
import { subscriptionGuard } from '../../middlewares/subscriptionGuard';
import { PrescriptionController } from './prescription.controller';

const router = express.Router();

router.get('/doctor/prescription', auth(AuthUser.DOCTOR), subscriptionGuard(), PrescriptionController.getDoctorPrescriptionById);
router.get('/patient/prescription', auth(AuthUser.PATIENT), PrescriptionController.getPatientPrescriptionById);

router.get('/:id', PrescriptionController.getPrescriptionById);
router.get('/', PrescriptionController.getAllPrescriptions);

router.post('/create', auth(AuthUser.DOCTOR, AuthUser.ADMIN), subscriptionGuard(), PrescriptionController.createPrescription);
router.delete('/:id', auth(AuthUser.DOCTOR), subscriptionGuard(), PrescriptionController.deletePrescription);
// router.delete('/:id', auth(AuthUser.DOCTOR,  AuthUser.ADMIN), PrescriptionController.deletePrescription);
router.patch('/', auth(AuthUser.DOCTOR, AuthUser.ADMIN), subscriptionGuard(), PrescriptionController.updatePrescription);
router.patch('/update-prescription-appointment', auth(AuthUser.DOCTOR, AuthUser.ADMIN), subscriptionGuard(), PrescriptionController.updatePrescriptionAndAppointment);

export const PrescriptionRouter = router;