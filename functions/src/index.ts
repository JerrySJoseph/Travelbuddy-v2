
import * as admin from 'firebase-admin'
export * from './api/v1/auth/createnewuser'
export * from './api/v1/travel/createnewtravelplan'
export * from './api/v1/travel/acceptOrRejectTravelPlan'

admin.initializeApp()
