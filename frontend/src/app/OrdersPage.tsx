"use client"
import React, { useEffect, useState } from "react"
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, MenuItem, Box, Grid, Paper, Chip, Container, TableContainer} from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import { getOrders } from "@/services/getOrders"
import ModalCreateOrder from "@/components/ModalCreateOrder"
import { OrderTypes } from "@/types/orderTypes"
import ModalEditOrder from "@/components/ModalEditOrder"

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderTypes[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderTypes | null>(null)

  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState(false)
  
  const [filterNumber, setFilterNumber] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  
  const [update, setUpdate] = useState<number>(0)
  
  const handleOpenModalEdit = (order: OrderTypes) => {
    setSelectedOrder(order)
    setOpenEdit(true)
  }

  const handleCloseModal = () => {
    setOpenEdit(false)
    setSelectedOrder(null)
  }
  
  const filteredOrders = orders.filter((order) => {
    return (
      (filterNumber.trim() === "" ||
        (order.controlNumber !== undefined && 
         order.controlNumber.toString().includes(filterNumber))) &&
      (filterStatus.trim() === "" || order.state === filterStatus)
    )
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders({
          state: filterStatus,
          controlNumber: filterNumber
        })
        setOrders(response)
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    
    fetchOrders()
  }, [update, filterStatus, filterNumber])


  const triggerUpdate = () => {
    setUpdate(prev => prev + 1)
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom fontWeight="500" color="primary">
          Order Management
        </Typography>

        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Box mb={2}>
            <Typography variant="h6" fontWeight="medium" color="text.primary" mb={2}>
              <FilterAltIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'text-bottom' }} />
              Filters
            </Typography>
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid size={12}>
              <TextField
                label="Control Number"
                value={filterNumber}
                onChange={(e) => setFilterNumber(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Order State"
                select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {["Pending", "In Progress", "Completed"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                sx={{ borderRadius: 2, px: 3 }}
                onClick={() => setOpenModalCreate(true)}
              >
                Register Order
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant='body1' fontWeight="bold"> {filteredOrders.length} orders found </Typography>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Control Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Identification</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>State</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell><strong>#{order.controlNumber}</strong></TableCell>
                    <TableCell>{order.orderName}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.state}
                        sx={{backgroundColor:
                          order.state === "Pending" ? "#e5aeae" :
                          order.state === "In Progress" ? "#92b3d1" :
                          "#9abc9a",
                        minWidth: "100px",}
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenModalEdit(order)}
                        startIcon={<EditIcon />}
                        disabled={order.state === "Completed"}
                        size="small"
                        sx={{ borderRadius: 1.5 }}
                      >
                        Analyze
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No orders found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ModalCreateOrder
        open={openModalCreate}
        onClose={() => setOpenModalCreate(false)}
        update={triggerUpdate}
      />

      <ModalEditOrder
        open={openEdit}
        onClose={handleCloseModal}
        order={selectedOrder}
        update={triggerUpdate}
      />

    </Container>
  )
}

export default OrdersPage