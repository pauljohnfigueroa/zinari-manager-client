import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const DialogBox = ({ children, formLabel, formState, fullWidth, handleClose, requiredFields }) => {
  return (
    <Dialog fullWidth={fullWidth} open={formState} onClose={handleClose}>
      <DialogTitle>{formLabel}</DialogTitle>
      <DialogContent>
        <DialogContentText>{requiredFields}</DialogContentText>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default DialogBox