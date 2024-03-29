
//modules import
import React,{useState,useEffect} from 'react'
import {Flex,Text,Button,Input,Textarea,Select,Checkbox,useToast} from '@chakra-ui/react'
import {useRouter} from 'next/router'
//api calls
import Add_Product from '../api/product/add_product.js' 
import Get_Technologies from '../api/control/get_technologies'
import Get_Industries from '../api/control/get_industries';
import Get_Distributors from '../api/auth/distributor/get_distributors';
import Get_Manufacturers from '../api/auth/manufacturer/get_manufacturers';
//components imports
import Loading from '../../components/Loading.js'
import Header from '../../components/Header';
import UploadFile from './upload_files.js'
//utils imports
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";
//styles
import styles from '../../styles/Home.module.css';
//error handlers
import Suspension_Notification from '../../components/error_handlers/account_suspension_notification.js'

function Product(){
	//modules
		const toast = useToast();
		const router = useRouter();
		const cookies = new Cookies();
	//useEffects
		
	//utils
	const token = cookies.get('user_token');
	/** State of name of company that lists a product*/
	const [lister_company_name,set_lister_company_name]=useState('');
	/** 
		State to manage selection of existing manufacturers and distributors.
		**_by_suggestion_query represents the search query used to find users in the db.
		**_by_suggestion_query_modal represents the modal used to find respective users in the db.				
	*/
	const [distributed_by_suggestion_query,set_distributed_by_suggestion_query]=useState('');
	const [distributed_by_suggestion_query_modal,set_distributed_by_suggestion_query_modal]=useState(false);

	const [manufactured_by_suggestion_query,set_manufactured_by_suggestion_query]=useState('');
	const [manufactured_by_suggestion_query_modal,set_manufactured_by_suggestion_query_modal]=useState(false);

	let is_suspended = cookies.get('is_suspended');;


	//apis
	const get_Distributors_Data=async(acc_type,email)=>{
		/** api call to fetch distributors data*/
		await Get_Distributors().then((response)=>{
			const data = response?.data;
			const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters users that are only verified and not suspended

			set_distributors_data(result_data.filter((item) =>item?.company_name.toLowerCase().includes(distributed_by.toLowerCase()))); //
			if (acc_type == 'distributor'){
				/** Finds the details of company listing product.*/
				const result = result_data.find(({ email_of_company }) => email_of_company === email);
				set_lister_company_name(result?.company_name);
				set_distributed_by(result?.company_name);
			}
		})
	}

	const get_Manufacturers_Data=async(acc_type,email)=>{
		await Get_Manufacturers().then((response)=>{
			/** api call to fetch manufacturers data*/
			const data = response?.data;
			const result_data = data.filter((item)=> item?.verification_status && !item?.suspension_status); //filters users that are only verified and not suspended

			set_manufacturers_data(result_data?.filter((item) =>item?.company_name?.toLowerCase().includes(manufactured_by?.toLowerCase())));
			if (acc_type == 'manufacturer'){
				/** Finds the details of company listing product.*/
				const result = result_data.find(({ email_of_company }) => email_of_company === email);
				console.log(result);
				set_lister_company_name(result?.company_name)
				set_manufactured_by(result?.company_name);
				//console.log(result);
			}
		})
	}

	const get_Industries_Data=async()=>{
		await Get_Industries().then((response)=>{
			//////console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//////console.log(data.filter(v => v.verification_status))
			set_industries_data(result)
		})
	}
	const get_Technology_Data=async()=>{
		await Get_Technologies().then((response)=>{
			//////console.log(response.data)
			const data = response.data
			const result = data.filter(v => v.verification_status)
			//////console.log(data.filter(v => v.verification_status))
			set_technologies_data(result)
		})
	}
	
	//useStates:

//data
	const [industries_data, set_industries_data]=useState([]);
	const [technologies_data, set_technologies_data]=useState([]);
	const [distributors_data,set_distributors_data]=useState([]);
	const [manufacturers_data,set_manufacturers_data]=useState([]);
//states
	const [isloading,set_isloading]=useState(false);
	const [isfileupload,set_isfileupload]=useState(false); //handles state of uploading files page...

//payload
	const [name_of_product,set_name_of_product]=useState("");
	const [email_of_lister,set_email_of_lister]=useState("");
	const [listed_by_id,set_listed_by_id]=useState("");
	const [short_on_expiry,set_short_on_expiry]=useState(false);
	//manufacturer information
	const [manufactured_by,set_manufactured_by]=useState('');
	//seller information
	const [distributed_by,set_distributed_by]=useState("");
	//website_link	
	const [website_link,set_website_link]=useState("")
	//product information
	const [description_of_product,set_description_of_product]=useState("");
	const [chemical_name,set_chemical_name]=useState("");
	const [product_function,set_product_function]=useState("");
	const [brand,set_brand]=useState("");
	const [features_of_product,set_features_of_product]=useState("");
	const [application_of_product,set_application_of_product]=useState("");
	const [packaging_of_product,set_packaging_of_product]=useState("");
	const [storage_of_product,set_storage_of_product]=useState("");
	//category_of_product
	const [industry,set_industry]=useState("");
	const [technology,set_technology]=useState("");

	const payload = {
		name_of_product,
		email_of_lister,
		listed_by_id, //id of lister
		short_on_expiry,
		manufactured_by,
		distributed_by,
		description_of_product,
		chemical_name,
		function : product_function,
		brand,
		features_of_product,
		application_of_product,
		packaging_of_product,
		storage_of_product,
		data_sheet_url:'',
		safety_data_sheet_url:'',
		formulation_document_url:'',
		industry,
		technology,
		website_link
	}

	useEffect(()=>{
		if(token){
			/**
				token from cookies to be decoded token.
				Fetches data from Industries, technology, distributors, manufacturers.

				email (String): represents the current user email
					will be used in setting the email of lister, fetching the account infomation from distributors and manufacturers data,
				acc_type (String): represents the type of account of the user i.e distributor or manuacturer.
				id (id):represents the id of the current user.
			*/
			const details = jwt_decode(token);

			set_email_of_lister(details?.email)
			const email=details?.email;

			set_listed_by_id(details?.id); 
			const acc_type = details?.acc_type;

			get_Industries_Data();
			get_Technology_Data();
			get_Distributors_Data(acc_type,email);
			get_Manufacturers_Data(acc_type,email);
		}else if (is_suspended){
			return toast({
				title: 'you cannot list a new product at the moment',
				description: '',
				status: 'info',
				isClosable: true,
			  });
		}else{
			router.back();
			return toast({
              title: 'you must be signed in to list a product.',
              description: '',
              status: 'info',
              isClosable: true,
            });
            
		}
	},[token,distributed_by_suggestion_query,manufactured_by_suggestion_query,is_suspended])

	//add new product without documents function
	const handle_add_new_product=async()=>{
		/**
			Adds a new product to db.

			status (String): Shows if the current user is verified.
		*/
		const status = cookies.get('is_acc_verified');
		if (name_of_product == '' || !name_of_product || industry == '' || technology == '' || manufactured_by == "" || distributed_by == ""){
			/**
				Checks if the important fields have been filled and are not missing.
				Returns a alert modal to show the error.
			*/
			return toast({
              title: '',
              description: `Ensure all inputs are filled`,
              status: 'info',
              isClosable: true,
            });
		}else if (status == 'false'){
			return toast({
              title: '',
              description: `Your account has yet to be verified`,
              status: 'info',
              isClosable: true,
            });
		}else{
			/**
				Checks if the important fields have been filled and are not missing.
				Returns a alert modal to show the error.
			*/
			console.log(payload);
			set_isfileupload(false); 
			await Add_Product(payload).then(()=>{
				/**
					sends a payload data to server to add new product.
					payload (object): json obj containing information for the new product.

					Return:
						alerts user whether function runs successfully or not.
					catch:
						alerts user when function fails
				*/
				router.back();
				return toast({
	              title: '',
	              description: `${payload.name_of_product} has been created, awaiting review`,
	              status: 'success',
	              isClosable: true,
	            });				
			}).catch((err)=>{
				////console.log(err)
				toast({
                    title: 'could not create a new product',
                    description: err.response.data,
                    status: 'error',
                    isClosable: true,
                })
			});
		}
	}
	return(
		<Flex direction='column'>
			<Header />
			<>
				{isfileupload?
					<Flex h='90vh' justify='center' align='center'>
						<UploadFile 
							prod_payload={payload}  //passess the payload obj as prop to the child to be used to 
							handle_add_new_product={handle_add_new_product} //function is passed down to complete listing a product when user opts to skip uploading files
							set_isloading={set_isloading} //
							set_isfileupload={set_isfileupload} //handles the state to view the file uploading  page
						/>
					</Flex>
				:
					<>
						{is_suspended? 
							<Flex h='100vh' direction={'column'}>
								<Suspension_Notification/>
							</Flex>
							:
							<Flex className={styles.productbody} direction='column' p='3' gap='3'>
								<Text fontSize='32px' fontWeight='bold'>Add New Product</Text>
								<Flex direction='column'>
									<Text>Name/Title of product</Text>
									<Input type='text' placeholder='Name of product/Brand' variant='filled' onChange={((e)=>{set_name_of_product(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Brand Name</Text>
									<Input type='text' placeholder='Brand Name' variant='filled' onChange={((e)=>{set_brand(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Chemical Family</Text>
									<Input type='text' placeholder='Chemical Family' variant='filled' onChange={((e)=>{set_chemical_name(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Description</Text>
									<Textarea type='text' placeholder='Description' variant='filled' onChange={((e)=>{set_description_of_product(e.target.value)})}/>
								</Flex>
								<Flex gap='2'>
									<Flex direction='column' flex='1' position='relative'>
										<Text>Manufactured by:</Text>
										<Input type='text' value={manufactured_by} variant='filled' onChange={((e)=>{set_manufactured_by(e.target.value);set_manufactured_by_suggestion_query(e.target.value);set_manufactured_by_suggestion_query_modal(true)})}/>
										{manufactured_by_suggestion_query !== '' && manufactured_by_suggestion_query_modal?
											<>
											{manufacturers_data.length === 0? null : 
												<Flex direction='column' w='100%' h='15vh' boxShadow='dark-lg' padding='2' borderRadius='5' mt='2' position='absolute' bg='#fff' zIndex='99' top='60px' overflowY='scroll'>
													{manufacturers_data?.map((manufacturer)=>{
														return(
															<Text key={manufacturer?._id} cursor='pointer' bg='#eee' p='1' m='1' borderRadius='5' onClick={(()=>{set_manufactured_by(manufacturer?.company_name);set_manufactured_by_suggestion_query_modal(false)})} fontSize='14px' fontFamily='ClearSans-Bold'>{manufacturer.company_name}</Text>
														)
													})}
												</Flex>}
											</>
										: null}
									</Flex>
									<Flex direction='column' flex='1' position='relative'>
										<Text>Sold by</Text>
										<Input type='text' placeholder='Sold by' value={distributed_by} variant='filled' onChange={((e)=>{set_distributed_by(e.target.value);set_distributed_by_suggestion_query(e.target.value);set_distributed_by_suggestion_query_modal(true)})} />
										{distributed_by_suggestion_query !== '' && distributed_by_suggestion_query_modal?
											<>
											{distributors_data.length === 0? null : 
												<Flex direction='column' w='100%' h='15vh' boxShadow='dark-lg' padding='2' borderRadius='5' mt='2' position='absolute' bg='#fff' zIndex='99' top='60px' overflowY='scroll'>
													{distributors_data?.map((distributor)=>{
														return(
															<Text key={distributor?._id} cursor='pointer' bg='#eee' p='1' m='1' borderRadius='5' onClick={(()=>{set_distributed_by(distributor?.company_name);set_distributed_by_suggestion_query_modal(false)})} fontSize='14px' fontFamily='ClearSans-Bold'>{distributor.company_name}</Text>
														)
													})}
												</Flex>}
											</>
										: null}
									</Flex>
								</Flex>
								<Flex gap='1'>
									<Flex direction='column' gap='2' flex='1'>
										<Text fontFamily='ClearSans-Bold'>Industry</Text>
										<Select variant='filled' placeholder='Select Industry' onChange={((e)=>{set_industry(e.target.value)})}>
											{industries_data?.map((item)=>{
													return(
														<option key={item?._id} value={item?.title}>{item?.title}</option>
		
													)
												})}
										</Select>
									</Flex>
									<Flex direction='column' gap='3' flex='1'>
										<Text fontFamily='ClearSans-Bold'>Technology</Text>
										<Select variant='filled' placeholder='Select Technology' onChange={((e)=>{set_technology(e.target.value)})}>
											{technologies_data?.map((item)=>{
												return(
													<option key={item?._id} value={item?.title}>{item?.title}</option>
		
												)
											})}
										</Select>
									</Flex>
								</Flex>
								<Flex direction='column'>
									<Text>Function</Text>
									<Textarea type='text' placeholder='Function' variant='filled' onChange={((e)=>{set_product_function(e.target.value)})}/>
								</Flex>				
								<Flex direction='column'>
									<Text>Features & Benefits</Text>
									<Textarea type='text' placeholder='features and Benefits products' variant='filled' onChange={((e)=>{set_features_of_product(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Application</Text>
									<Textarea type='text' placeholder='use commas to separate different applications' variant='filled' onChange={((e)=>{set_application_of_product(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Packaging</Text>
									<Textarea type='text' placeholder='packaging infomation' variant='filled' onChange={((e)=>{set_packaging_of_product(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Storage & Handling</Text>
									<Textarea type='text' placeholder='storage and product handling information' variant='filled' onChange={((e)=>{set_storage_of_product(e.target.value)})}/>
								</Flex>
								<Flex direction='column'>
									<Text>Website_link</Text>
									<Input type='text' placeholder='link to website' variant='filled' onChange={((e)=>{set_website_link(e.target.value)})}/>
								</Flex>
								<Flex direction='column' gap='3' flex='1'>
									<Text fontFamily='ClearSans-Bold'>Short on Expiry</Text>
									<Select variant='filled' placeholder='List As Short on Expiry' onChange={((e)=>{e.target.value === 'true'? set_short_on_expiry(true): set_short_on_expiry(false)})}>
										<option value='false'>Product is not set to expire soon</option>
										<option value='true'>Product wil be expiring soon</option>
									</Select>
								</Flex>
								<Flex gap='2'>
									<Button flex='1' bg='#009393' borderRadius='0' color='#fff' onClick={handle_add_new_product} disabled={isloading? true : false}>Save and add product</Button>
									<Button flex='1' bg='#000' borderRadius='0' color='#fff' onClick={(()=>{set_isfileupload(true)})} disabled={isloading? true : false}>Continue to upload files</Button>
								</Flex>
								<Button bg='#eee' borderRadius='0' color='red' onClick={(()=>{router.back()})} disabled={isloading? true:false}>Cancel</Button>
							</Flex>
						}
					</>
				}
			</>
		</Flex>
	)
}

export default Product;



/**
	What am I trying to do?
	Set the name of the company for the account that is signed in.
	If its a manufacturer the name of the company same goes for the distributor
	-ideas
	Fetch the details of the account --done
	use the details to populate the info --
	Do not use state, it will bug me out

**/