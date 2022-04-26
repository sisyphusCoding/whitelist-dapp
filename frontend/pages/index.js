import { Box ,Text , Image , Heading, HStack, Badge, useSlider, useToast,Alert , AlertIcon, useShortcut, Spinner, Button } from "@chakra-ui/react"
import { useRef, useState , useEffect } from "react"

import Web3Modal from 'web3modal'

import { ethers , providers, Contract} from 'ethers'

import {WHITELIST_CONTRACT_ADDRESS , abi} from '../constants'




export default function Home() {
 if (typeof window !== "undefined") {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
       
        if (oldNetwork) {
         
            window.location.reload();
          
        }
    });
}
  const toast = useToast()
  const id = 'test-toast'
  const [count , setCount] = useState(0)
  
  const [enable ,setEnable] = useState(true)

  const [walletConnected , setWalletConnected] = useState(false)

  const [ joinedWhitelist ,setJoinedWhitelist] = useState(false)

  const [loading, setLoading] = useState(false)

  const [numberOfWhitelisted , setNumberOfWhitelisted] = useState(0)

  const web3ModalRef = useRef()


  const checkWhich = async() => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    const {chainId} = await web3Provider.getNetwork()
    if(chainId !== 4) {
      if(!toast.isActive(id)) {
        setEnable(false)
      toast({
         id, 
        position:'top-left' , 
        render: () => (
          <Alert
          width={'fit-content'}
          p={3}
          color='white'
          bg='red.700'
          borderRadius={8}
          status='warning'>Change the network to <Text as='u' ml={1} > RINKEBY </Text> <AlertIcon color='white' ml={3} />
          </Alert> 
        )
      }) }
    } else {
  if(!toast.isActive(id)) {
      toast({
        id,
        position:'top-left' ,
        render: () => (
          <Alert
          p={3}
          width={'fit-content'}
          color='white'
          bg='green.600'
          borderRadius={8}
          status='success'
          isClosable=  'true'

          >
          Network is set to <Text as='u' ml={1}>RINKEBY</Text>
          <AlertIcon color='white' ml={3} />
          </Alert>
        )
      }) 
  } 
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)


    checkWhich()


    if(needSigner){
      const signer = web3Provider.getSigner()
      return signer
    }

    return web3Provider

  }



  const addAddressToWhitelist = async () => {
    try{
      const signer = await getProviderOrSigner(true) 

      const whitelistContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS , 
        abi,
        signer
      )

      const tx = await whitelistContract.addAddressToWhitelist()
      setLoading(true)

      await tx.wait()
      setLoading(false)

      await getNumberOfWhitelisted()
      setJoinedWhitelist(true)
    }
    catch(err){
      console.error(err)
    }
  }


  const getNumberOfWhitelisted = async() => {
    try{
      const provider = await getProviderOrSigner()

      const whitelistContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS ,
        abi,
        provider
      )

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted()
      setNumberOfWhitelisted(_numberOfWhitelisted)

    }

    catch (err) {
      console.error(err)
    }
  }


  const checkIfAddressInWhitelist = async() => {
    try{
      const signer = await getProviderOrSigner(true)
      const whitelistContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS , 
        abi ,
        signer
      )

      const address = await signer.getAddress()

      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      )

      setJoinedWhitelist(_joinedWhitelist)

    }

    catch (err) {
      console.log(err)
    }
  }

  const connectWallet = async() => {
    try{
      await getProviderOrSigner()
      setWalletConnected(true)
      checkIfAddressInWhitelist()
      getNumberOfWhitelisted()
    }
    catch (err) {
      console.log(err)
    }
  } 


  useEffect(() => {

    if(!walletConnected){


      web3ModalRef.current = new Web3Modal ({
        network: "rinkeby" ,
        providerOptions: {},
        disableInjectedProvider: false,
      })

      connectWallet()
    }


  }, [walletConnected])



  const renderButton = () => {
    if(walletConnected) {
      if(joinedWhitelist){
        return(
          <Alert 
          width={'fit-content'}
          borderRadius={8}
          bg={'blue.700'}
          p={3}
          color='white'
          status="success">
          Thank&apos;s for joining the Whitelist <AlertIcon color='white' ml={2}/> </Alert>
        )
      } else if(loading) {
        return (
          <Alert 
          width={'fit-content'}
          borderRadius={8}
          bg={'blue.700'}
          p={3}
          color='gray.100'>
          <Spinner color='gray.300' mr={3} size={'md'} /> LOADING
          </Alert>
        )
      }
      else {
        return (
          <Button
          _hover={{
            bg: 'blue.900',
          }}
          onClick={addAddressToWhitelist}
          bg='blue.700' borderRadius={8} p={3} size={{base:'sm' , lg:'lg'}}>
          Join the Whitelist
          </Button>
        )
      }
    }
    else {
      return (
        <Button
        _hover={{
            bg: 'blue.900',
          }}
        onClick={connectWallet}
        bg='blue.700' borderRadius={8} p={3} size={{base:'sm' , lg:'lg'}}>
       Connect your Wallet 
        </Button>
      )
    }
  }





  return (

    <Box
    overflow={'hidden'}
    justifyContent={'center'}
    height={'100vh'} textColor={'whiteAlpha.700'} bg={'gray.800'} display={'flex'} alignItems={'center'} >



    <Box

    borderRadius={'8px'}
    shadow={'2xl'}
    p={'9'}
    height={{base:'80vh' , lg: 'fit-content'}}
    width={'90vw'}
    flexFlow={{base: 'column' , lg:'row'}}
    display={'flex'} justifyContent={'center'} alignItems={'center'} 
    >


    <Box 
    height={'fit-content'}
    width={'90vw'}
    p={10}
    flexFlow={'column'}
    display={'flex'} justifyContent={'center'} alignItems={'start'} 
    > 
    <Heading as='h1' size='2xl' p={2} >Welcome to Crypto Devs !</Heading>
    <Heading as='h5' size="md" p={2} >It&apos; a NFT collection for developers in Crypto</Heading>
    <HStack mt={8} p={2} spacing='10px'  >
    <Badge colorScheme='gray' fontWeight='bold' fontSize='md' px='2' >{numberOfWhitelisted}</Badge> 
    <Text> have already joined the Whitelist </Text>
    </HStack>
    
    <Box p={2}>
      
      { (enable && numberOfWhitelisted < 10 )? renderButton()
      
      : ''}
       </Box>

    </Box>

    <Image src={'/crypto-devs.svg'} alt='heroImage' boxSize={{base:'70vw' , md:'40vw' }} />


    </Box>


    </Box>

  )

}

