import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {
    FormGroup, 
    Form, 
    Alert, 
    Modal, 
    ModalBody, 
    ModalHeader, 
    NavLink, 
    Label, 
    Input, 
    Button,  } from 'reactstrap';
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from '../../redux/types';

const RegisterModal = () => {
    const [ modal, setModal ] = useState(false);
    const [ form, setValue ] = useState({
        name : "",
        email : "",
        password : "",
    });

    const [ localMsg, setLocalMsg ] = useState('');
    const { errorMsg } = useSelector((state) => state.auth);

     const dispatch = useDispatch();
     const handleToggle = () => {
        dispatch({
            type : CLEAR_ERROR_REQUEST,
        })
        setModal(!modal)
     };

     useEffect(() => {
         try{
            setLocalMsg(errorMsg);
         }catch(e){
             console.error(e);
         }
     },[errorMsg]);

     const onChange = (e) => {
         setValue({
             ...form,
             [ e.target.name ] : e.target.value,
         })
     }

     const onSubmit = (e) => {
        e.preventDefault();//새로고침 방지
        const { name, email, password } = form;
        const newUser = { name, email, password };
      
        dispatch({
            type : REGISTER_REQUEST,
            payload : newUser,
        });
     }
     return (
         <div>
             <NavLink onClick={handleToggle} href="#" className="navbar-color">
                 회원가입
             </NavLink>
             <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}> 회원가입 </ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color="danger"> {localMsg} </Alert> : null}
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label for="name">이름</Label>
                            <Input 
                                type="text"
                                name="name"
                                id="name"
                                placeholder="이름을 입력해주세요."
                                onChange={onChange}
                            />
                        <Label for="email">이메일</Label>
                            <Input 
                                type="email"
                                name="email"
                                id="email"
                                placeholder="이메일을 입력해주세요."
                                onChange={onChange}
                            />
                           
                        <Label for="password">비밀번호</Label>
                            <Input 
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호를 입력해주세요."
                                onChange={onChange}
                            />
                            <Button color="dark" className="mt-2" block> 회원가입 </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
     );
};

export default RegisterModal;