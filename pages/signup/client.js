//modules imports
import React,{useState,useEffect} from 'react'
import {Flex,Text,Button,Input,InputGroup,InputRightElement,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import Cookies from 'universal-cookie';
//components imports
import styles from '../../styles/Home.module.css'
import Header from '../../components/Header.js';
//icon imports
import {Visibility,VisibilityOff} from '@mui/icons-material'
//api calls
import SignUp from '../api/auth/signup.js'


export default function ClientSignUp(){
	//utils
	const router = useRouter();
	const cookies = new Cookies();
	const token = cookies.get('user_token');
	const toast = useToast();
	//apis
	//states
	const [show, setShow] = useState(false); //handle state to toggle password
	const handleClick = () => setShow(!show); //handle state to toggle view of password

	const [first_name, set_first_name] = useState('');
	const [last_name, set_last_name] = useState('');
	const [password, set_password] = useState('');
	const [email_of_company, set_email_of_company] = useState('');

	const [issubmitting,set_issubmitting]=useState(false);

	const payload = {
		first_name,
		last_name,
		password,
		email_of_company,
		acc_type: 'client'
	}
	//functions
	const Verify_Inputs=()=>{
		set_issubmitting(true)
		//check if email format is maintained
		const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		const gmailRegex = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g
		const yahooRegex = /^[^@]+@(yahoo|ymail|rocketmail)\.(com|in|co\.uk)$/i

		if (password && first_name && last_name && email_of_company){
			if (!email_of_company.match(validRegex)){
				toast({
					title: '',
					description: 'Use a valid email format e.g example@company.com',
					status: 'info',
					isClosable: true,
				});
				return;
			}else{
				handle_Sign_Up()
			}
		}else if(!password || !first_name || !last_name || !email_of_company){
			toast({
				title: '',
				description: 'All inputs are required',
				status: 'info',
				isClosable: true,
			});
		}
	}
	const handle_Sign_Up=async()=>{
		await SignUp(payload).then((response)=>{
			if(response.status === 201){
				toast({
					title: '',
					description: `${response.data}`,
					status: 'error',
					isClosable: true,
				});
			}
			else{
				toast({
					title: '',
					description: 'Successfully Created an account',
					status: 'success',
					isClosable: true,
				});
				router.push(`/profile/${response.data._id}`)
			}
		}).catch((err)=>{
			toast({
				title: '',
				description: `${err.response.data}`,
				status: 'error',
				isClosable: true,
			});
		})
	}
	
	return(
		<Flex direction='column'>
			<Header/>
			<Flex className={styles.SignupBody}>
				<Flex className={styles.authSection} gap='2'>
					<Text w='100%' fontSize='2.5rem' color='#fff' fontFamily='ClearSans-bold' >Welcome to Pro<span style={{color:"#000"}}>Kemia</span> </Text>
					<Text w='100%'  fontWeight='bold'>Search, Learn, Engage ,get samples and request quotations for products, and purchase from thousands of distributors - all in one platform.Access all easily.</Text>
				</Flex>
				<Flex className={styles.authForm} gap='2' direction='column'>
					<Text w='100%' textAlign='center' fontSize='2rem' fontFamily='ClearSans-bold'><span style={{borderBottom:"4px solid #009393",borderRadius:"3px"}}>Sign</span> Up</Text>
					<Flex gap='2'>
						<Flex direction='column' gap='2' flex='1'>
							<Text>First-Name</Text>
							<Input type='text' placeholder='First-Name' variant='filled' required onChange={((e)=>{set_first_name(e.target.value)})}/>
						</Flex>
						<Flex direction='column' gap='2' flex='1'>
							<Text>Last-Name</Text>
							<Input type='text' placeholder='Last-Name' variant='filled' required onChange={((e)=>{set_last_name(e.target.value)})}/>
						</Flex>
					</Flex>
					<Flex direction='column' gap='2'>
						<Text>Email</Text>
						<Input type='email' placeholder='Email' variant='filled' required onChange={((e)=>{set_email_of_company(e.target.value)})}/>
					</Flex>
					<Text>Password</Text>
					<InputGroup size='md'>
						
						<Input
						pr='4.5rem'
						type={show ? 'text' : 'password'}
						placeholder='Enter password'
						variant='filled'
						required
						onChange={((e)=>{set_password(e.target.value)})}
						/>
							<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'>
							{show ? <VisibilityOff/> : <Visibility/>}
							</Button>
						</InputRightElement>
					</InputGroup>
					<Text fontSize={'11px'}>By Signing up you agree to our <a href="/t&c" target="_blank" rel="noopener noreferrer" style={{color:'#009393'}}> terms&conditions</a > and our <a href="privacy_policy" target="_blank" rel="noopener noreferrer" style={{color:'#009393'}}>privacy policy</a>.</Text>
					<Button bg='#009393' color='#fff' onClick={Verify_Inputs} disabled={issubmitting? true:false}>Create Account</Button>
				</Flex>
			</Flex>				
		</Flex>
	)
}