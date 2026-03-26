import express from 'express';
import { auth } from '../../middlewares/auth';
import { AuthUser } from '../../../enums';
import { subscriptionGuard } from '../../middlewares/subscriptionGuard';
import { AppointmentController } from './appointment.controller';

const router = express.Router();

router.get('/', AppointmentController.getAllAppointment);

router.get('/patient/appointments',auth(AuthUser.PATIENT), AppointmentController.getPatientAppointmentById);
router.get('/patient/invoices',auth(AuthUser.PATIENT), AppointmentController.getPatientPaymentInfo);
router.get('/doctor/invoices',auth(AuthUser.DOCTOR), subscriptionGuard(), AppointmentController.getDoctorInvoices);
router.get('/doctor/patient-medical-history',auth(AuthUser.DOCTOR), subscriptionGuard(), AppointmentController.getDoctorPatientsHistory);

router.get('/doctor/appointments',auth(AuthUser.DOCTOR), subscriptionGuard(), AppointmentController.getDoctorAppointmentsById);
router.get('/admin/appointments',auth(AuthUser.ADMIN), AppointmentController.getAllAppointment);
router.get('/doctor/patients',auth(AuthUser.DOCTOR), subscriptionGuard(), AppointmentController.getDoctorPatients);
router.get('/doctor/appointments/:id',auth(AuthUser.DOCTOR), subscriptionGuard(), AppointmentController.getAppointmentsByDoctorId);


router.get('/patient-payment-info/:id',auth(AuthUser.PATIENT, AuthUser.DOCTOR), AppointmentController.getPaymentInfoViaAppintmentId);

router.post('/tracking', AppointmentController.getAppointmentByTrackingId);
router.post('/create', AppointmentController.createAppointment);
router.post('/create-un-authenticate', AppointmentController.createAppointmentByUnAuthenticateUser);

router.get('/:id', AppointmentController.getAppointment);

router.delete('/:id', AppointmentController.deleteAppointment);
router.delete('/cancel/:id', AppointmentController.cancelAppointment);
router.patch('/:id', auth(AuthUser.ADMIN, AuthUser.DOCTOR, AuthUser.PATIENT),AppointmentController.updateAppointment);
//doctor side
router.patch('/doctor/update-appointment',auth(AuthUser.DOCTOR), subscriptionGuard(), AppointmentController.updateAppointmentByDoctor);


export const AppointmentRouter = router;