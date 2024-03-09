import { Container, Box, Flex, Button, Card, CardHeader, CardBody, Heading, IconButton, Text } from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Req from '../functions/Req';
import constVals from '../constVals';
import { UseUserContext } from '../context/UserContext';

export default function Home() {

    let nav = useNavigate();
    let UC = UseUserContext();
    let [notes, setNotes] = useState([]);

    useEffect(() => {

        Req(constVals.URLS.MYNOTES, "POST", {}, UC.value.SessionID).then((v) => v.json()).then((res) => {
            if (res.success) {
                setNotes(res.data);
                console.log(res.data);
            }
        });

    }, []);

    return <Container maxW="container.lg" mt={"2rem"} mb={"2rem"}>

        <Card mt={"2rem"} >
            <CardBody>
                <Button onClick={(e) => {
                    e.preventDefault();
                    nav("/NewNote");
                }} leftIcon={<AddIcon />} colorScheme='teal' variant='solid'>New Note</Button>
            </CardBody>
        </Card>

        <Card padding={5} mt={5}>
        <Heading size='md' mb={5}>Notes</Heading>
        {
            notes.map((note, index) => {
                return <Card key={index} mb={5}
                    cursor={"pointer"}
                    _hover={{
                        bg: "cyan.50",
                        transform: "scale(1.01)",
                        transition: "all 0.3s ease",
                    }}
                >
                    <CardHeader>
                        <Flex spacing='4'>
                            <Flex
                                flex='1'
                                gap='4'
                                alignItems='center'
                                flexWrap='wrap'
                                onClick={(e) => {
                                    e.preventDefault();
                                    nav("/note/" + note.ID);
                                }}
                            >
                                <Box>
                                    <Heading size='md'>{note.Title}</Heading>
                                    <Text size='sm' mt="3" color="gray.400">{note.CreatedAt}</Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <IconButton
                                    variant='ghost'
                                    colorScheme='red'
                                    aria-label='delete menu'
                                    ml={2}
                                    mr={2}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        nav("/delete/" + note.ID);
                                    }}
                                    icon={<DeleteIcon />}
                                />
                                <IconButton
                                    variant='ghost'
                                    colorScheme='green'
                                    aria-label='delete menu'
                                    ml={2}
                                    mr={2}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        nav("/edit/" + note.ID);
                                    }}
                                    icon={<EditIcon />}
                                />
                            </Flex>
                        </Flex>
                    </CardHeader>
                </Card>
            })
        }
        </Card>

    </Container>
}