/* eslint-disable @next/next/no-img-element */
import {
  Anchor, Button,
  Divider, Grid, Group, Paper, PaperProps, PasswordInput, Stack, Text, TextInput
} from '@mantine/core';
import { useState } from 'react';
import GoogleImg from './google.png'
import { IconBrandGoogle, IconLock } from '@tabler/icons'
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../firebase/init'
import parseFirebaseError from '../../firebase/firebaseErrorParser';
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router';

export function LoginForm(props: PaperProps) {

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const router=useRouter()

  async function handleLogin() {
    try {
      if (!email || !password)
        return
      const auth = getAuth(app)
      const user = await signInWithEmailAndPassword(auth, email, password)
      router.replace('/app/dashboard')
    } catch (error) {
      console.error(error)
      setPasswordError(parseFirebaseError(error).message)
    }
  }


  return (
    <div className="" {...props}>

      <div className="text-center">
        <img src='/img/mountain.png' className='img-thumbnail avatar avatar-lg' alt='' />
      </div>
      <div className="text-center mb-4">
        <h3 className="h4 m-0 p-0">Welcome to TravelBuddy</h3>
        <small className="text-muted">Get started with TravelBuddy and enjoy your next holiday with new friends</small>
      </div>
      <form >
        <Stack mt='lg'>
          <TextInput
            required
            label="Email"
            placeholder="user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={emailError}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={passwordError}
          />
          <div className="col-lg-12">
            <Button leftIcon={<IconLock size='18' />} className='w-100' onClick={handleLogin}>Login</Button>
          </div>
        </Stack>

        <Link href={'/register'}>
          <Text size="xs" ta='center' variant='link' mt={'lg'}>
            {`Don't have an account yet? Create one.`}
          </Text>
        </Link>
      </form>
      <Divider label="Or continue with email" labelPosition="center" my="lg" />
      <Group grow mb="md" mt="md">
        <Button variant='outline' leftIcon={<IconBrandGoogle />} color='green'  >Continue with Google</Button>
      </Group>
    </div>
  );
}