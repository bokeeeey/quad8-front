'use client';

import { ToastContainer, ToastContainerProps } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toast/toastContainer.scss';

export default function Toast(props: ToastContainerProps) {
  return <ToastContainer {...props} />;
}
