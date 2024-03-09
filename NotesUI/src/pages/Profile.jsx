import { Container, Box, Stack, Button, Card, CardHeader, CardBody, Heading, StackDivider, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { UseUserContext } from '../context/UserContext';

export default function Profile() {

    let UC = UseUserContext();

    return <Container maxW="container.lg" mt={"2rem"} mb={"2rem"}>

        <Card mt={"2rem"} >
            <CardHeader>
                <Heading size='md'>{UC.value.Name} {UC.value.Surname} ({UC.value.Username})</Heading>
            </CardHeader>
            <CardBody>
                <Button leftIcon={<AddIcon />} colorScheme='teal' variant='solid'>New Note</Button>
            </CardBody>
        </Card>

        <Card mt={"2rem"} >
            <CardHeader>
                <Heading size='md'>My Notes</Heading>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                            Summary
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                            View a summary of all your clients over the last month.
                        </Text>
                    </Box>
                    
                </Stack>
            </CardBody>
        </Card>


    </Container>
}