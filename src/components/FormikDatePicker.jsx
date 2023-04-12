/* 

Original Solution Reference
https://reacthustle.com/blog/mui-react-datepicker-with-formik-typescript

A generic component used to make Mui Datepicker work with Formik
This is utilized in all forms.
*/
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useField, useFormikContext } from 'formik'

const FormikDatePicker = ({ name }) => {
  const [field] = useField(name)
  const { setFieldValue } = useFormikContext()

  return (
    <DatePicker
      disablePast
      value={field.value ?? null}
      onChange={val => setFieldValue(name, val)}
    />
  )
}
export default FormikDatePicker
