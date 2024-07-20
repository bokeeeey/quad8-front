interface CommunityPopOverOptionProps {
  isMine?: boolean;
  onClickDelete: () => void;
  onClickEdit: () => void;
  onClickReport: () => void;
}

export const communityPopOverOption = ({
  isMine,
  onClickDelete,
  onClickReport,
  onClickEdit,
}: CommunityPopOverOptionProps) => {
  return isMine
    ? [
        {
          label: '삭제하기',
          onClick: onClickDelete,
        },
        {
          label: '수정하기',
          onClick: onClickEdit,
        },
      ]
    : [
        {
          label: '신고하기',
          onClick: onClickReport,
        },
      ];
};
