//modules imports
import React,{useState} from 'react';
import {useRouter} from 'next/router';
import {Flex,Text,Button,Input,InputGroup,InputRightElement,Image} from '@chakra-ui/react';
import bcrypt from 'bcryptjs';
import Cookies from 'universal-cookie';
//icons-imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Room,Visibility,VisibilityOff} from '@mui/icons-material'
//components imports

//api-calls
import Edit_Manufacturer from '../api/auth/manufacturer/edit_manufacturer.js'
// import Change_Password from '../api/auth/distributor/change_password.js'
import Delete_Manufacturer from '../api/auth/manufacturer/delete_manufacturer_account.js'
//utils
import {storage} from '../../components/firebase.js';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import { v4 } from "uuid";

function Settings({manufacturer_data}){
	const [show, setShow] = useState(false);
  	const handleClick = () => setShow(!show);

	const [active,setActive]=useState(false);
	const [currentValue,setcurrentValue]=useState('');

	const router = useRouter();

	const [account,setAccount]=useState('distributor');

	const [edit,setedit]=useState(false);
	const [new_password,set_new_password]=useState(manufacturer_data?.password)
	// const old_password = manufacturer_data?.password

	const cookies = new Cookies();

	const payload = {
		_id : manufacturer_data?._id,
	}

	const Handle_Change_Password=async()=>{
		alert('success')
		// await Change_Password(password_payload).then(()=>{
		// 	alert('success')
		// })
	}

	const Handle_Delete_Manufacturer=async()=>{
		await Delete_Manufacturer(payload).then(()=>{
			cookies.remove('user_token', { path: '/' });
			router.push("/")
			alert('success')
			
		})
	}

	return(
		<Flex p='2' direction='column' gap='2' w='100%' overflowY='scroll' h='100vh'>
			<Text fontSize='34px' textDecoration='1px solid underline #009393' fontWeight='bold'>MyProfile</Text>
			{edit ?
				<EditProfile setedit={setedit} manufacturer_data={manufacturer_data}/>
			:
				<Flex direction='column' gap='2'>
					<Flex gap='3' direction='column'>
						<Flex direction='column' gap='1' w='100%' bg='#eee' p='2' borderRadius='5' boxShadow='dark-lg'>
							<Text  p='1' borderRadius='5' fontSize='24px' fontWeight='bold' color='#009393'>{manufacturer_data?.first_name} {manufacturer_data?.last_name}</Text>
							<Text p='1' borderRadius='5'>Email: {manufacturer_data?.email_of_company}</Text>
							<Text p='1' borderRadius='5'>Mobile: {manufacturer_data?.mobile_of_company}</Text>
							<Text p='1' borderRadius='5'>Address: {manufacturer_data?.address_of_company}</Text>
							<Text p='1' borderRadius='5'>Description: {manufacturer_data?.description}</Text>
						</Flex>
						<Button onClick={(()=>{setedit(true)})} bg='#009393' color='#fff'>Edit Profile</Button>	
					</Flex>
					<Flex borderBottom='1px solid #000' p='1' direction='column'>
						<Text fontSize='20px' fontWeight='bold'>Security</Text>
						<Flex gap='2' direction='column' >
							<Text fontWeight='bold'>Password</Text>
							<InputGroup size='md'>
								<Input
								pr='4.5rem'
								type={show ? 'text' : 'password'} value={new_password} placeholder='password' onChange={((e)=>{set_new_password(e.target.value)})}
								/>
									<InputRightElement width='4.5rem'>
									<Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'>
									{show ? <VisibilityOff/> : <Visibility/>}
									</Button>
								</InputRightElement>
							</InputGroup>
							<Button bg='#ff' border='1px solid #000' onClick={Handle_Change_Password}>Change Password</Button>
						</Flex>
					</Flex>
					<Flex p='1' color='red' direction='column'>
						<Text fontSize='20px' color='red' fontWeight='bold' >Delete Account</Text>
						<Flex direction='column'>
							<Text>By deleting your account , all your information, products and activities in our platform will be erased as your account will be permamnetly deleted and will not be restored.</Text>
							<Button bg='#ff' border='1px solid red' onClick={Handle_Delete_Manufacturer}>Delete Account</Button>
						</Flex>
					</Flex>
				</Flex>
			}
		</Flex>
	)
}

export default Settings;

const EditProfile=({setedit,manufacturer_data})=>{
	const cookies = new Cookies();
	const [first_name,set_first_name]=useState(manufacturer_data?.first_name);
	const [last_name,set_last_name]=useState(manufacturer_data?.last_name);
	const [mobile_of_company,set_mobile_of_company]=useState(manufacturer_data?.mobile_of_company);
	const [address_of_company,set_address_of_company]=useState(manufacturer_data?.address_of_company);
	const [company_name,set_company_name]=useState(manufacturer_data?.company_name);
	const [description,set_description]=useState(manufacturer_data?.description);
	const [profile_photo,set_profile_photo]=useState('');
	const [profile_photo_url,set_profile_photo_url]=useState(manufacturer_data?.profile_photo_url);

	const payload = {
		_id: manufacturer_data?._id,
		first_name,
		last_name,
		mobile_of_company,
		address_of_company,
		company_name,
		description,
		profile_photo_url
	}
	const profile_upload_function=async()=>{
		console.log(profile_photo)
		await handle_profile_image_upload().then((res)=>{
			if (res == null || res == undefined){
				alert('err')
			}else{
				const img_payload = {
					_id: manufacturer_data?._id,
					profile_photo_url: res
				}
				Edit_Manufacturer(img_payload).then(()=>{
					console.log(img_payload)
					alert('successfully uploaded image')
					setedit(false)
				})
			}
		})
	}
	const handle_profile_image_upload=async()=>{
		if (profile_photo.name == undefined){
			alert('could not process file, try re-uploading again.')
			return (null)
		}else{
			console.log(profile_photo.name)
			const profile_photo_documentRef = ref(storage, `profile_photo/${profile_photo?.name + v4()}`);
			const snapshot= await uploadBytes(profile_photo_documentRef,profile_photo)
			const file_url = await getDownloadURL(snapshot.ref)
			cookies.set('profile_photo_url', file_url, { path: '/' });
			return file_url
		}
	}
	const handle_Edit_Profile=async()=>{
		await Edit_Manufacturer(payload).then(()=>{
			console.log(payload)
			alert('success')
			setedit(false)
		})
		
	}
	return(	
		<Flex gap='3' direction='column' overflowY='scroll' h='80vh'>
			{manufacturer_data?.profile_photo_url == ''? 
				<LocationCityIcon style={{fontSize:'150px',padding:'10px'}}/> 
			: 
				<Flex gap='2' >
					<Image boxSize='200px' src={manufacturer_data?.profile_photo_url} alt='profile photo' boxShadow='lg' objectFit='cover'/>
					<Flex direction='column' gap='2'>
						<Text>Select Image to set as Profile Image</Text>
						<Input type='file' placeholder='Select Image to set as Profile Image' accept='.jpg,.png,.jpeg' variant='filled' onChange={((e)=>{set_profile_photo(e.target.files[0])})}/>
						<Button bg='#009393' color='#fff' onClick={profile_upload_function}>Upload profile photo</Button>
					</Flex>
				</Flex>
			}
			<Flex direction='column' gap='3' w='100%'>
					<Flex direction='column'>
						<Text>First_Name</Text>
						<Input type='text' placeholder={manufacturer_data?.first_name} variant='filled' onChange={((e)=>{set_first_name(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Last_Name</Text>
						<Input type='text' placeholder={manufacturer_data?.last_name} variant='filled' onChange={((e)=>{set_last_name(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Mobile</Text>
						<Input type='tel' placeholder={manufacturer_data?.mobile_of_company} variant='filled' onChange={((e)=>{set_mobile_of_company(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Company_name</Text>
						<Input type='text' placeholder={manufacturer_data?.company_name} variant='filled' onChange={((e)=>{set_company_name(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Description</Text>
						<Input type='text' placeholder={manufacturer_data?.description} variant='filled' onChange={((e)=>{set_description(e.target.value)})}/>
					</Flex>
					<Flex direction='column'>
						<Text>Address</Text>
						<Input type='text' placeholder={manufacturer_data?.address_of_company} variant='filled' onChange={((e)=>{set_address_of_company(e.target.value)})}/>
					</Flex>
					<Flex gap='2' >
						<Button onClick={handle_Edit_Profile} bg='#009393' color='#fff' flex='1'>Save</Button>
						<Button onClick={(()=>{setedit(false)})} bg='#fff' border='1px solid red' color='#000' flex='1'>Cancel</Button>						
					</Flex>
				</Flex>
			</Flex>
	)
}
