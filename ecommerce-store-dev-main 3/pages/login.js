import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <div className="flex flex-wrap mx-auto">
        <div className="w-full lg:w-1/2">
          <Image
           className="w-full h-auto lg:h-full object-cover hidden lg:block"
            src="/../public/login.jpg" // Replace with your image URL
            alt="Login Image"
            width={300}
            height={350}
          />
        </div>
        <form className="w-full lg:w-1/2 p-8" onSubmit={handleSubmit(submitHandler)}>
          {/* Form content */}
          <div className="flex flex-col justify-center items-center">
            <Image alt="Sign up" width={30} height={30} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAPtJREFUSEvt1TFKQ0EQxvFfvIKkEEEQC229go12NuIdhFTBJtgoplBSWOkdrOwEBa9gkcYuKIRU4g1EDWzAPN7L5L0Q0mSrYWf2++9+zO7WzHnU5qxvWsARTrCXNvSCWzxEG5wG0MFpgdA5LiZBIsAx7pPAJe5S3MBZivfxXASJAK/YRRM3GZEhoI0nHFQFfGPlz+86PjMiaxjgC6tVAT9pYdFJo3zYRZFAlF8M4BBX2Il6PJN/S+38+H8+z9s+1kuKj8p72IoAI18rMsZtzzvBEjDmytKivE5bvEUf2Kh4Cd6xGV204VNxje2SkC5aCJ+KkrqTy6MfbWbYL7s+KRl1wSMtAAAAAElFTkSuQmCC" />
            <h1 className="text-xl font-bold leading-tight text-gray-900">Sign in</h1>
          </div>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Please enter email',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please enter a correct email',
                },
              })}
              className="w-full"
              id="email"
              autoFocus
            />
            {errors.email && <div className="text-red-500">{errors.email.message}</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Please enter password',
                minLength: { value: 6, message: 'Password should be more than 5 characters' },
              })}
              className="w-full"
              id="password"
            />
            {errors.password && <div className="text-red-500">{errors.password.message}</div>}
          </div>
          <div className="mb-4">
            <button type="submit" className="w-full primary-button">
              Login
            </button>
          </div>
          <div className="mb-4">
            Don't have an account? &nbsp;
            <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
