import React, { useRef, useCallback } from 'react';
import { Container, Content, Background } from './style';
import logoImg from './../../assets/logo.svg';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import Input from './../../components/Input';
import Button from './../../components/Button';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from './../../utils/getValidationErrors';
import { useAuth } from '../../hooks/AuthContext';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { signIn, user } = useAuth();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('Senha obrigatória')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const { email, password } = data;

            signIn({
                email,
                password
            });
        } catch (err) {
            const errors = getValidationErrors(err);
            formRef.current?.setErrors(errors);

            console.log(err);
        }

    }, [signIn]);

    return (
        <Container>
            <Content>
                <img src={logoImg} alt="Logo GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu logon</h1>

                    <Input icon={FiMail} name="email" type="email" placeholder="E-mail" />

                    <Input icon={FiLock} name="password" type="password" placeholder="Senha" />

                    <Button type="submit">Entrar</Button>

                    <a href="forgot">Esqueci minha senha</a>
                </Form>

                <a href="forgot">
                    <FiLogIn />
                    Criar conta
                </a>
            </Content>

            <Background />
        </Container>
    );
}


export default SignIn;