/* 
A generic component used to make Mui Chip work with Formik
This is utilized in all forms.
*/
import { Chip } from '@mui/material'
import { useField, useFormikContext } from 'formik'

const FormikChip = ({ name }) => {
  const [field] = useField(name)
  const { setFieldValue } = useFormikContext()

  return <Chip value={field.value ?? null} onChange={val => setFieldValue(name, val)} />
}
export default FormikChip
