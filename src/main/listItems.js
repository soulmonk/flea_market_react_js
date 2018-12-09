import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import {Link} from 'react-router-dom';
import WebIcon from '@material-ui/icons/Web';

export const mainListItems = (
  <>
    <ListItem button component={Link} to='/'>
      <ListItemIcon>
        <DashboardIcon/>
      </ListItemIcon>
      <ListItemText primary="Dashboard"/>
    </ListItem>

    <ListItem button component={Link} to='/games'>
      <ListItemIcon>
        <WebIcon/>
      </ListItemIcon>
      <ListItemText primary="Games"/>
    </ListItem>
  </>
);