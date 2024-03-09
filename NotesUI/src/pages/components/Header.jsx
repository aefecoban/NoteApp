import { UseUserContext } from '../../context/UserContext';
import { Box, Flex, Input, Button, Menu, MenuButton, MenuList, MenuItem, MenuGroup, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { HamburgerIcon, AddIcon, ChatIcon, AtSignIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';


export default function Header() {

    const UC = UseUserContext();
    let Loged = ((UC.value?.SessionID ?? undefined) !== undefined);
    let nav = useNavigate();

    return <>
        <Flex
            as="header"
            align="center"
            justify="space-between"
            padding="1rem"
            bg="gray.800"
            color="white"
            zIndex="999"
        >
            <Box>
                <h1 onClick={() => nav("/")} style={{ fontSize: "2rem", userSelect: "none" }}>Notes</h1>
            </Box>

            <Box flex="1" mr="2rem" ml="2rem">
                {
                    Loged && <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon color='gray.400' />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Ara..."
                            bg="gray.700"
                            color="white"
                            borderColor="transparent"
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </InputGroup>
                }
            </Box>

            <Flex>
                {
                    Loged ? <>
                        <Menu>
                            <MenuButton aria-label='Options' colorScheme="teal" as={Button} leftIcon={<HamburgerIcon />}>
                                <span>{UC.value.Name} {UC.value.Surname}</span>
                            </MenuButton>
                            <MenuList
                                bg="teal.600"
                            >
                                <MenuGroup title='Notes'>
                                    <MenuItem
                                        bg={'teal.500'}
                                        icon={<AddIcon />}
                                    >
                                        New Note
                                    </MenuItem>
                                    <MenuItem
                                        bg={'teal.500'}
                                        icon={<ChatIcon />}
                                    >
                                        My Notes
                                    </MenuItem>
                                </MenuGroup>
                                <MenuGroup title='Account'>
                                    <MenuItem
                                        bg={'teal.500'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            nav("/profile")
                                        }}
                                        icon={<AtSignIcon />}
                                    >
                                        My Profile
                                    </MenuItem>
                                    <MenuItem
                                        bg={'teal.500'}
                                        icon={<CloseIcon />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            nav("/quit")
                                        }}
                                    >
                                        Quit
                                    </MenuItem>
                                </MenuGroup>

                            </MenuList>
                        </Menu>
                    </> : <>
                        <Button colorScheme="whiteAlpha">Kayıt Ol</Button>
                        <Button colorScheme="teal" ml="1rem" mr="1rem"> Giriş Yap </Button>
                    </>
                }
            </Flex>
        </Flex>
    </>
}