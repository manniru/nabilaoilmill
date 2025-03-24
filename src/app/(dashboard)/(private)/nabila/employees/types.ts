export interface Employee {
  id?: string
  nin: string
  name: string
  phone: string
  address: string
  dob: string
  lga: string
  state: string
  guarantor: string
  designation: string
  dofa: string // Date of First Appointment
  createdAt?: Date
  updatedAt?: Date
}
