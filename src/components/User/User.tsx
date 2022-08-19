import { FC, useState } from 'react';
// import AppContext from '../../providers/AppContext';
import DefaultAvatar from '../../assets/images/Default-avatar.jpg';
import './User.css';
import { UserProps } from '../../types/Interfaces';
import { Tooltip } from '@mui/material';

const UserComponent: FC<UserProps> = ({ props }): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (

    <Tooltip open={open} onClose={handleClose} onOpen={handleOpen}
      title={
        <div>
          <div>{props.user.username}</div>
          <p>{props.user.email}</p>
        </div>
      }>
      <div className="user-box" id="user-box">
        <div>
          {<img src={props?.user.imgURL} alt="avatar" /> && <img src={DefaultAvatar} alt="avatar" />} @{props?.user.username}
        </div>
        <div>
          {props?.buttonEl}
        </div>
      </div>

    </Tooltip>
  );
};

export default UserComponent;
