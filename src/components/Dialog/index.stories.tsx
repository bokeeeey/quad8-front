import { Meta, StoryObj } from '@storybook/react';
import Dialog from './Dialog';

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  decorators: [
    (Story) => (
      <div id='modal'>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Alert: Story = {
  args: {
    type: 'alert',
    buttonText: '확인',
    onClick: () => {},
    message: 'alert 메세지 내용',
    isOpen: true,
    iconType: 'accept',
  },
};

export const Confirm: Story = {
  args: {
    type: 'confirm',
    buttonText: { left: '취소', right: '확인' },
    onClick: {
      left: () => {},
      right: () => {},
    },
    message: 'confirm 메세지 내용',
    isOpen: true,
    iconType: 'warn',
  },
};
