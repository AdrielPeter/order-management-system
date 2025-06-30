import { updateOrder } from "@/services/updateOrder";
import { OrderTypes } from "@/types/orderTypes";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, MenuItem} from "@mui/material";
import { useState, useEffect } from "react";

interface ModalEditOrderProps {
  open: boolean;
  onClose: () => void;
  order: OrderTypes | null;
  update: () => void;
}

const ModalEditOrder = ({ open, onClose, order, update }: ModalEditOrderProps) => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(order.state)
    }
  }, [order])

  const statusOptions = 
    order?.state === 'Pending' ? ['Pending', 'In Progress']
  : order?.state === 'In Progress' ? ['In Progress', 'Completed']
  : order?.state === 'Completed' ? ['Completed'] : ['Pending', 'In Progress', 'Completed'];

  const handleSaveStatus = async () => {
    if (order?.id) {
      const updatedOrder = await updateOrder(order.id, status);
      if (updatedOrder) {
        update()
        onClose()
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography fontSize={'20px'} fontWeight="500"> Analyze Order </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        {order && (
          <Grid container spacing={3}>
            <Grid size={6}>
              <Box
                py={2}
                px={3}
                bgcolor="#f9f9f9"
                borderRadius={2}
                display="flex"
                alignItems={"center"}
                gap={1}
              >
                <Typography fontWeight="bold" variant="subtitle2" >#{order.controlNumber} - </Typography>
                <Typography fontWeight="bold" variant="subtitle1" > {order.orderName} </Typography>
              </Box>
            </Grid>

            <Grid size={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                variant="outlined"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSaveStatus} variant="contained" sx={{ borderRadius: 2 }}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalEditOrder
