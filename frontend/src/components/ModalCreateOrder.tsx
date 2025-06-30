import { createOrder } from "@/services/createOrder"
import { InitialValuesOrder, OrderTypes } from "@/types/orderTypes"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material"
import { useState } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  update: () => void
}

const ModalCreateOrder = ({open , onClose, update} : ModalProps) => {
  const [orderValue, setOrderValue] = useState<OrderTypes>(InitialValuesOrder)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOrderValue((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  
  const handleClose = () => {
    setOrderValue(InitialValuesOrder)
    onClose()
  }

  const handleSubmitOrder = async () => {
    const response = await createOrder(orderValue)
    if (response) {
      handleClose()
      update()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Order</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={7}>
            <TextField  
              fullWidth
              value={orderValue.orderName}
              name="orderName"
              onChange={handleChange}
              label="Identification"
              margin="normal"
              variant="filled"
            />
          </Grid>
          <Grid size={5}>
            <TextField
              name="status"
              label="Order Status"
              fullWidth
              disabled
              value={orderValue.state}
              margin="normal"
              variant="filled"
              />
            </Grid>
          </Grid>
        </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmitOrder}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}
export default ModalCreateOrder
