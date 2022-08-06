import NotFoundImage from '../../assets/images/PageNotFound.png';
import './NotFound.css';

const NotFound = (): JSX.Element => {
  return (
    <div id='not-found-div'>
      <img id='not-found-img' src={NotFoundImage} alt="404-not-found" />
    </div>
  );
};

export default NotFound;
