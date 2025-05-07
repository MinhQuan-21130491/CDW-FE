import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';

export default function GroupManagementModal({ open, handleClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [groupName, setGroupName] = useState('Nhóm của tôi');
  const [searchTerm, setSearchTerm] = useState('');

  const dummyUsers = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' }
  ];

  const handleRename = () => {
    console.log('Tên nhóm mới:', groupName);
    handleClose();
  };

  const handleAddMember = (user) => {
    console.log('Thêm thành viên:', user);
  };

  const handleRemoveMember = (user) => {
    console.log('Xóa thành viên:', user);
  };

  const filteredUsers = dummyUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Quản lý nhóm</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ mb: 2 }}>
          <Tab label="Đổi tên nhóm" />
          <Tab label="Thêm thành viên" />
          <Tab label="Xóa thành viên" />
        </Tabs>

        {/* Tab 1: Rename group */}
        {tabIndex === 0 && (
          <Box>
            <TextField
              label="Tên nhóm mới"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleRename}>Lưu</Button>
          </Box>
        )}

        {/* Tab 2: Add member */}
        {tabIndex === 1 && (
          <Box>
            <TextField
              label="Tìm kiếm người dùng"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <List>
              {filteredUsers.map(user => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <IconButton onClick={() => handleAddMember(user)}>
                      <PersonAddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Tab 3: Remove member */}
        {tabIndex === 2 && (
          <Box>
            <List>
              {dummyUsers.map(user => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <IconButton onClick={() => handleRemoveMember(user)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
