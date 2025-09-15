import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Switch, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Mock user data
    setUsers([
      { id: 1, name: 'Admin User', email: 'admin@example.com', phone: '123-456-7890', role: 'Admin', active: true },
      { id: 2, name: 'Regular User', email: 'user@example.com', phone: '098-765-4321', role: 'User', active: true },
      { id: 3, name: 'Inactive User', email: 'inactive@example.com', phone: '555-555-5555', role: 'User', active: false },
    ]);
  }, []);

  const handleAddUser = () => {
    setCurrentUser({ id: users.length + 1, name: '', email: '', phone: '', role: 'User', active: true });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleActive = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleSaveUser = () => {
    if (isEditMode) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      setUsers([...users, currentUser]);
    }
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser} sx={{ mb: 2 }}>
        Add New User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.active}
                    onChange={() => handleToggleActive(user.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditUser(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {currentUser && (
            <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
              <TextField
                name="name"
                label="Name"
                value={currentUser.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="email"
                label="Email"
                value={currentUser.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="phone"
                label="Phone"
                value={currentUser.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={currentUser.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;