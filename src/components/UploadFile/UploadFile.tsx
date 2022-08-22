import './UploadFile.css';
import { useState, useEffect, useContext } from 'react';
import { uploadImage } from '../../services/storage.services';
import AppContext from '../../providers/AppContext';


export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const { appState } = useContext(AppContext);
  const userName = appState.userData?.username;

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (event: React.FormEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files || event.currentTarget.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(event.currentTarget.files[0]);
  };

  const handleUploadFile = (event: any) => {
    event.preventDefault();
    const file: File = event.target[0].files[0];
    uploadImage(file, userName!);
  };

  return (
    <form onSubmit={handleUploadFile}>
      <label className="labels-edit" htmlFor="new-password">New Avatar:</label> <br />

      <input type='file' onChange={onSelectFile} />
      <input type="submit" className="change-button-edit" value="Change" />
      {selectedFile && <img src={preview} alt='selected file' className='sample-upload' />}
    </form>
  );
};
