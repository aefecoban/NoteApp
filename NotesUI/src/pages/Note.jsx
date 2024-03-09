import { Container, Flex, Button, Card, CardHeader, CardBody, Menu, MenuItem, MenuList, MenuButton, Link } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import constVals from '../constVals';
import { UseUserContext } from '../context/UserContext';
import Req from '../functions/Req';
import ReactMarkdown from 'react-markdown'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
  } from '@chakra-ui/react';

export default function Note() {

    let nav = useNavigate();
    let params = useParams();
    let UC = UseUserContext();
    let [note, setNote] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure()
    let [headings, setHeadings] = useState([]);

    function SaveFile(){
        const fileContent = `# ${note.Title}\n\n${note.Message}`;
        const fileName = `${note.Title}.md`;

        const element = document.createElement("a");
        const file = new Blob([fileContent], {type: "text/plain"});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    useEffect(() => {
        let noteID = params.id;

        Req(constVals.URLS.NOTE, "POST", { ID: noteID }, UC.value.SessionID).then((v) => v.json()).then((res) => {
            if (res.success) {
                setNote(res.data);
            }
        });

    }, []);

    useEffect(() => {
        if(note.Message){
            let message = note.Message;
            const headings = message.match(/^#+\s+.*/gm);
            for(let i = 0; i < headings.length; i++){
                headings[i] = headings[i].replace(/^#+\s+/g, '');
            }
            setHeadings(headings);
        }
    }, [note]);

    return <>
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Table of Content</DrawerHeader>

                <DrawerBody className='Content'>
                    <ul>
                        {
                            headings.map((h, index) => {
                                return <li key={index}><Link color='teal' href={`#${h}`}>{h}</Link></li>
                            })
                        }
                    </ul>
                </DrawerBody>
            </DrawerContent>
        </Drawer>

        <Container maxW="container.lg" mt={"2rem"} mb={"2rem"}>

        <Flex>
            <Flex flex="1" alignItems={"center"}>
                <Button colorScheme="teal" size={"sm"} variant='solid' onClick={onOpen}>
                    Table of Content
                </Button>
            </Flex>

            <Flex flex="1" justifyContent='flex-end' alignItems='center'>
                <Button colorScheme='teal' size={"sm"} variant='solid' mx={2}
                    onClick={(e) => {
                        e.preventDefault();
                        nav("/edit/" + note.ID);
                    }}
                >Edit</Button>
                <Button colorScheme='red' size={"sm"} variant='solid' mx={2}
                    onClick={(e) => {
                        e.preventDefault();
                        nav("/delete/" + note.ID);
                    }}
                >Delete</Button>
                <Menu size={"sm"} variant='solid' ml={2}>
                    <MenuButton as={Button}>
                        Export
                    </MenuButton>
                    <MenuList>
                        <MenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                SaveFile();
                            }}
                        >Save As File</MenuItem>
                        <MenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                nav("/export/" + note.ID);
                            }}
                        >Show In Page</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>

        <Card mt={"2rem"} className='Content'>

            <CardHeader py={"0 !important"} my={"0 !important"}>
                <h1>{note.Title}</h1>
            </CardHeader>

            <CardBody pt={"0 !important"} mt={"0 !important"}>
                <ReactMarkdown>
                    {note.Message}
                </ReactMarkdown>
            </CardBody>
        </Card>

    </Container>
    </>
}