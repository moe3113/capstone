import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';
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
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

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
    <Layout title="Create Account">
      <form className="w-full max-w-md mx-auto mt-8" onSubmit={handleSubmit(submitHandler)}>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex flex-col justify-center items-center">
            <Image alt="Sign up" width={30} height={30} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAPtJREFUSEvt1TFKQ0EQxvFfvIKkEEEQC229go12NuIdhFTBJtgoplBSWOkdrOwEBa9gkcYuKIRU4g1EDWzAPN7L5L0Q0mSrYWf2++9+zO7WzHnU5qxvWsARTrCXNvSCWzxEG5wG0MFpgdA5LiZBIsAx7pPAJe5S3MBZivfxXASJAK/YRRM3GZEhoI0nHFQFfGPlz+86PjMiaxjgC6tVAT9pYdFJo3zYRZFAlF8M4BBX2Il6PJN/S+38+H8+z9s+1kuKj8p72IoAI18rMsZtzzvBEjDmytKivE5bvEUf2Kh4Cd6xGV204VNxje2SkC5aCJ+KkrqTy6MfbWbYL7s+KRl1wSMtAAAAAElFTkSuQmCC" />
            <h1 className="text-xl font-bold leading-tight text-gray-900">Sign up</h1>
          </div>
          <div className="flex space-x-4">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
              <input
                type="text"
                id="name"
                autoFocus
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                {...register('name', {
                  required: 'Please enter your name',
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                {...register('email', {
                  required: 'Please enter your email',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                    message: 'Please enter a correct email',
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
              {...register('password', {
                required: 'Please enter password',
                minLength: { value: 6, message: 'Password should be more than 5 characters' },
              })}
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
              {...register('confirmPassword', {
                required: 'Please enter confirm password',
                validate: (value) => value === getValues('password'),
                minLength: {
                  value: 6,
                  message: 'Confirm password should be more than 5 characters',
                },
              })}
            />
            {errors.confirmPassword && (
              <div className="text-red-500">{errors.confirmPassword.message}</div>
            )}
            {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">The password does not match</div>
            )}
          </div>

          <div className="mb-4 flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-light text-gray-500">
                I accept the <a href="#" className="font-medium text-primary-600 hover:underline">Terms and Conditions</a>
              </label>
            </div>
          </div>

          <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Create an account
          </button>

          <p className="text-sm font-light text-gray-500">
            already have an account? &nbsp;
            <Link href={`/login`}>Sign in</Link>
          </p>
        </div>
      </form>

      {/* <form
        className="w-full justify-center items-center"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="flex-col">
        <h1 className="mb-4 text-xl">Create Account</h1>
        <div className="flex justify-between">
          <div className="mb-4">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="w-full"
              id="name"
              autoFocus
              {...register('name', {
                required: 'Please enter your name',
              })}
            />
            {errors.name && (
              <div className="text-red-500">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Please enter your email',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please enter a correct email',
                },
              })}
              className="w-full"
              id="email"
            ></input>
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password should be more than 5 chars' },
            })}
            className="w-4/12"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-4/12"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password should be more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">The password does not match</div>
            )}
        </div>

        <div className="mb-4 ">
          <button className="primary-button w-full">Register</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
        </div>
        </div>
      </form> */}
    </Layout>
  );
}
