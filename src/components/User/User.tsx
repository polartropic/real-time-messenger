import { FC, useState } from 'react';
// import AppContext from '../../providers/AppContext';
import './User.css';
import { UserProps } from '../../types/Interfaces';
import { Tooltip } from '@mui/material';
import InitialsAvatar from 'react-initials-avatar';

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
        {props?.user.imgURL ?
          <div>
            <img src={props?.user.imgURL}
              alt="avatar" className='user-avatar' /> {`@${props?.user.username}`}
          </div> :
          <>
            <InitialsAvatar
              name={`${props.user.firstName} ${props.user.lastName}`}
              className={'avatar-default'} /> {`@${props?.user.username}`}
          </>
        }


        <div>
          {props?.buttonEl}
        </div>
      </div>

    </Tooltip>
  );
};

export default UserComponent;
