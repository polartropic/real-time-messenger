import { FC, useState } from 'react';
// import AppContext from '../../providers/AppContext';
import './User.css';
import { UserProps } from '../../types/Interfaces';
import InitialsAvatar from 'react-initials-avatar';
import { Tooltip } from '@mui/material';

const UserComponent: FC<UserProps> = ({ props }): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const toolTipStyle = {
    bgcolor: 'red',
    boxShadow: 1,
    borderRadius: 20,
    p: 2,
    minWidth: 300,
  };

  return (

    <Tooltip open={open} onClose={handleClose} onOpen={handleOpen} className='toolTip'
      title={
        <>
          <p>{props.user.firstName} {props.user.lastName}</p>
          <p>{props.user.email}</p>
          <p>{props.user.phoneNumber}</p>

        </>
      }
      placement={'left'}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            'color': 'white',
            'marginTop': '10px !important',
            'bgcolor': 'rgba(47, 69, 93, 0.8)',
            'borderRadius': '10px',
            'fontSize': 10,
            'z-index': 'tool-tip: 1000',
            '& .MuiTooltip-arrow': {
              'color': 'rgba(47, 69, 93, 0.8)',
            },
          },
        },
      }}>
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
