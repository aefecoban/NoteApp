import { Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import constVals from '../constVals';
import { UseUserContext } from '../context/UserContext';
import { BrowserDB } from '../functions/DB';

export default function Guest(){

    const toast = useToast();
    const UC = UseUserContext();

    function LoginAction(Username, Password){
        toast({
            title: 'Loading.',
            description: "Waiting for server.",
            status: 'info',
            duration: 2000,
            isClosable: true,
        });

        fetch(constVals.URLS.LOGIN, { method : "POST", headers: { "Content-Type": "application/json" }, body : JSON.stringify({
            username : Username,
            password : Password
        })}).then((v) => v.json()).then((v) => {
            toast.closeAll();
            if(v?.success){
                BrowserDB.set("user", v.data.SessionID);
                UC.setter({SessionID : v.data.SessionID});
                toast({
                    title: 'Success',
                    description: "You logged.",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }else{
                toast({
                    title: 'Error',
                    description: v.error,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }).catch((error) => {
            toast({
                title: 'Error',
                description: "Server can't be reached.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        })
    }

    function RegisterAction(Username, Password, Mail, Name, Surname){
        toast({
            title: 'Loading.',
            description: "Waiting for server.",
            status: 'info',
            duration: 2000,
            isClosable: true,
        });

        
        fetch(constVals.URLS.REGISTER, { method : "POST", headers: { "Content-Type": "application/json" }, body : JSON.stringify({
            username : Username,
            password : Password,
            mail : Mail,
            name : Name,
            surname : Surname
        })}).then((v) => v.json()).then((v) => {
            toast.closeAll();
            if(v?.success){
                BrowserDB.set("user", v.data.SessionID);
                UC.setter({SessionID : v.data.SessionID});
                toast({
                    title: 'Success',
                    description: "You logged.",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            }else{
                toast({
                    title: 'Error',
                    description: v.error,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }).catch((error) => {
            toast({
                title: 'Error',
                description: "Server can't be reached.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        })
    }

    return <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            bg="gray.100"
            color="gray.800"
        >
        <Tabs
            width={'50%'}
            colorScheme='teal'
            size='lg'
            bgColor="white"
            borderRadius={'1rem'}
            color='gray.600'
            ringOffsetColor="gray.800"
            isFitted
        >
            <TabList bgColor="transparent"
            >
                <Tab>Login</Tab>
                <Tab>Register</Tab>
            </TabList>
            <TabPanels>
                <Login LoginCallback={LoginAction} />
                <Register RegisterCallback={RegisterAction} />
            </TabPanels>
        </Tabs>
    </Box>
}

function Login({LoginCallback}){

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    return <TabPanel>
        <FormControl
            mt="1rem"
            mb="1rem"
        >
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} type='text' bgColor="white" />
        </FormControl>
        <FormControl
            mt="1rem"
            mb="1rem"
        >
            <FormLabel>Password</FormLabel>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type='password' bgColor="white" />
        </FormControl>

        <FormControl>
            <Button colorScheme='blue' onClick={() => LoginCallback(username, password)}>Login</Button>
        </FormControl>
    </TabPanel>

}

function Register({RegisterCallback}){

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [mail, setMail] = useState("");
    let [name, setName] = useState("");
    let [surname, setSurname] = useState("");

    return <TabPanel>
        <FormControl
            mt="1rem"
            mb="1rem"
        >
            <FormLabel>Username</FormLabel>
            <Input type='text' bgColor="white" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl
            mt="1rem"
            mb="1rem"
        >
            <FormLabel>Password</FormLabel>
            <Input type='password' bgColor="white" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <FormControl
            mt="1rem"
            mb="1rem"
        >
            <FormLabel>Mail</FormLabel>
            <Input type='mail' bgColor="white" value={mail} onChange={(e) => setMail(e.target.value)} />
        </FormControl>
        <Flex
            mt="1rem"
            mb="1rem"
            direction='row'
            align="center"
            justify="space-between"
            bgColor="transparent"
        >
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input type='text' bgColor="white" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
                <FormLabel>Surname</FormLabel>
                <Input type='text' bgColor="white" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </FormControl>
        </Flex>

        <FormControl>
            <Button colorScheme='blue' onClick={() => RegisterCallback(username, password, mail, name, surname)}>Register</Button>
        </FormControl>
    </TabPanel>

}