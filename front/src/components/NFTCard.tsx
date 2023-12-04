// import {useNavigate} from 'react-router-dom';
import  { useEffect} from 'react';
import { Card,CardContent, Typography, Button, Avatar, Stack } from '@mui/material';
import { ListedNFTProp } from '../interfaces/types';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<ListedNFTProp>;
function NFTCard(props: Props) {
  return (
    <Card onClick={props.onClick} className="nft-card">
        <CardContent>
        <img src={props.NFT.img}  width={200} height={275}/>
        <h4>{props.NFT.name}</h4>
        <p>{props.NFT.price} {props.NFT.price_token}</p>
        <Button variant="contained" color="primary" >
            Buy Now
        </Button>
        </CardContent>
    </Card>
    // <Card>
    //     <CardContent sx ={{display:'flex', justifyContent:'center', alignItems: 'center', direction:'column' }} >
    //         <Stack direction="column" alignItems="center" spacing={5}>
    //             <Avatar src={props.NFT.img} sx={{ width: 70, height: 70 }}  />
    //             <Typography gutterBottom variant="h5" component="div" >
    //             {props.NFT.name}
    //             </Typography>
    //             <Button onClick={props.onClick} sx={(theme)=>({border:"3px solid #C6EEEA", borderRadius:'10px' })}>
    //             Buy
    //             </Button>
    //         </Stack>
    //     </CardContent>
    // </Card>
  );
}

export default NFTCard;