/* eslint-disable @next/next/no-img-element */
import Spinner from '@components/Spinner/Spinner';
import {
  Alert,
  Button,
  PaperProps, PasswordInput,
  Text, TextInput
} from '@mantine/core';
import { IconAlertCircle, IconSend } from '@tabler/icons';
import { validateState } from 'Utils/inputUtils';
import { notEmptyValidator, passwordValidator, validateEmail } from 'Utils/validators';
import { createNewUser } from 'data/api/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export function RegisterForm(props: PaperProps) {

  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm_password, setConfirmPassword] = useState<string>('');


  //Errors
 
  const [formError,setFormError]=useState<string>()
  const [loading,setLoading]=useState<Boolean>(false);

  const router=useRouter();

  function validate_inputs(){
    if(password!==confirm_password){
      setFormError('Passwords do not match')
    }
  }

  async function handleRegister() {
    try {
      setLoading(true)
      await createNewUser(email, password, firstname, lastname,username)
      router.replace('/login')
    } catch (error) {
      setFormError((error as Error).message)
    } finally{
      setLoading(false)
    }
  }


  return (
    <div className="" {...props}>

      <div className="text-center">
        <img src='/img/mountain.png' className='img-thumbnail avatar avatar-lg' alt='' />
      </div>
      <div className="text-center mb-4">
        <h3 className="h4 m-0 p-0">Create a new Account</h3>
        <small className="text-muted">Get started with TravelBuddy and enjoy your next holiday with new friends</small>
      </div>

      <form >
        <div className="row g-3">
          <div className="col-lg-6">
            <TextInput
              required
              label="First Name"
              placeholder="Eg: John"
              value={firstname}
              onChange={e => setFirstName(e.target.value)}

            />
          </div>
          <div className="col-lg-6">
            <TextInput
              required
              label="Last Name"
              placeholder="Eg: Doe"
              value={lastname}
              onChange={e => setLastName(e.target.value)}
              
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              required
              label="Username"
              placeholder="Eg: iamjohndoe"
              value={username}
              onChange={e => setUsername(e.target.value)}
              
            />
          </div>
          <div className="col-lg-6">
            <TextInput
              required
              label="Email"
              placeholder="user@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              
            />
          </div>
          <div className="col-lg-6">
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              
            />
          </div>
          <div className="col-lg-6">
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={confirm_password}
              onChange={e => setConfirmPassword(e.target.value)}
              
            />
          </div>
          {formError &&
            <div className="col-lg-12">
             <Alert icon={<IconAlertCircle size={18}/>} title='Error Occured' color='red' variant='light'>{formError}</Alert>
            </div>}
            
          <div className="col-lg-12">
            <Button leftIcon={loading?<Spinner/>:<IconSend size={18}/>} className='w-100' onClick={handleRegister}>{loading?'Creating your account...':'Create account'}</Button>
          </div>

        </div>


        <Link href={'/login'}>
          <Text size="xs" ta='center' variant='link' mt={'lg'}>
            {`Already have an account? Login now`}
          </Text>
        </Link>
      </form>
      
    </div>
  );
}