import { useToast, Container, Box, Stack, CardFooter, Input, Button, Card, CardHeader, CardBody, Heading, StackDivider, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { UseUserContext } from '../context/UserContext';

import MDEditor, { selectWord } from "@uiw/react-md-editor";
import { useState, useEffect } from 'react';
import Req from '../functions/Req';
import constVals from '../constVals';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditNote() {

    let UC = UseUserContext();
    let params = useParams();
    let [ID, setID] = useState(-1);
    let [Title, setTitle] = useState("");
    let [MarkDown, setMarkDown] = useState("");

    useEffect(() => {
        let noteID = params.id;

        Req(constVals.URLS.NOTE, "POST", {ID : noteID}, UC.value.SessionID).then((v) => v.json()).then((res) => {
            if(res.success){
                setID(res.data.ID);
                setTitle(res.data.Title);
                setMarkDown(res.data.Message);
            }
        });

    }, []);

    const toast = useToast();
    let nav = useNavigate();
    
    function SaveNote(){
        let vals = {
            ID : ID,
            Title : Title,
            Message : MarkDown
        }
        Req(constVals.URLS.UDPATENOTE, "POST", vals, UC.value.SessionID).then((v) => v.json()).then((res) => {
            if(res.success){
                toast({
                    title: 'Success',
                    description: "Note saved.",
                    status: 'success',
                    duration: 2000,
                });
                setTimeout(() => {
                    nav("/");
                }, 2000);
            }else{
                toast({
                    title: 'Error',
                    description: "Error.",
                    status: 'warning',
                    duration: 2000,
                });
            }
        });
    }

    return <Container maxW="container.lg" mt={"2rem"} mb={"2rem"}>

        <Card mt={"2rem"} >
            <CardHeader>
                <Heading size='md'>
                    <Input
                        placeholder='Title'
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Heading>
            </CardHeader>

            <CardBody>
                <MDEditor
                    className='EditorMD'
                    height={300}
                    value={MarkDown}
                    onChange={setMarkDown}
                />
            </CardBody>

            <CardFooter>
                <Button onClick={(e) => { e.preventDefault(); SaveNote(); }} variant={"solid"} colorScheme={"teal"}>Save</Button>
            </CardFooter>
        </Card>


    </Container>
}

/*
                
                */