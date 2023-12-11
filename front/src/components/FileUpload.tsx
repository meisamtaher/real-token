import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { Stack, TextField, Typography } from '@mui/material';
import { Button } from '@mui/base';
interface Props{
  cid: string|undefined,
  setCid: React.Dispatch<React.SetStateAction<string | undefined>>
}
const ImageUploadToIPFS = (props: Props) => {
  const [file, setFile] = useState<File|null>(null);
  const [url, setUrl] = useState('');
  const [json, setJson] = useState('');
  const [name, setName] = useState<string|undefined>(undefined);
  const [description, setDescription] = useState<string|undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files)
        setFile(e?.target?.files[0]);
  };
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.value)
        setName(e?.target?.value);
  };  
  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.value)
      setDescription(e?.target?.value);
  };

  const uploadToIPFS = async () => {
    if (file === null) return alert('No file selected.');
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const pinataMetadata = JSON.stringify({
      name: 'NFTPic',
    });
    formData.append('pinataMetadata', pinataMetadata);
    try {
      console.log("Uploading file on IPFS... ");
      const response = await axios.post(import.meta.env.VITE_PINATA_PIN_FILE_URL, formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data;`,
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        }
      });
      console.log("response: ",response);
      const ipfsUri = import.meta.env.VITE_PINATA_GET_URL+response.data.IpfsHash;
      setUrl(ipfsUri);
      console.log('IPFS URL:', ipfsUri);
      const data = JSON.stringify({
        pinataContent: {
          name: name,
          description: description,
          external_url: "https://Narpet.io",
          image: ipfsUri
        },
        pinataMetadata: {
          name: "metadata.json"
        }
      })
      const res = await axios.post(import.meta.env.VITE_PINATA_PIN_JSON_URL, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
          }
        });
      console.log(res.data);
      const Url = import.meta.env.VITE_PINATA_GET_URL+res.data.IpfsHash;
      setJson(Url);
      props.setCid(res.data.IpfsHash);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setLoading(false);
  };

  return (
    <Stack padding={5} direction={'column'} spacing={3} justifyContent={'right'}>
      <TextField disabled = {loading} label="NFT Name" value={name} onChange={onNameChange} />
      <TextField disabled = {loading} label="Description" value={description} onChange={onDescriptionChange} minRows={3}/>
      <input disabled = {loading} type="file" onChange={onFileChange} accept="image/*" />
      <Button disabled = {loading} onClick={uploadToIPFS}>Upload to IPFS</Button>
      {loading && <Typography>Uploading file ...</Typography>}
      {url && <div><a href={url} target="_blank" rel="noopener noreferrer">View uploaded image</a></div>}
      {url && <img  src={url} width={200} height={275}/>}
      {json && <div><a href={json} target="_blank" rel="noopener noreferrer">View Json Metadat</a></div>}
    </Stack>
  );
};

export default ImageUploadToIPFS;