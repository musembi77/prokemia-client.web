import React,{useState} from 'react'
import {Flex,Text,Spacer,Input} from '@chakra-ui/react'
import styles from '../styles/Home.module.css';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import Header from '../components/Header.js';

function Hub(){
	const [active,setActive]=useState(false);
	return(
		<Flex direction='column'>
			<Header/>
			<Flex direction='row'>
				{active? 
					<Menu setActive={setActive}/>
					:
					null
				}
				<Flex direction='column' bg='#eee' w='100vw' mt=''>
					<Flex align='center' gap='5' w='100%' bg='#009393' color='#fff' p='2'>
						<MessageIcon onClick={(()=>{setActive(true)})}/>
						<Flex direction='column'>
							<Text className={styles.Console} fontSize='20px'>Prokemia</Text>
							<Text fontSize='13px'>200members</Text>
						</Flex>
					</Flex>
					<Flex h='75vh'  direction='column' gap='2' mt='2' p='2' overflowY='scroll'>
						{texts.map((content)=>{
							return(
								<TextItem content={content} key={content.id}/>
							)
						})}
					</Flex>
					<TextBox />
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Hub;

const Menu=({setActive})=>{
	return(
		<Flex className={styles.Hub} direction='column' w='100%' p='2' gap='2'>
				<Flex w='100%' color='#fff' float='right' mt='5' cursor='pointer'>
					<Spacer/>
					<CloseIcon onClick={(()=>{setActive(false)})}/>
				</Flex>
				<Flex direction='column' gap='4'>
					<MenuItem/>
				</Flex>
		</Flex>
	)
}

const MenuItem=()=>{
	return(
		<Flex borderBottom='1px solid #fff' bg='#fff' borderRadius='3' p='2' gap='1'>
			<AccountCircleIcon style={{fontSize:'30px'}}/>
			<Flex direction='column'>
				<Text fontWeight='bold' >Prokemia</Text>
				<Text fontSize='14px'>Welcome to The community meet...</Text>
			</Flex>
		</Flex>
	)
}

const TextItem=({content})=>{
	return(
		<Flex bg='#fff' p='2' w='80%' direction='column'>
			<Text color='#009393' fontSize='14px'>{content.name}</Text>
			<Text>{content.content}</Text>
			<Flex>
				<Spacer/>
				<Text fontSize='14px'>{content.timestamps}</Text>
			</Flex>
		</Flex>
	)
}

const texts=[
	{
		name:'Alex',
		content:"I am looking for cereal crops, in bulk,contact me at +254798903901",
		timestamps:"12.04pm"
	},
	{
		name:'Sam',
		content:"I am looking for InCI, ingredients contact me at 0759233322",
		timestamps:"2.05pm"
	},
	{
		name:'Gerald',
		content:"I sell fertilisers and biodegradable chemicals.We are located at Nation house ground floor.Shop No.25 next to Equity bank",
		timestamps:"7.01pm"
	},
	{
		name:'Alex',
		content:"I am looking for cereal crops, in bulk,contact me at +254798903901",
		timestamps:"12.04pm"
	},
	{
		name:'Sam',
		content:"I am looking for InCI, ingredients contact me at 0759233322",
		timestamps:"2.05pm"
	},
	{
		name:'Gerald',
		content:"I sell fertilisers and biodegradable chemicals.We are located at Nation house ground floor.Shop No.25 next to Equity bank",
		timestamps:"7.01pm"
	},
]

const TextBox=()=>{
	return(
		<Flex m='2' align='center' gap='2'>
			<Input flex='1' bg='#fff' placeholder='Enter message'/>
			<SendIcon />
		</Flex>
	)
}